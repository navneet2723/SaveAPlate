import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const DonationForm: React.FC = () => {
  const [location, setLocation] = useState<string>('');
  const [areas, setAreas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [geminiResponse, setGeminiResponse] = useState<string | null>(null);

  const [images, setImages] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://127.0.0.1:8000/api/areas');
        setAreas(response.data.areas);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching areas:', error);
        setIsLoading(false);
      }
    };

    fetchAreas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const predictionResponse = await axios.post('http://127.0.0.1:8000/predict', {
        area: location,
      });
      const predictedPoints = predictionResponse.data.predicted_points;
      setPrediction(predictedPoints);

      const predictionMessage = getPredictionMessage(predictedPoints);
      const geminiPrompt = `Imagine SAP Coins are a real currency, with ${predictionMessage.sapCoins} coins equivalent to real-world value. What specific items can I realistically purchase for daily use within this budget? List only the item names, separated by commas.`;

      const geminiResponse = await axios.post('http://127.0.0.1:8002/api/v1/chat', {
        prompt: geminiPrompt,
      });

      const items = geminiResponse.data.history.find(
        (entry: any) => entry.role === 'model'
      )?.parts[0].text;

      setGeminiResponse(items || 'No recommendations available.');
    } catch (error) {
      console.error('Error during submission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPredictionMessage = (prediction: number) => {
    switch (prediction) {
      case 1:
        return { message: 'Low Poverty Density Region', sapCoins: 100 };
      case 2:
        return { message: 'Moderate Poverty Density Region', sapCoins: 50 };
      case 3:
        return { message: 'High Poverty Density Region', sapCoins: 20 };
      default:
        return { message: 'Unknown region', sapCoins: 0 };
    }
  };

  const fetchImage = async (item: string) => {
    try {
      const response = await axios.get(`https://picsum.photos/200?random=${encodeURIComponent(item)}`);
      return response.config.url; 
    } catch (error) {
      console.error('Error fetching image:', error);
      return 'https://via.placeholder.com/150?text=Item'; 
    }
  };

  useEffect(() => {
    if (!geminiResponse) return;

    const items = geminiResponse.split(',').map((item) => item.trim());

    const fetchImagesForItems = async () => {
      const imagePromises = items.map(async (item) => {
        const image = await fetchImage(item);
        return { [item]: image };
      });

      const imageResults = await Promise.all(imagePromises);
      setImages(Object.assign({}, ...imageResults)); 
    };

    fetchImagesForItems();
  }, [geminiResponse]);

  const renderGeminiItems = () => {
    if (!geminiResponse) return null;

    const items = geminiResponse.split(',').map((item) => item.trim());

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <img
              src={images[item] || 'https://via.placeholder.com/150?text=Item'} 
              alt={item}
              className="w-full h-32 object-cover"
            />
            <div className="p-4 text-center">
              <p className="text-gray-800 font-medium text-lg">{item}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Donate Food
        </h2>
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-6">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Location
            </label>
            <Select
              onValueChange={(value) => setLocation(value)}
              value={location}
            >
              <SelectTrigger className="w-full border-gray-300 focus:ring focus:ring-blue-500">
                <SelectValue placeholder="Choose a location" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                align="center"
                side="bottom"
                className="z-10 bg-white border rounded-md shadow-lg"
              >
                <div className="max-h-60 overflow-y-auto">
                  {isLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading areas...
                    </SelectItem>
                  ) : (
                    areas.map((area) => (
                      <SelectItem
                        key={area}
                        value={area}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        {area}
                      </SelectItem>
                    ))
                  )}
                </div>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            disabled={!location}
            onClick={handleSubmit}
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </div>

        {prediction !== null && (
          <div className="mt-8 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg text-gray-700">
              {getPredictionMessage(prediction).message}
            </p>
            <p className="text-2xl font-bold text-green-500 mt-2">
              {getPredictionMessage(prediction).sapCoins} SAP Coins Earned!
            </p>
          </div>
        )}

        {geminiResponse && (
          <div className="mt-8 max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Recommended Items You Can Buy
            </h3>
            {renderGeminiItems()}
          </div>
        )}
      </div>
    </section>
  );
};

export default DonationForm;
