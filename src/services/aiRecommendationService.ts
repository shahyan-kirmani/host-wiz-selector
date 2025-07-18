import { HostingRequirements } from "@/components/HostingForm";

export interface AIHostingProvider {
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
  aiRecommendationReason?: string;
}

interface AIRecommendationResponse {
  recommendations: AIHostingProvider[];
  reasoning: string;
}

// Available hosting providers database
const HOSTING_PROVIDERS = [
  {
    id: "vercel",
    name: "Vercel",
    logo: "🚀",
    basePrice: "Free - $20/month",
    rating: 4.8,
    baseDescription: "Perfect for modern web applications with excellent performance and developer experience.",
    basePros: ["Instant deployments", "Global CDN", "Automatic scaling", "Great for React/Next.js"],
    baseCons: ["Limited backend capabilities", "Can be expensive for high traffic"],
    baseBestFor: ["Frontend applications", "Static sites", "JAMstack", "Developer portfolios"],
    baseFeatures: ["SSL Certificate", "CDN", "Git Integration", "24/7 Monitoring"]
  },
  {
    id: "netlify",
    name: "Netlify",
    logo: "🌐",
    basePrice: "Free - $45/month",
    rating: 4.7,
    baseDescription: "Excellent for static sites and JAMstack applications with powerful build tools.",
    basePros: ["Easy deployment", "Form handling", "Split testing", "Great free tier"],
    baseCons: ["Limited for dynamic applications", "Build time limits"],
    baseBestFor: ["Static sites", "Blogs", "Portfolio sites", "Small business sites"],
    baseFeatures: ["SSL Certificate", "CDN", "Form Processing", "Analytics"]
  },
  {
    id: "digitalocean",
    name: "DigitalOcean",
    logo: "🐙",
    basePrice: "$5 - $100+/month",
    rating: 4.6,
    baseDescription: "Developer-friendly cloud platform with simple pricing and powerful features.",
    basePros: ["Predictable pricing", "Great documentation", "SSD storage", "Global data centers"],
    baseCons: ["Requires technical knowledge", "No managed hosting"],
    baseBestFor: ["Web applications", "APIs", "Databases", "Scalable projects"],
    baseFeatures: ["Database Support", "Load Balancers", "24/7 Monitoring", "Backups"]
  },
  {
    id: "bluehost",
    name: "Bluehost",
    logo: "🔵",
    basePrice: "$3 - $30/month",
    rating: 4.2,
    baseDescription: "Beginner-friendly hosting with WordPress optimization and 24/7 support.",
    basePros: ["WordPress optimized", "24/7 support", "Free domain", "Easy to use"],
    baseCons: ["Upselling", "Performance can vary", "Renewal prices higher"],
    baseBestFor: ["WordPress sites", "Small businesses", "Beginners", "Blogs"],
    baseFeatures: ["SSL Certificate", "Email Hosting", "One-click Installations", "Daily Backups"]
  },
  {
    id: "aws",
    name: "AWS (Amazon Web Services)",
    logo: "☁️",
    basePrice: "$5 - $500+/month",
    rating: 4.5,
    baseDescription: "Enterprise-grade cloud platform with unlimited scalability and comprehensive services.",
    basePros: ["Unlimited scalability", "Comprehensive services", "High reliability", "Global infrastructure"],
    baseCons: ["Complex pricing", "Steep learning curve", "Can be expensive"],
    baseBestFor: ["Enterprise applications", "High-traffic sites", "Complex architectures", "Global scale"],
    baseFeatures: ["Database Support", "CDN", "Auto-scaling", "Advanced Security"]
  },
  {
    id: "hostinger",
    name: "Hostinger",
    logo: "💜",
    basePrice: "$1 - $15/month",
    rating: 4.3,
    baseDescription: "Affordable hosting with good performance and user-friendly control panel.",
    basePros: ["Very affordable", "Good performance", "User-friendly", "Multiple data centers"],
    baseCons: ["Limited advanced features", "Support can be slow", "Renewal price increases"],
    baseBestFor: ["Budget-conscious users", "Small websites", "Personal projects", "Learning"],
    baseFeatures: ["SSL Certificate", "Email Hosting", "Website Builder", "Daily Backups"]
  }
];

export class AIRecommendationService {
  private apiKey: string;
  private provider: 'openai' | 'anthropic';

