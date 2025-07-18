import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Check, ExternalLink, Award, Zap, Shield, DollarSign } from "lucide-react";
import { HostingRequirements } from "./HostingForm";

interface HostingProvider {
  id: string;
  name: string;
  logo: string;
  price: string;
  rating: number;
  description: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
  features: string[];
  matchScore: number;
  tier: "recommended" | "good" | "alternative";
}

interface HostingRecommendationsProps {
  requirements: HostingRequirements;
  onStartOver: () => void;
}

export function HostingRecommendations({ requirements, onStartOver }: HostingRecommendationsProps) {
  // Recommendation engine logic
  const generateRecommendations = (req: HostingRequirements): HostingProvider[] => {
    const allProviders: Omit<HostingProvider, 'matchScore' | 'tier'>[] = [
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
      },
      {
        id: "aws",
        name: "AWS (Amazon Web Services)",
        logo: "☁️",
        price: "$5 - $500+/month",
        rating: 4.5,
        description: "Enterprise-grade cloud platform with unlimited scalability and comprehensive services.",
        pros: ["Unlimited scalability", "Comprehensive services", "High reliability", "Global infrastructure"],
        cons: ["Complex pricing", "Steep learning curve", "Can be expensive"],
        bestFor: ["Enterprise applications", "High-traffic sites", "Complex architectures", "Global scale"],
        features: ["Database Support", "CDN", "Auto-scaling", "Advanced Security"]
      },
      {
        id: "hostinger",
        name: "Hostinger",
        logo: "💜",
        price: "$1 - $15/month",
        rating: 4.3,
        description: "Affordable hosting with good performance and user-friendly control panel.",
        pros: ["Very affordable", "Good performance", "User-friendly", "Multiple data centers"],
        cons: ["Limited advanced features", "Support can be slow", "Renewal price increases"],
        bestFor: ["Budget-conscious users", "Small websites", "Personal projects", "Learning"],
        features: ["SSL Certificate", "Email Hosting", "Website Builder", "Daily Backups"]
      }
    ];

    // Scoring algorithm
    const scoredProviders = allProviders.map(provider => {
      let score = 0;

      // Website type scoring
      if (req.websiteType === "blog" || req.websiteType === "business") {
        if (provider.id === "netlify" || provider.id === "vercel") score += 30;
        if (provider.id === "bluehost" || provider.id === "hostinger") score += 25;
      } else if (req.websiteType === "app") {
        if (provider.id === "vercel" || provider.id === "digitalocean") score += 30;
        if (provider.id === "aws") score += 25;
      } else if (req.websiteType === "ecommerce") {
        if (provider.id === "digitalocean" || provider.id === "aws") score += 30;
        if (provider.id === "bluehost") score += 20;
      } else if (req.websiteType === "enterprise") {
        if (provider.id === "aws") score += 35;
        if (provider.id === "digitalocean") score += 25;
      }

      // Traffic scoring
      if (req.expectedTraffic === "low") {
        if (provider.id === "netlify" || provider.id === "hostinger") score += 25;
      } else if (req.expectedTraffic === "medium") {
        if (provider.id === "vercel" || provider.id === "digitalocean") score += 25;
      } else if (req.expectedTraffic === "high" || req.expectedTraffic === "very-high") {
        if (provider.id === "aws" || provider.id === "digitalocean") score += 25;
      }

      // Budget scoring
      if (req.budget === "budget") {
        if (provider.id === "netlify" || provider.id === "hostinger") score += 30;
        if (provider.id === "vercel") score += 20; // Free tier
      } else if (req.budget === "standard") {
        if (provider.id === "vercel" || provider.id === "digitalocean" || provider.id === "bluehost") score += 25;
      } else if (req.budget === "premium" || req.budget === "enterprise") {
        if (provider.id === "aws" || provider.id === "digitalocean") score += 25;
      }

      // Technical level scoring
      if (req.technicalLevel === "beginner") {
        if (provider.id === "bluehost" || provider.id === "hostinger") score += 20;
        if (provider.id === "netlify" || provider.id === "vercel") score += 15;
      } else if (req.technicalLevel === "advanced") {
        if (provider.id === "aws" || provider.id === "digitalocean") score += 20;
      }

      // Support level scoring
      if (req.supportLevel === "priority") {
        if (provider.id === "aws" || provider.id === "bluehost") score += 15;
      }

      return { ...provider, matchScore: Math.min(100, score) };
    });

    // Sort by score and assign tiers
    const sorted = scoredProviders.sort((a, b) => b.matchScore - a.matchScore);
    return sorted.map((provider, index) => ({
      ...provider,
      tier: index === 0 ? "recommended" : index < 3 ? "good" : "alternative"
    })) as HostingProvider[];
  };

  const recommendations = generateRecommendations(requirements);

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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Your Hosting Recommendations
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Based on your requirements, here are the best hosting providers for your {requirements.websiteType} website
        </p>
      </div>

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
      <div className="text-center pt-8">
        <Button 
          variant="outline" 
          onClick={onStartOver}
          className="min-w-48"
        >
          Start Over with Different Requirements
        </Button>
      </div>
    </div>
  );
}