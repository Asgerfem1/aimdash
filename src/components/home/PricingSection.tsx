import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface PricingSectionProps {
  onAction: (promoCode?: string) => void;
  buttonText: string;
  isLoading: boolean;
}

const pricingPlan = {
  name: "Lifetime Access",
  price: "$24",
  description: "One-time payment for all features",
  features: [
    "Unlimited goals",
    "Goal progress tracking",
    "Task management",
    "Priority levels",
    "Recurring goals",
    "Visual analytics",
    "Custom categories",
    "AI Goal Planning Assistant",
  ],
};

export const PricingSection = ({ onAction, buttonText, isLoading }: PricingSectionProps) => {
  const [promoCode, setPromoCode] = useState("");

  const handleSubmit = () => {
    onAction(promoCode);
  };

  return (
    <section id="pricing" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-primary-700">
          Simple, One-Time Pricing
        </h2>
        <div className="max-w-lg mx-auto">
          <Card className="border-2 border-primary shadow-xl">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-2">{pricingPlan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">{pricingPlan.price}</span>
                <span className="text-gray-600"> one-time</span>
              </div>
              <p className="text-gray-600 mb-6">{pricingPlan.description}</p>
              <ul className="space-y-3 mb-6">
                {pricingPlan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <CheckCircle2 className="text-primary mr-2 h-5 w-5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="space-y-4">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full"
                />
                <Button 
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {buttonText}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};