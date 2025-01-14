import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  onAction: () => void;
  buttonText: string;
  isLoading: boolean;
}

export const CTASection = ({ onAction, buttonText, isLoading }: CTASectionProps) => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-primary-100">
      <div className="container mx-auto max-w-6xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-700">
          Ready to Achieve Your Goals?
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of users who are transforming their goals into reality with AimDash.
        </p>
        <Button 
          size="lg" 
          className="text-lg px-8"
          onClick={onAction}
          disabled={isLoading}
        >
          {buttonText} <ArrowRight className="ml-2" />
        </Button>
      </div>
    </section>
  );
};