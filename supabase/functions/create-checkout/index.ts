import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@13.10.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
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

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1QdHkRCrd02GcI0rC2Vmj6Kn",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/dashboard`,
      cancel_url: `${req.headers.get("origin")}/#pricing`,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id, // Store user ID in metadata for webhook
      },
    });

    // Create a purchase record in the database
    const { error: purchaseError } = await supabaseClient
      .from('user_purchases')
      .insert([
        { user_id: user.id }
      ]);

    if (purchaseError) {
      console.error('Error creating purchase record:', purchaseError);
      throw new Error('Failed to create purchase record');
    }

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