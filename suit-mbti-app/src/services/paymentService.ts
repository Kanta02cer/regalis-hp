import { loadStripe } from '@stripe/stripe-js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// FIXME: 本番環境では環境変数から取得するようにする
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder';

export const createOrder = async (orderData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const createCheckoutSession = async (orderId: string, tenantId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payment/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: orderId,
        tenant_id: tenantId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const redirectToStripe = async (url: string) => {
  window.location.href = url;
};
