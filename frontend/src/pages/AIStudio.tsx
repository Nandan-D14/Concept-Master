import React, { useState } from 'react';
import { Button } from '../components/ui/button'; // Corrected import
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'; // Corrected import
import { Textarea } from '../components/ui/textarea'; // Corrected import
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const mockSimplifiedText = {
  simplified: "Your simplified text will appear here. It will be much easier to understand.",
  keyPoints: [
    "This is the first key point.",
    "This is the second key point.",
    "This is the third key point.",
  ],
  definitions: {
    "Complex Term": "A simple definition of the complex term.",
    "Another Term": "A simple definition of another complex term.",
  },
};

const TextSimplifier: React.FC = () => {
    const [text, setText] = useState('');
    const [simplifiedText, setSimplifiedText] = useState<typeof mockSimplifiedText | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSimplify = () => {
        setIsLoading(true);
        setTimeout(() => {
            setSimplifiedText(mockSimplifiedText);
            setIsLoading(false);
        }, 1000);
    };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Text Simplifier</h2>
        <p className="text-muted-foreground">Paste in a complex text and get a simplified version.</p>
        <div className="mt-4">
          <Textarea
            placeholder="Paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
          />
          <Button onClick={handleSimplify} disabled={isLoading} className="mt-4">
            {isLoading ? 'Simplifying...' : 'Simplify Text'}
          </Button>
        </div>
      </div>
      <div>
        {simplifiedText && (
          <Card>
            <CardHeader>
              <CardTitle>Simplified Text</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Simplified Version</h3>
                <p className="text-muted-foreground">{simplifiedText.simplified}</p>
              </div>
              <div>
                <h3 className="font-semibold">Key Points</h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  {simplifiedText.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Definitions</h3>
                <div className="space-y-2 text-muted-foreground">
                  {Object.entries(simplifiedText.definitions).map(([term, definition]) => (
                    <div key={term}>
                      <strong>{term}:</strong> {definition}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const AIStudio: React.FC = () => {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Studio</h1>
            <p className="text-muted-foreground">Your personal AI-powered learning assistant.</p>
        </div>
      <Tabs defaultValue="text-simplifier">
        <TabsList>
          <TabsTrigger value="text-simplifier">Text Simplifier</TabsTrigger>
          <TabsTrigger value="concept-explainer">Concept Explainer</TabsTrigger>
          <TabsTrigger value="question-generator">Question Generator</TabsTrigger>
          <TabsTrigger value="study-planner">Study Planner</TabsTrigger>
        </TabsList>
        <TabsContent value="text-simplifier">
          <TextSimplifier />
        </TabsContent>
        <TabsContent value="concept-explainer">
          <p className="text-muted-foreground">Concept Explainer coming soon!</p>
        </TabsContent>
        <TabsContent value="question-generator">
          <p className="text-muted-foreground">Question Generator coming soon!</p>
        </TabsContent>
        <TabsContent value="study-planner">
          <p className="text-muted-foreground">Study Planner coming soon!</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIStudio;
