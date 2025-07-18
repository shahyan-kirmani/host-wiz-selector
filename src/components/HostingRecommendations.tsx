import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Check, ExternalLink, Award, Zap, Shield, DollarSign, Brain, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { HostingRequirements } from "./HostingForm";
import { AIRecommendationService, AIHostingProvider } from "@/services/aiRecommendationService";
import { AIApiKeyInput } from "./AIApiKeyInput";

type HostingProvider = AIHostingProvider;

interface HostingRecommendationsProps {
  requirements: HostingRequirements;
  onStartOver: () => void;
}

export function HostingRecommendations({ requirements, onStartOver }: HostingRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<HostingProvider[]>([]);
  const [aiReasoning, setAiReasoning] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const [usingAI, setUsingAI] = useState(false);
  const { toast } = useToast();

  // Check if we have stored API key
  useEffect(() => {
    const storedApiKey = localStorage.getItem('ai_api_key');
    const storedProvider = localStorage.getItem('ai_provider') as 'openai' | 'anthropic';
    
    if (storedApiKey) {
      handleGetAIRecommendations(storedApiKey, storedProvider || 'openai');
    }
  }, []);

  const handleGetAIRecommendations = async (apiKey: string, provider: 'openai' | 'anthropic') => {
    setLoading(true);
    setShowApiKeyInput(false);
    
    try {
      if (!apiKey) {
        // Use fallback algorithm
        const fallbackRecommendations = generateFallbackRecommendations(requirements);
        setRecommendations(fallbackRecommendations);
        setAiReasoning("These recommendations are based on our built-in algorithm. For personalized AI analysis, please provide an API key.");
        setUsingAI(false);
      } else {
        // Use AI service
        const aiService = new AIRecommendationService(apiKey, provider);
        const result = await aiService.getRecommendations(requirements);
        setRecommendations(result.recommendations);
        setAiReasoning(result.reasoning);
        setUsingAI(true);
        
        toast({
          title: "AI Recommendations Generated",
          description: "Your personalized hosting recommendations are ready!",
        });
      }
    } catch (error) {
      console.error('Recommendation error:', error);
      
      // Fallback to basic algorithm on error
      const fallbackRecommendations = generateFallbackRecommendations(requirements);
      setRecommendations(fallbackRecommendations);
      setAiReasoning("AI service unavailable. Using our built-in recommendation algorithm.");
      setUsingAI(false);
      
      toast({
        title: "AI Service Error",
        description: "Falling back to basic recommendations. Please check your API key.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fallback recommendation logic (simplified version of the original algorithm)
  const generateFallbackRecommendations = (req: HostingRequirements): HostingProvider[] => {
    const allProviders: Omit<HostingProvider, 'matchScore' | 'tier' | 'aiRecommendationReason'>[] = [
      {
        id: "vercel",
        name: "Vercel",
        logo: "🚀",
        price: "Free - $20/month",
        rating: 4.8,
        description: "Perfect for modern web applications with excellent performance and developer experience.",
        pros: ["Instant deployments", "Global CDN", "Automatic scaling", "Great for React/Next.js"],
        cons: ["Limited backend capabilities", "Can be expensive for high traffic"],
        bestFor: ["Frontend applications", "Static sites", "JAMstack", "Developer portfolios"],
        features: ["SSL Certificate", "CDN", "Git Integration", "24/7 Monitoring"]
      },
      {
        id: "netlify",
        name: "Netlify",
        logo: "🌐",
        price: "Free - $45/month",
        rating: 4.7,
        description: "Excellent for static sites and JAMstack applications with powerful build tools.",
        pros: ["Easy deployment", "Form handling", "Split testing", "Great free tier"],
        cons: ["Limited for dynamic applications", "Build time limits"],
        bestFor: ["Static sites", "Blogs", "Portfolio sites", "Small business sites"],
        features: ["SSL Certificate", "CDN", "Form Processing", "Analytics"]
      },
      {
        id: "digitalocean",
        name: "DigitalOcean",
        logo: "🐙",
        price: "$5 - $100+/month",
        rating: 4.6,
        description: "Developer-friendly cloud platform with simple pricing and powerful features.",
        pros: ["Predictable pricing", "Great documentation", "SSD storage", "Global data centers"],
        cons: ["Requires technical knowledge", "No managed hosting"],
        bestFor: ["Web applications", "APIs", "Databases", "Scalable projects"],
        features: ["Database Support", "Load Balancers", "24/7 Monitoring", "Backups"]
      },
      {
        id: "bluehost",
        name: "Bluehost",
        logo: "🔵",
        price: "$3 - $30/month",
        rating: 4.2,
        description: "Beginner-friendly hosting with WordPress optimization and 24/7 support.",
        pros: ["WordPress optimized", "24/7 support", "Free domain", "Easy to use"],
        cons: ["Upselling", "Performance can vary", "Renewal prices higher"],
        bestFor: ["WordPress sites", "Small businesses", "Beginners", "Blogs"],
        features: ["SSL Certificate", "Email Hosting", "One-click Installations", "Daily Backups"]
      }
    ];

    // Simple scoring
    const scoredProviders = allProviders.map((provider, index) => ({
      ...provider,
      matchScore: 85 - (index * 5),
      tier: (index === 0 ? "recommended" : index < 3 ? "good" : "alternative") as "recommended" | "good" | "alternative",
      aiRecommendationReason: "Recommended based on general suitability for your requirements"
    }));

    return scoredProviders;
  };

  if (showApiKeyInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 py-8 px-4">
        <AIApiKeyInput 
          onApiKeySubmit={handleGetAIRecommendations}
          loading={loading}
        />
      </div>
    );
  }

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case "recommended":
        return { icon: Award, color: "bg-gradient-to-r from-primary to-primary-glow", text: "Best Match" };
      case "good":
        return { icon: Zap, color: "bg-secondary", text: "Good Option" };
      default:
        return { icon: Shield, color: "bg-muted", text: "Alternative" };
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Brain className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            {usingAI ? 'AI-Powered' : 'Smart'} Hosting Recommendations
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {usingAI 
            ? `AI analysis of your ${requirements.websiteType} website requirements`
            : `Algorithm-based recommendations for your ${requirements.websiteType} website`
          }
        </p>
        {usingAI && (
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Brain className="w-3 h-3 mr-1" />
            Powered by AI
          </Badge>
        )}
      </div>

      {/* AI Reasoning */}
      {aiReasoning && (
        <Alert className="bg-primary/5 border-primary/20">
          <Brain className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>AI Analysis:</strong> {aiReasoning}
          </AlertDescription>
        </Alert>
      )}

      {/* Requirements Summary */}
      <Card className="bg-gradient-to-r from-accent/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Your Requirements Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">Type:</span>
              <p className="capitalize">{requirements.websiteType}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Traffic:</span>
              <p className="capitalize">{requirements.expectedTraffic}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Budget:</span>
              <p className="capitalize">{requirements.budget}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Level:</span>
              <p className="capitalize">{requirements.technicalLevel}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <div className="grid gap-6">
        {recommendations.slice(0, 4).map((provider, index) => {
          const tierInfo = getTierInfo(provider.tier);
          const TierIcon = tierInfo.icon;

          return (
            <Card 
              key={provider.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                provider.tier === "recommended" 
                  ? "ring-2 ring-primary/50 shadow-lg" 
                  : "hover:shadow-lg"
              }`}
            >
              {provider.tier === "recommended" && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-primary-glow text-primary-foreground px-4 py-1 text-sm font-medium">
                  Recommended
                </div>
              )}

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{provider.logo}</div>
                    <div>
                      <CardTitle className="text-2xl">{provider.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{provider.rating}</span>
                        </div>
                        <Badge variant="outline" className={tierInfo.color}>
                          <TierIcon className="w-3 h-3 mr-1" />
                          {tierInfo.text}
                        </Badge>
                        <Badge variant="secondary" className="ml-auto">
                          {provider.matchScore}% match
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{provider.price}</div>
                    <div className="text-sm text-muted-foreground">starting from</div>
                  </div>
                </div>
                <CardDescription className="text-base mt-3">
                  {provider.description}
                </CardDescription>
                {provider.aiRecommendationReason && usingAI && (
                  <div className="mt-2 p-3 bg-primary/5 rounded-lg border-l-4 border-primary">
                    <p className="text-sm text-muted-foreground">
                      <strong>Why this fits:</strong> {provider.aiRecommendationReason}
                    </p>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Pros
                    </h4>
                    <ul className="space-y-2">
                      {provider.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-amber-600 mb-3">Considerations</h4>
                    <ul className="space-y-2">
                      {provider.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <div className="w-3 h-3 bg-amber-200 rounded-full mt-0.5 flex-shrink-0" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Best for:</h4>
                  <div className="flex flex-wrap gap-2">
                    {provider.bestFor.map((use, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {use}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Key Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {provider.features.map((feature, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300">
                    Visit {provider.name}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Actions */}
      <div className="text-center pt-8 space-y-4">
        <div className="flex gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={onStartOver}
          >
            Different Requirements
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowApiKeyInput(true)}
          >
            Change AI Settings
          </Button>
        </div>
        
        {!usingAI && (
          <Alert className="max-w-md mx-auto bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Get more personalized recommendations with AI analysis!
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}