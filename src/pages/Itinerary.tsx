
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, Calendar } from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";

interface TripData {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  travelStyle: string;
  interests: string[];
}

interface Activity {
  id: string;
  name: string;
  time: string;
  location: string;
  description: string;
  category: string;
}

interface DayItinerary {
  date: Date;
  activities: Activity[];
}

const Itinerary = () => {
  const navigate = useNavigate();
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [itinerary, setItinerary] = useState<DayItinerary[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem('tripData');
    if (!storedData) {
      navigate('/');
      return;
    }

    const data = JSON.parse(storedData);
    setTripData(data);
    generateItinerary(data);
  }, [navigate]);

  const generateItinerary = (data: TripData) => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const days = differenceInDays(endDate, startDate) + 1;

    const sampleActivities: Record<string, Activity[]> = {
      food: [
        { id: '1', name: 'Local Food Tour', time: '10:00 AM - 2:00 PM', location: 'City Center', description: 'Explore authentic local cuisine with a knowledgeable guide', category: 'food' },
        { id: '2', name: 'Cooking Class', time: '6:00 PM - 9:00 PM', location: 'Cultural Center', description: 'Learn to prepare traditional dishes from local chefs', category: 'food' },
      ],
      hiking: [
        { id: '3', name: 'Mountain Trail Hike', time: '7:00 AM - 4:00 PM', location: 'National Park', description: 'Scenic hiking trail with breathtaking mountain views', category: 'hiking' },
        { id: '4', name: 'Nature Walk', time: '8:00 AM - 11:00 AM', location: 'Forest Reserve', description: 'Peaceful walk through diverse ecosystems', category: 'hiking' },
      ],
      history: [
        { id: '5', name: 'Historic District Tour', time: '9:00 AM - 12:00 PM', location: 'Old Town', description: 'Guided tour of historical landmarks and monuments', category: 'history' },
        { id: '6', name: 'Museum Visit', time: '2:00 PM - 5:00 PM', location: 'National Museum', description: 'Explore artifacts and exhibits showcasing local heritage', category: 'history' },
      ],
      beaches: [
        { id: '7', name: 'Beach Day', time: '10:00 AM - 6:00 PM', location: 'Paradise Beach', description: 'Relax on pristine sandy beaches with crystal clear waters', category: 'beaches' },
        { id: '8', name: 'Water Sports', time: '9:00 AM - 1:00 PM', location: 'Marina Bay', description: 'Exciting water activities including snorkeling and kayaking', category: 'beaches' },
      ],
      nightlife: [
        { id: '9', name: 'Rooftop Bar Experience', time: '8:00 PM - 12:00 AM', location: 'Downtown', description: 'Enjoy cocktails with panoramic city views', category: 'nightlife' },
        { id: '10', name: 'Live Music Venue', time: '9:00 PM - 1:00 AM', location: 'Arts District', description: 'Experience local music scene and cultural performances', category: 'nightlife' },
      ],
      shopping: [
        { id: '11', name: 'Local Markets', time: '9:00 AM - 2:00 PM', location: 'Central Market', description: 'Browse unique local crafts and souvenirs', category: 'shopping' },
        { id: '12', name: 'Artisan Workshops', time: '3:00 PM - 6:00 PM', location: 'Craft Quarter', description: 'Visit local artisans and purchase handmade goods', category: 'shopping' },
      ],
      art: [
        { id: '13', name: 'Art Gallery Tour', time: '10:00 AM - 1:00 PM', location: 'Gallery District', description: 'Explore contemporary and traditional art collections', category: 'art' },
        { id: '14', name: 'Street Art Walk', time: '2:00 PM - 5:00 PM', location: 'Creative Quarter', description: 'Discover vibrant street art and murals', category: 'art' },
      ],
      photography: [
        { id: '15', name: 'Sunrise Photography Tour', time: '5:30 AM - 9:00 AM', location: 'Scenic Overlook', description: 'Capture stunning sunrise views with professional guidance', category: 'photography' },
        { id: '16', name: 'Architecture Photography Walk', time: '3:00 PM - 6:00 PM', location: 'Historic Center', description: 'Document beautiful architectural details and designs', category: 'photography' },
      ]
    };

    const generatedItinerary: DayItinerary[] = [];

    for (let i = 0; i < days; i++) {
      const currentDate = addDays(startDate, i);
      const dayActivities: Activity[] = [];

      // Add activities based on interests
      data.interests.forEach((interest, index) => {
        if (sampleActivities[interest] && sampleActivities[interest][i % 2]) {
          dayActivities.push(sampleActivities[interest][i % 2]);
        }
      });

      // Add some general activities if not enough specific ones
      if (dayActivities.length < 2) {
        const generalActivities = [
          { id: `general-${i}-1`, name: 'City Walking Tour', time: '10:00 AM - 1:00 PM', location: data.destination, description: 'Explore the main attractions and hidden gems', category: 'general' },
          { id: `general-${i}-2`, name: 'Local Restaurant Lunch', time: '1:00 PM - 3:00 PM', location: 'Downtown', description: 'Taste authentic local cuisine', category: 'food' },
          { id: `general-${i}-3`, name: 'Leisure Time', time: '4:00 PM - 6:00 PM', location: 'Hotel/Accommodation', description: 'Relax and prepare for evening activities', category: 'relaxation' },
        ];
        dayActivities.push(...generalActivities.slice(0, 3 - dayActivities.length));
      }

      generatedItinerary.push({
        date: currentDate,
        activities: dayActivities.slice(0, 3) // Limit to 3 activities per day
      });
    }

    setItinerary(generatedItinerary);
  };

  const getCategoryColor = (category: string) => {
    return 'bg-secondary text-secondary-foreground';
  };

  if (!tripData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Plan New Trip
            </Button>
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold">Your Itinerary</h1>
              <p className="text-muted-foreground">{tripData.destination} • {tripData.travelers} traveler{tripData.travelers > 1 ? 's' : ''}</p>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      {/* Trip Overview */}
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <MapPin className="w-5 h-5" />
              Trip to {tripData.destination}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(tripData.startDate), "MMM d")} - {format(new Date(tripData.endDate), "MMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{differenceInDays(new Date(tripData.endDate), new Date(tripData.startDate)) + 1} days</span>
              </div>
              <div>
                <span className="font-medium">Style: </span>
                <Badge variant="secondary" className="capitalize">{tripData.travelStyle}</Badge>
              </div>
            </div>
            <div className="mt-4">
              <span className="font-medium">Interests: </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {tripData.interests.map((interest) => (
                  <Badge key={interest} variant="outline" className="capitalize">
                    {interest.replace(/([A-Z])/g, ' $1').trim()}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Itinerary */}
        <div className="space-y-8">
          {itinerary.map((day, dayIndex) => (
            <Card 
              key={dayIndex} 
              className="shadow-md animate-fade-in"
              style={{ animationDelay: `${dayIndex * 0.1}s` }}
            >
              <CardHeader className="border-b">
                <CardTitle className="text-xl">
                  Day {dayIndex + 1} - {format(day.date, "EEEE, MMMM d")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {day.activities.map((activity, activityIndex) => (
                    <div 
                      key={activity.id}
                      className="flex items-start gap-4 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors animate-slide-in-right"
                      style={{ animationDelay: `${(dayIndex * 0.1) + (activityIndex * 0.05)}s` }}
                    >
                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{activity.name}</h3>
                          <Badge variant="outline">{activity.category}</Badge>
                        </div>
                        <div className="space-y-1 text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{activity.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{activity.location}</span>
                          </div>
                        </div>
                        <p className="mt-2 text-gray-700">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="mt-12 text-center shadow-md">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Ready for Your Adventure?</h2>
            <p className="text-muted-foreground mb-6">Your personalized itinerary is ready! Don't forget to check local weather and book your accommodations.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.print()}
              >
                Print Itinerary
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
              >
                Plan Another Trip
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Itinerary;
