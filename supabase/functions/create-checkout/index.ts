import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@13.10.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { promoCode } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      req.headers.get("Authorization")?.replace("Bearer ", "") ?? ""
    );

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    let discountPercent = 0;
    if (promoCode) {
      const { data: promoData, error: promoError } = await supabaseClient
        .from('promo_codes')
        .select('*')
        .eq('code', promoCode)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (promoError) {
        throw new Error("Invalid promo code");
      }

      if (promoData.max_uses && promoData.current_uses >= promoData.max_uses) {
        throw new Error("Promo code has reached maximum uses");
      }

      discountPercent = promoData.discount_percent;

      // Update promo code usage
      await supabaseClient
        .from('promo_codes')
        .update({ current_uses: promoData.current_uses + 1 })
        .eq('id', promoData.id);
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const unitAmount = 2400; // $24.00
    const discountedAmount = Math.round(unitAmount * (1 - discountPercent / 100));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'AimDash Lifetime Access',
              description: 'One-time payment for all features',
            },
            unit_amount: discountedAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/verify-purchase?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/#pricing`,
      metadata: {
        user_id: user.id,
        promo_code: promoCode || null,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});