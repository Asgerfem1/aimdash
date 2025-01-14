import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";

const screenshots = [
  {
    title: "Goal Dashboard",
    description: "Track all your goals in one place with our intuitive dashboard",
    image: "/lovable-uploads/2e05b854-031d-4037-a704-12139d5a50d9.png",
  },
  {
    title: "AI Assistant",
    description: "Get personalized guidance with our AI Goal Planning Assistant",
    image: "/lovable-uploads/d289ccb1-450a-4890-b18e-28b96857ceee.png",
  },
  {
    title: "Progress Analytics",
    description: "Visualize your progress with detailed analytics and insights",
    image: "/lovable-uploads/c26efbfd-6f70-4f17-a3f4-d30278c7b00f.png",
  },
];

export const ScreenshotsSection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-primary-100">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-primary-700">
          See AimDash in Action
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {screenshots.map((screenshot, index) => (
            <div key={index} className="space-y-4">
              <div 
                className="group relative aspect-video rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
                onClick={() => setSelectedImage(screenshot.image)}
              >
                <img
                  src={screenshot.image}
                  alt={screenshot.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-medium">Click to View</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center">{screenshot.title}</h3>
              <p className="text-gray-600 text-center">{screenshot.description}</p>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute left-4 top-4 z-50 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <img
            src={selectedImage || ''}
            alt="Full size preview"
            className="w-full h-full object-contain"
          />
        </DialogContent>
      </Dialog>
    </section>
  );
};