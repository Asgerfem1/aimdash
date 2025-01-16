import { useNavigate } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { ScreenshotsSection } from "@/components/home/ScreenshotsSection";
import { PricingSection } from "@/components/home/PricingSection";
import { CTASection } from "@/components/home/CTASection";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const user = useUser();

  const { data: hasPurchased, isLoading } = useQuery({
    queryKey: ['userPurchase', user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase
        .from('user_purchases')
        .select('id')
        .eq('user_id', user.id)
        .single();
      return !!data;
    },
    enabled: !!user,
  });

  const handleAction = async (promoCode?: string) => {
    if (!user) {
      navigate("/signup");
      return;
    }

    if (hasPurchased) {
      navigate("/dashboard");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { promoCode },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to initiate checkout. Please try again.");
    }
  };

  const getButtonText = () => {
    if (!user) return "Get Started";
    if (hasPurchased) return "Go to Dashboard";
    return "Purchase Access";
  };

  return (
    <div className="min-h-screen font-outfit">
      <Navigation />
      <HeroSection onAction={() => handleAction()} buttonText={getButtonText()} isLoading={isLoading} />
      <FeaturesSection />
      <ScreenshotsSection />
      <PricingSection onAction={handleAction} buttonText={getButtonText()} isLoading={isLoading} />
      <CTASection onAction={() => handleAction()} buttonText={getButtonText()} isLoading={isLoading} />
      <Footer />
    </div>
  );
};

export default Index;