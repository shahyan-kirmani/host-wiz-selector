import { useState } from "react";
import { HostingForm, HostingRequirements } from "@/components/HostingForm";
import { HostingRecommendations } from "@/components/HostingRecommendations";
import { Button } from "@/components/ui/button";
import { Server, Zap, Shield, Users } from "lucide-react";

const Index = () => {
  const [requirements, setRequirements] = useState<HostingRequirements | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const handleFormSubmit = (req: HostingRequirements) => {
    setRequirements(req);
    setShowRecommendations(true);
  };

  const handleStartOver = () => {
    setRequirements(null);
    setShowRecommendations(false);
  };

  if (showRecommendations && requirements) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 py-8 px-4">
        <HostingRecommendations 
          requirements={requirements} 
          onStartOver={handleStartOver}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary-glow/10" />
        <div className="relative px-4 py-16 sm:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary-glow rounded-2xl mb-8 shadow-xl">
              <Server className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Hosting Provider
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Tell us about your website requirements and get personalized hosting recommendations 
              tailored to your needs, budget, and technical expertise.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto mb-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Smart Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Our algorithm analyzes your requirements to find the best matches
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Trusted Providers</h3>
                <p className="text-sm text-muted-foreground">
                  Only reputable hosting companies with proven track records
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Personalized</h3>
                <p className="text-sm text-muted-foreground">
                  Recommendations based on your specific needs and experience level
                </p>
              </div>
            </div>

            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-xl transition-all duration-300 text-lg px-8 py-3"
              onClick={() => document.getElementById('hosting-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Started - It's Free!
            </Button>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div id="hosting-form" className="px-4 py-16">
        <HostingForm onSubmit={handleFormSubmit} />
      </div>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-16">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Server className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">HostWiz</span>
            </div>
            <p className="text-muted-foreground mb-6">
              Helping developers and businesses find the perfect hosting solution since 2024
            </p>
            <div className="flex justify-center gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">About</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
