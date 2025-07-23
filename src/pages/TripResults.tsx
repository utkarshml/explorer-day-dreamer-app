import {useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
interface Itinerary {
  duration : number
  journey: Journey
  itinerary : ItineraryDay[]
}
interface Journey {
  startPoint: string;
  destination: string;
}

export interface TripResponse {
  trip: {
    title: string;
    travelers: number;
    start_date: string;
    end_date: string;
    duration_days: number;
    style: string;
    interests: string[];
  };
  Itineraries: Itinerary[];
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

  useEffect(() => {
    const data = localStorage.getItem("trip");
    if (data) {
      setTripData(JSON.parse(data));
    }
  }, [])
 


  if (!tripData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forest-light to-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h3 className="text-xl font-semibold text-destructive mb-4">Something went wrong</h3>
          <Button onClick={() => navigate("/")} variant="outline">
            Back to Planning
          </Button>
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
            Back to Planning
          </Button>
          <h1 className="text-3xl font-bold text-forest-primary">Your Journey Awaits</h1>
        </div>

        {/* Trip Overview */}
        <Card className="mb-8 shadow-forest">
          <CardHeader className="bg-gradient-forest text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-2">
              <StarIcon className="h-6 w-6" />
              {tripData.trip.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-forest-secondary" />
                <div>
                  <p className="text-sm text-muted-foreground">Destinations</p>
                  <p className="font-semibold text-forest-primary">{[...new Set(tripData.Itineraries.map(d => d.journey.destination))].join(", ")}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-forest-secondary" />
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-semibold text-forest-primary">{tripData.trip.duration_days} days</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-forest-secondary" />
                <div>
                  <p className="text-sm text-muted-foreground">Travelers</p>
                  <p className="font-semibold text-forest-primary">{tripData.trip.travelers}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Style</p>
                <Badge className="bg-pink-secondary text-white capitalize hover:bg-pink-secondary">
                  {tripData.trip.style}
                </Badge>
              </div>
            </div>

            {tripData.trip.interests.length > 0 && (
              <>
                <Separator className="my-4" />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {tripData.trip.interests.map((interest, index) => (
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

      
        {/* {formData.waypoints && formData.waypoints.length > 0 && (
          <Card className="mb-8 shadow-card">
            <CardHeader>
              <CardTitle className="text-forest-primary flex items-center gap-2">
                <MapPinIcon className="h-5 w-5" />
                Your Journey Route
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-forest-light rounded-lg">
                  <div className="w-3 h-3 rounded-full bg-forest-secondary"></div>
                  <span className="font-semibold text-forest-primary">{formData.startPoint}</span>
                  <span className="text-sm text-muted-foreground">(Starting Point)</span>
                </div>
                
                {formData.waypoints.map((waypoint: any, index: number) => (
                  waypoint.location && (
                    <div key={waypoint.id} className="flex items-center gap-3 p-3 bg-pink-light/30 rounded-lg ml-6">
                      <div className="w-3 h-3 rounded-full bg-pink-secondary"></div>
                      <span className="text-forest-primary">{waypoint.location}</span>
                      <Badge variant="outline" className="ml-auto border-pink-secondary text-pink-secondary">
                        Stop {index + 1}
                      </Badge>
                    </div>
                  )
                ))}
                
                <div className="flex items-center gap-3 p-3 bg-forest-primary/10 rounded-lg">
                  <div className="w-3 h-3 rounded-full bg-forest-primary"></div>
                  <span className="font-semibold text-forest-primary">{formData.destination}</span>
                  <span className="text-sm text-muted-foreground">(Final Destination)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}  */}

        {/* Detailed Itinerary */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-forest-primary">Detailed Itinerary</h2>
          {
            tripData.Itineraries.map((itinerary, index) => (
              itinerary.itinerary.map((day, dayIndex) => (
            <Card key={dayIndex} className="shadow-card">
              <CardHeader className="bg-forest-light">
                <CardTitle className="flex items-center justify-between text-forest-primary">
                  <span>Day {day.day} - {day.weekday}</span>
                  <span className="text-sm font-normal text-forest-primary/70">{day.date}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {day.activities.map((activity, activityIndex) => (
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

                      {activityIndex < day.activities.length - 1 && (
                        <div className="mt-4 pt-4 border-b border-pink-secondary/20"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
            ))
          }
          {}
        </div>

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
            className="bg-gradient-to-r from-pink-secondary to-forest-secondary hover:shadow-lg hover:shadow-pink-secondary/25 transition-all duration-300 text-white"
          >
            Save Itinerary
          </Button>
        </div>
      </div>
    </div>
  );
}