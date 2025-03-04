import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Heart, Leaf } from 'lucide-react';

const WhySaveSection: React.FC = () => {
  const reasons = [
    {
      icon: <Globe className="h-12 w-12 text-blue-500" />,
      title: "Environmental Impact",
      description: "Reducing food waste helps decrease greenhouse gas emissions and conserves resources."
    },
    {
      icon: <Heart className="h-12 w-12 text-red-500" />,
      title: "Social Responsibility",
      description: "Help feed those in need and support local communities facing food insecurity."
    },
    {
      icon: <Leaf className="h-12 w-12 text-green-500" />,
      title: "Sustainable Living",
      description: "Contribute to a more sustainable food system and reduce unnecessary waste."
    }
  ];

  return (
    <section className="py-16 bg-gray-50 flex justify-center items-center">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Save Food?</h2>
        <div className="grid md:grid-cols-3 gap-8 justify-center">
          {reasons.map((reason, index) => (
            <Card key={index} className="hover:shadow-lg transition-all">
              <CardHeader className="flex items-center justify-center">
                {reason.icon}
                <CardTitle className="ml-4 text-center">{reason.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">{reason.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySaveSection;
