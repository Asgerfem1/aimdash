import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function PricingSection() {
  const [promoCode, setPromoCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({ promoCode: promoCode.trim() || null }),
      });

      const { url, error } = await response.json();
      if (error) {
        toast.error(error);
        return;
      }

      window.location.href = url;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout process");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Get lifetime access to all features
          </p>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-lg overflow-hidden lg:max-w-none lg:flex">
          <div className="px-6 py-8 lg:p-12">
            <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Lifetime Access
            </h3>
            <p className="mt-6 text-base text-gray-500">
              Get unlimited access to all features forever with a one-time payment
            </p>
            <div className="mt-8">
              <div className="flex items-center">
                <h4 className="flex-shrink-0 pr-4 text-4xl font-bold text-gray-900">
                  $24
                </h4>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="max-w-[200px]"
                />
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Get Started"}
              </Button>
            </div>
          </div>
          <div className="py-8 px-6 text-center bg-gray-50 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12">
            <p className="text-lg leading-6 font-medium text-gray-900">
              What's included:
            </p>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start">
                <span className="ml-3 text-base text-gray-500">
                  Unlimited goal tracking
                </span>
              </li>
              <li className="flex items-start">
                <span className="ml-3 text-base text-gray-500">
                  AI-powered goal planning
                </span>
              </li>
              <li className="flex items-start">
                <span className="ml-3 text-base text-gray-500">
                  Progress analytics
                </span>
              </li>
              <li className="flex items-start">
                <span className="ml-3 text-base text-gray-500">
                  Priority support
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}