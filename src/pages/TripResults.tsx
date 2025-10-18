import {useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  StarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingCard } from "@/components/LoadingCard";

interface Activity {
  title: string;
  type: string;
  time: string;
  location: string;
  description: string;
}

interface ItineraryDay {
  day: number;
  date: string;
  weekday: string;
  activities: Activity[];
}

export interface TripResponse {
    title: string;
    travelers: number;
    destination_city : string
    start_date: string;
    end_date: string;
    duration_days: number;
    style: string;
    interests: string[];
}

const colors = [
  "#932F67",
  "#D92C54",
  "#0D5EA6",
  "#8ABB6C",
  "#9b59b6",
];

export default function TripResults() {
  const navigate = useNavigate();
  const [tripData, setTripData] = useState<TripResponse | null>(null);
  const [itineraryDay, setItineraryDay] = useState<ItineraryDay[]>([]);
  const [cardText, setCardText] = useState("");
  const [loadingCard, setLoadingCard] = useState(true);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const location = useLocation();
  const ws = useRef<WebSocket | null>(null);
  const formData = location.state?.formData;
  
  useEffect(() => {
    if (!formData) {
      navigate('/');
    }
  }, [formData, navigate]);

  useEffect(() => {
    if (!formData) return;
  
    ws.current = new WebSocket('ws://localhost:8000/ws/stream');

    ws.current.onopen = () => {
      console.log('Connected to WebSocket');
      setLoadingCard(true);
      setConnected(true);
      setLoading(true);
      setItineraryDay([]);
      
      // Send form data
      ws.current!.send(JSON.stringify(formData));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.state === "START") {
        setLoading(false);
        setTripData(data.content);
        setCardText(data.text || "");
      }

      if (data.state === "PLAN") {
        setCardText(data.text || "");
      }

      if (data.state === "TOOLS") {
        setCardText(data.text || "");
      }

      if (data.state === "OBSERVE") {
        setCardText(data.text || "");
      }
      if (data.state === "RESPONSE") {
        const day = data.content;
        // Properly append new day to existing itinerary
        setItineraryDay((prevDays) => [...prevDays, day]);
        setCardText(data.content.text || "");
      }
      if (data.state === "END") {
        setLoadingCard(false);
        console.log(loadingCard);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setLoading(false);
    };

    ws.current.onclose = () => {
      console.log('Disconnected');
      setConnected(false);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [formData]);
 


  const handleDownloadPDF = () =>{
    window.print();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forest-light to-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto border-4 border-forest-secondary border-t-transparent rounded-full animate-spin"></div>
            <h3 className="text-xl font-semibold text-forest-primary">Crafting Your Perfect Journey</h3>
            <p className="text-forest-primary/70">Our AI is creating a personalized itinerary just for you. Please wait for couple of minuts...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-light to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="border-forest-secondary text-forest-secondary hover:bg-forest-light"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            <span className="hidden lg:inline">Back to Planning</span>
          </Button>
        </div>
        <h1 className="text-3xl my-6 font-bold text-forest-primary">Your Journey Awaits</h1>

        {/* Trip Overview */}
        {tripData && (
          <Card className="mb-8 shadow-forest">
            <CardHeader className="bg-gradient-forest text-pretty rounded-t-lg">
              <CardTitle className="text-2xl flex items-center gap-2">
                <StarIcon className="h-6 w-6" />
                {tripData.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-6">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 text-forest-secondary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Destinations</p>
                    <p className="font-semibold text-forest-primary">{tripData.destination_city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-forest-secondary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold text-forest-primary">{tripData.duration_days} days</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <UsersIcon className="h-5 w-5 text-forest-secondary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Travelers</p>
                    <p className="font-semibold text-forest-primary">{tripData.travelers}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Style</p>
                  <Badge className="bg-pink-secondary text-white capitalize hover:bg-pink-secondary">
                    {tripData.style}
                  </Badge>
                </div>
              </div>

              {tripData.interests.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {tripData.interests.map((interest, index) => (
                        <Badge key={index} variant="outline" className="border-pink-secondary text-pink-secondary hover:bg-pink-secondary hover:text-white transition-colors">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-forest-primary">Detailed Itinerary</h2>
          {itineraryDay.length > 0 && itineraryDay.map((itinerary, index) => (
            <Card key={`${itinerary.day}-${index}`} className="shadow-card">
              <CardHeader className="bg-forest-light">
                <CardTitle className="flex items-center justify-between text-forest-primary">
                  <span>Day {itinerary.day} - {itinerary.weekday}</span>
                  <span className="text-sm font-normal text-forest-primary/70">{itinerary.date}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {itinerary.activities.map((activity, activityIndex) => (
                    <div style={{borderColor : `${colors[index%colors.length]}`}} key={activityIndex} className={`border-l-4 pl-6 relative `}>
                      <div style={{background : `${colors[index%colors.length]}`}} className={cn(
                        "absolute -left-[9.5px] top-2 w-4 h-4 rounded-full  border border-forest"
                  )}></div>
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <h4 className="font-semibold text-lg text-forest-primary">{activity.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge style={{ borderColor: `${colors[index%colors.length]}`, color: `${colors[index%colors.length]}`, backgroundColor: `${colors[index%colors.length]}20` }} variant="secondary">
                              {activity.type}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <ClockIcon className="h-4 w-4" />
                            {activity.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="h-4 w-4" />
                            {activity.location}
                          </div>
                        </div>

                        <p className="text-forest-primary/80 leading-relaxed">{activity.description}</p>
                      </div>

                      {activityIndex < itinerary.activities.length - 1 && (
                        <div className="mt-4 pt-4 border-b border-pink-secondary/20"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            ))
          }
        </div>

        {/* Detailed Itinerary */}
        {loadingCard == true ?  (
          <div className="mt-12">
            <LoadingCard text={cardText} />
          </div>
        ) :
        (
          <div/>
        )
      }

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12 justify-center">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="border-forest-secondary text-forest-secondary hover:bg-forest-light"
          >
            Plan Another Trip
          </Button>
          <Button
            onClick={handleDownloadPDF}
            className="bg-gradient-to-r from-pink-secondary to-forest-secondary hover:shadow-lg hover:shadow-pink-secondary/25 transition-all duration-300 text-white"
          >
            Trip PDF
          </Button>
        </div>
      </div>
    </div>
  );
}