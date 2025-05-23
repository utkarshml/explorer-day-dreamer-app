
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin, Users, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Index = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [travelStyle, setTravelStyle] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [interests, setInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const interestOptions = [
    { id: "food", label: "Food & Dining", icon: "🍽️" },
    { id: "hiking", label: "Hiking", icon: "🥾" },
    { id: "history", label: "History", icon: "🏛️" },
    { id: "beaches", label: "Beaches", icon: "🏖️" },
    { id: "nightlife", label: "Nightlife", icon: "🌃" },
    { id: "shopping", label: "Shopping", icon: "🛍️" },
    { id: "art", label: "Art", icon: "🎨" },
    { id: "photography", label: "Photography", icon: "📸" }
  ];

  const travelStyles = [
    { id: "luxury", label: "Luxury" },
    { id: "adventure", label: "Adventure" },
    { id: "budget", label: "Budget" },
    { id: "cultural", label: "Cultural" },
    { id: "romantic", label: "Romantic" }
  ];

  const handleInterestChange = (interestId: string, checked: boolean) => {
    if (checked) {
      setInterests([...interests, interestId]);
    } else {
      setInterests(interests.filter(id => id !== interestId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Store form data for the itinerary page
    const tripData = {
      destination,
      startDate,
      endDate,
      travelers,
      travelStyle,
      interests
    };
    localStorage.setItem('tripData', JSON.stringify(tripData));
    
    setIsLoading(false);
    navigate('/itinerary');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-travel-sky to-travel-ocean">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto animate-globe-spin">
              <div className="w-full h-full rounded-full travel-gradient shadow-2xl flex items-center justify-center">
                <span className="text-4xl text-white">🌍</span>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 animate-bounce-plane">
              <span className="text-2xl">✈️</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Planning Your Perfect Trip</h2>
          <p className="text-white/80 text-lg animate-pulse-slow">Creating your personalized itinerary...</p>
          <div className="mt-8 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-travel-sand via-white to-travel-sky/20">
      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 119, 190, 0.7), rgba(255, 107, 53, 0.7)), url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
        }}
      >
        <div className="text-center text-white animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Dream. Plan. Explore.</h1>
          <p className="text-xl md:text-2xl font-light">Create your perfect travel itinerary in minutes</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto shadow-2xl border-0 animate-slide-in-right">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-travel-ocean mb-2">Plan Your Adventure</CardTitle>
            <p className="text-muted-foreground text-lg">Tell us about your dream trip and we'll create the perfect itinerary</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Destination */}
              <div className="space-y-2">
                <Label htmlFor="destination" className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-travel-ocean" />
                  Destination
                </Label>
                <Input
                  id="destination"
                  placeholder="Where would you like to go? (e.g., Paris, Tokyo, Bali)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="h-12 text-lg"
                  required
                />
              </div>

              {/* Travel Dates */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-travel-ocean" />
                    Start Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Select start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        className="pointer-events-auto"
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-lg font-semibold">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Select end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        className="pointer-events-auto"
                        disabled={(date) => date < (startDate || new Date())}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Number of Travelers */}
              <div className="space-y-2">
                <Label htmlFor="travelers" className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-travel-ocean" />
                  Number of Travelers
                </Label>
                <Input
                  id="travelers"
                  type="number"
                  min="1"
                  max="20"
                  value={travelers}
                  onChange={(e) => setTravelers(parseInt(e.target.value))}
                  className="h-12 text-lg"
                  required
                />
              </div>

              {/* Travel Style */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-travel-ocean" />
                  Travel Style
                </Label>
                <RadioGroup value={travelStyle} onValueChange={setTravelStyle} className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {travelStyles.map((style) => (
                    <div key={style.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={style.id} id={style.id} />
                      <Label 
                        htmlFor={style.id} 
                        className="cursor-pointer px-4 py-2 rounded-lg border hover:bg-travel-ocean/10 transition-colors"
                      >
                        {style.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Special Interests */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Special Interests</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {interestOptions.map((interest) => (
                    <div key={interest.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest.id}
                        checked={interests.includes(interest.id)}
                        onCheckedChange={(checked) => handleInterestChange(interest.id, checked as boolean)}
                        className="interest-checkbox"
                      />
                      <Label 
                        htmlFor={interest.id} 
                        className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-travel-ocean/10 transition-colors text-sm"
                      >
                        <span>{interest.icon}</span>
                        {interest.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-semibold travel-gradient hover:shadow-lg transition-all duration-300 hover:scale-105"
                disabled={!destination || !startDate || !endDate || !travelStyle}
              >
                Generate My Perfect Itinerary ✨
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
