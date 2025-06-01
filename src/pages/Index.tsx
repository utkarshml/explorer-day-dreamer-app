
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
import { randomUUID } from "crypto";


// Activity inside each day
interface Activity {
  title: string;
  type: string;
  time: string;
  location: string;
  description: string;
}

// Each day's itinerary
interface DayItinerary {
  day: number;
  date: string; // format: YYYY-MM-DD
  weekday: string;
  activities: Activity[];
}

// Main trip structure
interface Trip {
  title: string;
  location: string;
  start_date: string; // format: YYYY-MM-DD
  end_date: string;   // format: YYYY-MM-DD
  duration_days: number;
  style: string;
  interests: string[];
}

// Complete data structure
export interface TripData {
  trip: Trip;
  itinerary: DayItinerary[];
}

const Index = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [travelStyle, setTravelStyle] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [interests, setInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponse] = useState<TripData | null>(null);

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
    try{
      setIsLoading(true);
    
   
      const response = await fetch("https://travilling-server.vercel.app/ask" , {
        method : "POST" ,
        headers: {
          "Content-Type": "application/json"
        },
        body : JSON.stringify(
          {
            "destination": destination,
            "startDate": startDate ? format(startDate, "yyyy-MM-dd") : "",
            "endDate": endDate ? format(endDate, "yyyy-MM-dd") : "",
            "travelers": travelers,
            "travel_style": travelStyle,
            "special_interests": interests
          }
          
        )
      })
      console.log(response)
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      setResponse(data.response);
      console.log("Response Data:", data.response);
      localStorage.setItem("trip", JSON.stringify(data.response));
      setIsLoading(false);
      navigate('/itinerary');

    }catch(e){
      console.error("Error in form submission:", e);
      setIsLoading(false);
      alert("An error occurred while generating your itinerary. Please try again.");
    }
   
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto animate-pulse rounded-full border-4 border-primary">
              <div className="w-full h-full rounded-full flex items-center justify-center">
                <span className="text-3xl">✈️</span>
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Planning Your Trip</h2>
          <p className="text-muted-foreground text-lg animate-pulse-slow">Creating your personalized itinerary...</p>
          <div className="mt-8 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-80 bg-cover bg-center flex items-center justify-center bg-muted"
      >
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Travel Planner</h1>
          <p className="text-lg md:text-xl text-muted-foreground">Create your perfect travel itinerary in minutes</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto shadow-md animate-fade-in">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold mb-2">Plan Your Trip</CardTitle>
            <p className="text-muted-foreground">Tell us about your dream trip and we'll create the perfect itinerary</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Destination */}
              <div className="space-y-2">
                <Label htmlFor="destination" className="text-lg font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Destination
                </Label>
                <Input
                  id="destination"
                  placeholder="Where would you like to go? (e.g., Paris, Tokyo, Bali)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="h-12"
                  required
                />
              </div>

              {/* Travel Dates */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-lg font-medium flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
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
                  <Label className="text-lg font-medium">End Date</Label>
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
                <Label htmlFor="travelers" className="text-lg font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Number of Travelers
                </Label>
                <Input
                  id="travelers"
                  type="number"
                  min="1"
                  max="20"
                  value={travelers}
                  onChange={(e) => setTravelers(parseInt(e.target.value))}
                  className="h-12"
                  required
                />
              </div>

              {/* Travel Style */}
              <div className="space-y-4">
                <Label className="text-lg font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Travel Style
                </Label>
                <RadioGroup value={travelStyle} onValueChange={setTravelStyle} className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {travelStyles.map((style) => (
                    <div key={style.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={style.id} id={style.id} />
                      <Label 
                        htmlFor={style.id} 
                        className="cursor-pointer"
                      >
                        {style.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Special Interests */}
              <div className="space-y-4">
                <Label className="text-lg font-medium">Special Interests</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {interestOptions.map((interest) => (
                    <div key={interest.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest.id}
                        checked={interests.includes(interest.id)}
                        onCheckedChange={(checked) => handleInterestChange(interest.id, checked as boolean)}
                      />
                      <Label 
                        htmlFor={interest.id} 
                        className="cursor-pointer"
                      >
                        {interest.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-semibold"
                disabled={!destination || !startDate || !endDate || !travelStyle}
              >
                Generate My Itinerary
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
