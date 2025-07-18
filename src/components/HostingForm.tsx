import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight, Server, Users, DollarSign, Settings } from "lucide-react";

export interface HostingRequirements {
  websiteType: string;
  expectedTraffic: string;
  budget: string;
  technicalLevel: string;
  features: string[];
  supportLevel: string;
}

interface HostingFormProps {
  onSubmit: (requirements: HostingRequirements) => void;
}

export function HostingForm({ onSubmit }: HostingFormProps) {
  const [step, setStep] = useState(1);
  const [requirements, setRequirements] = useState<HostingRequirements>({
    websiteType: "",
    expectedTraffic: "",
    budget: "",
    technicalLevel: "",
    features: [],
    supportLevel: "",
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onSubmit(requirements);
    }
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setRequirements(prev => ({
      ...prev,
      features: checked 
        ? [...prev.features, feature]
        : prev.features.filter(f => f !== feature)
    }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return requirements.websiteType !== "";
      case 2: return requirements.expectedTraffic !== "";
      case 3: return requirements.budget !== "";
      case 4: return requirements.technicalLevel !== "" && requirements.supportLevel !== "";
      default: return false;
    }
  };

  const stepIcons = [Server, Users, DollarSign, Settings];
  const StepIcon = stepIcons[step - 1];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                i + 1 <= step 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div className={`w-full h-1 mx-4 rounded transition-all duration-300 ${
                  i + 1 < step ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Step {step} of {totalSteps}
        </p>
      </div>

      <Card className="shadow-xl border-0 bg-gradient-to-br from-card via-card to-accent/5">
        <CardHeader className="text-center pb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <StepIcon className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {step === 1 && "What type of website do you need hosting for?"}
            {step === 2 && "How much traffic do you expect?"}
            {step === 3 && "What's your hosting budget?"}
            {step === 4 && "Technical preferences & support"}
          </CardTitle>
          <CardDescription className="text-base">
            {step === 1 && "This helps us understand your hosting requirements"}
            {step === 2 && "Traffic volume affects hosting resource needs"}
            {step === 3 && "Let's find options within your price range"}
            {step === 4 && "Final details to personalize your recommendations"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <RadioGroup
              value={requirements.websiteType}
              onValueChange={(value) => setRequirements(prev => ({ ...prev, websiteType: value }))}
              className="space-y-4"
            >
              {[
                { value: "blog", label: "Personal Blog/Portfolio", desc: "Simple website with static content" },
                { value: "business", label: "Business Website", desc: "Company site with moderate traffic" },
                { value: "ecommerce", label: "E-commerce Store", desc: "Online store with payment processing" },
                { value: "app", label: "Web Application", desc: "Dynamic app with databases and APIs" },
                { value: "enterprise", label: "Enterprise Solution", desc: "High-traffic, mission-critical application" }
              ].map((option) => (
                <Label
                  key={option.value}
                  htmlFor={option.value}
                  className="flex items-start space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors"
                >
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.desc}</div>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          )}

          {step === 2 && (
            <RadioGroup
              value={requirements.expectedTraffic}
              onValueChange={(value) => setRequirements(prev => ({ ...prev, expectedTraffic: value }))}
              className="space-y-4"
            >
              {[
                { value: "low", label: "Low (< 1K visitors/month)", desc: "Just starting out or personal use" },
                { value: "medium", label: "Medium (1K - 10K visitors/month)", desc: "Growing website or small business" },
                { value: "high", label: "High (10K - 100K visitors/month)", desc: "Established business or popular content" },
                { value: "very-high", label: "Very High (100K+ visitors/month)", desc: "Large scale website or application" }
              ].map((option) => (
                <Label
                  key={option.value}
                  htmlFor={option.value}
                  className="flex items-start space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors"
                >
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.desc}</div>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Label htmlFor="budget">Monthly hosting budget (USD)</Label>
              <Select onValueChange={(value) => setRequirements(prev => ({ ...prev, budget: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">$0 - $10/month (Budget-friendly)</SelectItem>
                  <SelectItem value="standard">$10 - $50/month (Standard)</SelectItem>
                  <SelectItem value="premium">$50 - $200/month (Premium)</SelectItem>
                  <SelectItem value="enterprise">$200+/month (Enterprise)</SelectItem>
                </SelectContent>
              </Select>

              <div className="mt-6">
                <Label className="text-base font-medium mb-4 block">Additional features you need:</Label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    "SSL Certificate",
                    "Daily Backups",
                    "CDN (Content Delivery Network)",
                    "Email Hosting",
                    "Database Support",
                    "One-click Installations",
                    "24/7 Monitoring"
                  ].map((feature) => (
                    <Label
                      key={feature}
                      htmlFor={feature}
                      className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox
                        id={feature}
                        checked={requirements.features.includes(feature)}
                        onCheckedChange={(checked) => handleFeatureChange(feature, checked as boolean)}
                      />
                      <span className="text-sm">{feature}</span>
                    </Label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-4 block">Technical experience level:</Label>
                <RadioGroup
                  value={requirements.technicalLevel}
                  onValueChange={(value) => setRequirements(prev => ({ ...prev, technicalLevel: value }))}
                  className="space-y-3"
                >
                  {[
                    { value: "beginner", label: "Beginner", desc: "I prefer managed solutions with user-friendly interfaces" },
                    { value: "intermediate", label: "Intermediate", desc: "I can handle basic server configuration" },
                    { value: "advanced", label: "Advanced", desc: "I'm comfortable with command line and server management" }
                  ].map((option) => (
                    <Label
                      key={option.value}
                      htmlFor={option.value}
                      className="flex items-start space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                      <div>
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.desc}</div>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="support">Customer support importance:</Label>
                <Select onValueChange={(value) => setRequirements(prev => ({ ...prev, supportLevel: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="How important is customer support?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (Community forums, documentation)</SelectItem>
                    <SelectItem value="standard">Standard (Email support during business hours)</SelectItem>
                    <SelectItem value="priority">Priority (24/7 support with quick response times)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="min-w-24"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="min-w-24 bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300"
            >
              {step === totalSteps ? "Get Recommendations" : "Next"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}