const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2023-10-16",
});

admin.initializeApp();
const db = admin.firestore();

exports.stripeWebhook = onRequest({ invoker: "public" }, async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Lyssna på när en betalning är genomförd
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    
    // userId skickas med som client_reference_id från länken
    const userId = session.client_reference_id;
    const customerEmail = session.customer_details && session.customer_details.email;

    console.log(`Payment successful for user: ${userId}, email: ${customerEmail}`);

    try {
      if (userId) {
        // Uppdatera användaren till Pro i Firebase baserat på ID
        await db.collection("users").doc(userId).set({
          isPro: true,
          proActivatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        console.log(`User ${userId} upgraded to Pro.`);
      } else if (customerEmail) {
        // Fallback: Om vi inte har UID, sök på epost (ifall de betalat från en öppen länk utan vara inloggad)
        const usersSnapshot = await db.collection("users").where("email", "==", customerEmail).get();
        if (!usersSnapshot.empty) {
          const batch = db.batch();
          usersSnapshot.forEach((doc) => {
            batch.set(doc.ref, { 
              isPro: true,
              proActivatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
          });
          await batch.commit();
          console.log(`User(s) with email ${customerEmail} upgraded to Pro.`);
        }
      }
    } catch (error) {
      console.error("Error updating Firebase:", error);
      res.status(500).send("Database update failed");
      return;
    }
  }

  res.json({ received: true });
});
