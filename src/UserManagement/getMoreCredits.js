import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';

const stripePromise = loadStripe('pk_live_51PFR81J7QeQFz6fCpV20vjopAngijB7mz5xCqOS66XLnocpkZcHJVmNWL5Dv5anaCfwYht4VDQgB5z2am5XKjBqc00KGKRBc0L');
const testStripePromise = loadStripe('pk_test_51OJn7eGPqEG8TQsofkujN7Mz1bbsNGLHBqWUDO1iayILJeEWMKXr3OPDgVpZbJUL3mXKQZ4nKfx2RRh8nK9zUN5L00ezkF6YDc');

// New function that does not pass the priceId and takes email and cognitoUserId as props
export const getMoreCredits = async (email, cognitoUserId) => {
    try {
        if (!email || !cognitoUserId) {
            throw new Error('Missing email or user ID');
        }

        const stripe = await stripePromise;
        const testStripe = await testStripePromise;
        const requestBody = { 
            email: email,
            cognitoUserId: cognitoUserId
        };

        const response = await fetch('https://qoob6j5uec.execute-api.us-east-1.amazonaws.com/dev', { // Use the testing URL or switch to production as necessary
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ body: JSON.stringify(requestBody) }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        const { sessionId } = JSON.parse(responseData.body);
        await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
        console.error('Error redirecting to Stripe checkout:', error);
    }
};
