import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import * as admin from 'firebase-admin';

let stripe: Stripe | null = null;
try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
        apiVersion: '2023-10-16' as any, // Använd standard Stripe API-version
    });
} catch (e) {
    console.error('Stripe Init Error:', e);
}

// Initiera Firebase Admin (Undvik varningar om den redan är initierad)
if (!admin.apps.length) {
    try {
        const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (serviceAccountRaw) {
            const serviceAccount = JSON.parse(serviceAccountRaw);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        }
    } catch (error) {
        console.error('Firebase Admin Init Error:', error);
    }
}

const getDb = () => admin.apps.length ? admin.firestore() : null;

export async function POST(req: Request) {
    const payload = await req.text();
    const sig = req.headers.get('stripe-signature');

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Missing webhook signature or secret' }, { status: 400 });
    }

    if (!stripe) {
        return NextResponse.json({ error: 'Stripe not initialized' }, { status: 500 });
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
        console.error('Webhook signature verification failed.', err.message);
        return NextResponse.json({ error: err.message }, { status: 400 });
    }

    // Lyssna på när en betalning är genomförd
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // userId skickas med som client_reference_id från länken
        const userId = session.client_reference_id;
        const customerEmail = session.customer_details?.email;

        console.log(`Payment successful for user: ${userId}, email: ${customerEmail}`);

        const db = getDb();
        if (db) {
            try {
                if (userId) {
                    // Uppdatera användaren till Pro i Firebase baserat på ID
                    await db.collection('users').doc(userId).set({
                        isPro: true,
                        proActivatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    }, { merge: true });
                    console.log(`User ${userId} upgraded to Pro.`);
                } else if (customerEmail) {
                    // Fallback: Om vi inte har UID, sök på epost (ifall de betalat från en öppen länk)
                    const usersSnapshot = await db.collection('users').where('email', '==', customerEmail).get();
                    if (!usersSnapshot.empty) {
                        const batch = db.batch();
                        usersSnapshot.forEach((doc: any) => {
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
                console.error('Error updating Firebase:', error);
                return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
            }
        } else {
            console.error('Firebase DB not initialized in webhook');
        }
    }

    return NextResponse.json({ received: true });
}
