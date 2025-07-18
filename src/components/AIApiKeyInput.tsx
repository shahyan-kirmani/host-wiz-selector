import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Key, Shield, Info } from "lucide-react";

interface AIApiKeyInputProps {
  onApiKeySubmit: (apiKey: string, provider: 'openai' | 'anthropic') => void;
  loading?: boolean;
}

export function AIApiKeyInput({ onApiKeySubmit, loading }: AIApiKeyInputProps) {
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('ai_api_key') || '';
  });
  const [provider, setProvider] = useState<'openai' | 'anthropic'>(() => {
    return (localStorage.getItem('ai_provider') as 'openai' | 'anthropic') || 'openai';
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    
    // Save to localStorage for convenience
    localStorage.setItem('ai_api_key', apiKey);
    localStorage.setItem('ai_provider', provider);
    
    onApiKeySubmit(apiKey, provider);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full mb-4">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          AI-Powered Recommendations
        </h2>
        <p className="text-lg text-muted-foreground">
          Get personalized hosting recommendations powered by advanced AI analysis
        </p>
      </div>

      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4" />
        <AlertDescription>
          To get AI-powered recommendations, you need to provide an API key from OpenAI or Anthropic. 
          Your key is stored locally in your browser and never sent to our servers.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            AI Configuration
          </CardTitle>
          <CardDescription>
            Choose your AI provider and enter your API key to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="provider">AI Provider</Label>
              <Select value={provider} onValueChange={(value: 'openai' | 'anthropic') => setProvider(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select AI provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI (GPT-4)</SelectItem>
                  <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {provider === 'openai' 
                  ? 'Get your API key from OpenAI Platform (platform.openai.com)'
                  : 'Get your API key from Anthropic Console (console.anthropic.com)'
                }
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder={provider === 'openai' ? 'sk-...' : 'sk-ant-...'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono"
              />
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Your API key is stored locally and never shared
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={!apiKey.trim() || loading}
              className="w-full bg-gradient-to-r from-primary to-primary-glow"
            >
              {loading ? 'Getting AI Recommendations...' : 'Get AI Recommendations'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>Don't have an API key? You can still use our basic recommendation algorithm</p>
        <Button 
          variant="link" 
          onClick={() => onApiKeySubmit('', 'openai')}
          disabled={loading}
          className="text-sm"
        >
          Use Basic Recommendations Instead
        </Button>
      </div>
    </div>
  );
}