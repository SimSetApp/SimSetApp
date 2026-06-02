import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const { amount } = await req.json();

    if (!amount || isNaN(amount) || Number(amount) < 1) {
      return Response.json({ error: "Invalid donation amount" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "https://simsetapp.base44.app";
    const WIX_API_KEY = Deno.env.get("WIX_PAYMENTS_API_KEY");
    const WIX_SITE_ID = Deno.env.get("WIX_PAYMENTS_SITE_ID");

    const response = await fetch(
      "https://www.wixapis.com/payments/platform/v1/checkout-sessions/construct",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": WIX_API_KEY,
          "wix-site-id": WIX_SITE_ID,
        },
        body: JSON.stringify({
          cart: {
            items: [
              {
                name: "SimSetApp Donation",
                quantity: 1,
                price: Number(amount).toFixed(2),
              },
            ],
          },
          callbackUrls: {
            postFlowUrl: `${origin}/support`,
            thankYouPageUrl: `${origin}/thank-you`,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Wix Payments error:", JSON.stringify(data));
      return Response.json({ error: data.message || "Payment error" }, { status: response.status });
    }

    return Response.json({ redirectUrl: data.checkoutSession.redirectUrl });
  } catch (error) {
    console.error("createCheckout error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});