import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, BarChart3, ChartLine, ChartPie } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const HeroSection = () => {
  const navigate = useNavigate();
  const user = useUser();

  const { data: subscriptionData } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      if (!user) return { subscribed: false };
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleCTAClick = async () => {
    if (!user) {
      navigate('/signup');
      return;
    }

    if (subscriptionData?.subscribed) {
      navigate('/dashboard');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session');
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to start checkout process');
    }
  };

  const getButtonText = () => {
    if (!user) return "Get Started";
    if (subscriptionData?.subscribed) return "Dashboard";
    return "Buy Access";
  };

  return (
    <section className="relative bg-gradient-to-b from-primary-100 to-white pt-32 pb-20 px-4 md:pt-40 overflow-hidden">
      {/* Background Graphics */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-300 rounded-full opacity-20 blur-3xl"></div>
        
        {/* Floating Symbols */}
        <div className="absolute top-20 left-[10%] text-primary-300 animate-float-slow">
          <CheckCircle2 size={32} />
        </div>
        <div className="absolute top-40 right-[15%] text-primary-400 animate-float-delayed">
          <BarChart3 size={40} />
        </div>
        <div className="absolute bottom-20 left-[20%] text-primary-300 animate-float">
          <ChartLine size={36} />
        </div>
        <div className="absolute top-60 right-[25%] text-primary-400 animate-float-slow">
          <ChartPie size={32} />
        </div>
        <div className="absolute bottom-40 right-[10%] text-primary-300 animate-float-delayed">
          <CheckCircle2 size={28} />
        </div>
      </div>
      
      <div className="container mx-auto max-w-6xl relative">
        <div className="text-center">
          <h1 className="font-outfit text-4xl md:text-6xl font-bold text-primary-700 mb-6">
            Transform Your Goals into Reality
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto font-outfit">
            Track, visualize, and achieve your goals with powerful analytics and intuitive progress tracking.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 font-outfit"
            onClick={handleCTAClick}
          >
            {getButtonText()} <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};