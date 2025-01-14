import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, CheckCircle2, Target } from "lucide-react";

const features = [
  {
    title: "Set Your Goals",
    description: "Define clear, actionable goals with deadlines and priorities",
    icon: Target,
  },
  {
    title: "Track Progress",
    description: "Monitor your progress with visual dashboards and metrics",
    icon: BarChart3,
  },
  {
    title: "Achieve Milestones",
    description: "Break down goals into manageable milestones and celebrate wins",
    icon: CheckCircle2,
  },
];

export const FeaturesSection = () => {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-primary-700">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="text-primary mb-4">
                  <feature.icon size={40} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};