  constructor(apiKey: string, provider: 'openai' | 'anthropic' = 'openai') {
    this.apiKey = apiKey;
    this.provider = provider;
  }

  async getRecommendations(requirements: HostingRequirements): Promise<AIRecommendationResponse> {
    const prompt = this.createPrompt(requirements);
    
    try {
      let response: Response;
      
      if (this.provider === 'openai') {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4.1-2025-04-14',
            messages: [
              {
                role: 'system',
                content: 'You are a hosting expert that provides personalized hosting recommendations. Always respond with valid JSON only.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 2000,
          }),
        });
      } else {
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': this.apiKey,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2000,
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
          }),
        });
      }

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      let aiResponse: string;

      if (this.provider === 'openai') {
        aiResponse = data.choices[0].message.content;
      } else {
        aiResponse = data.content[0].text;
      }

      return this.parseAIResponse(aiResponse);
    } catch (error) {
      console.error('AI recommendation error:', error);
      throw new Error('Failed to get AI recommendations. Please check your API key and try again.');
    }
  }

  private createPrompt(requirements: HostingRequirements): string {
    return `
As a hosting expert, analyze these website requirements and provide personalized hosting recommendations:

**User Requirements:**
- Website Type: ${requirements.websiteType}
- Expected Traffic: ${requirements.expectedTraffic}
- Budget: ${requirements.budget}
- Technical Level: ${requirements.technicalLevel}
- Support Level: ${requirements.supportLevel}
- Special Features: ${requirements.features.join(', ') || 'None specified'}

**Available Hosting Providers:**
${HOSTING_PROVIDERS.map(p => `
${p.name} (${p.id}):
- Price: ${p.basePrice}
- Rating: ${p.rating}/5
- Description: ${p.baseDescription}
- Pros: ${p.basePros.join(', ')}
- Cons: ${p.baseCons.join(', ')}
- Best For: ${p.baseBestFor.join(', ')}
- Features: ${p.baseFeatures.join(', ')}
`).join('\n')}

**Instructions:**
1. Select the top 4 most suitable providers from the list above
2. Rank them by match score (0-100) based on the user's specific requirements
3. Assign tiers: "recommended" (best match), "good" (2nd-3rd), "alternative" (4th)
4. Customize descriptions, pros/cons to be specific to this user's needs
5. Provide a brief reasoning for your recommendations

**Response Format (JSON only):**
{
  "recommendations": [
    {
      "id": "provider_id",
      "name": "Provider Name",
      "logo": "emoji",
      "price": "price_range",
      "rating": 4.5,
      "description": "customized description for this user",
      "pros": ["customized pro 1", "pro 2"],
      "cons": ["customized con 1", "con 2"],
      "bestFor": ["use case 1", "use case 2"],
      "features": ["feature 1", "feature 2"],
      "matchScore": 95,
      "tier": "recommended",
      "aiRecommendationReason": "Brief reason why this is recommended for the user"
    }
  ],
  "reasoning": "Overall explanation of why these providers were chosen for this specific user"
}

Provide only the JSON response, no additional text.`;
  }

  private parseAIResponse(response: string): AIRecommendationResponse {
    try {
      // Clean the response to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate the response structure
      if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
        throw new Error('Invalid AI response structure');
      }

      return parsed;
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      // Fallback to basic algorithm if AI parsing fails
      return this.getFallbackRecommendations();
    }
  }

  private getFallbackRecommendations(): AIRecommendationResponse {
    // Simple fallback using first 4 providers
    const recommendations = HOSTING_PROVIDERS.slice(0, 4).map((provider, index) => ({
      id: provider.id,
      name: provider.name,
      logo: provider.logo,
      price: provider.basePrice,
      rating: provider.rating,
      description: provider.baseDescription,
      pros: provider.basePros,
      cons: provider.baseCons,
      bestFor: provider.baseBestFor,
      features: provider.baseFeatures,
      matchScore: 85 - (index * 10),
      tier: (index === 0 ? "recommended" : index < 3 ? "good" : "alternative") as "recommended" | "good" | "alternative",
      aiRecommendationReason: "Recommended based on general suitability"
    }));

    return {
      recommendations,
      reasoning: "These recommendations are based on general hosting suitability. For personalized AI recommendations, please provide a valid API key."
    };
  }
}