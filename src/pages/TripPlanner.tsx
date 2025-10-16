import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, MapPinIcon, UsersIcon, PlusIcon, MinusIcon, MapPin, X, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { TripResponse } from "./TripResults";
import AddressAutocomplete from "@/components/AutoComplete";

interface Waypoint {
  id: string;
  location: string;
}


interface LocationResult {
  place_id: string
  address: {
    city: string
    state: string
    country: string
  },
  display_name: string
  lat: string
  lon: string
  type: string
  importance: number
}
export default function TripPlanner() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [tripData, setTripData] = useState<TripResponse | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<LocationResult | null>(null)
  const apiKey = "pk.2d00b08eedfd33e0137b8e3021a1b9bc"
  const [formData, setFormData] = useState({
    startPoint: "",
    destination: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    travelers: 1,
    travelStyle: "",
    specialInterests: [] as string[],
    waypoints: [] as Waypoint[]
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleAddressSelect = (address: LocationResult, type: string) => {
    if (type === "startPoint") {
      setFormData(prev => ({
        ...prev,
        startPoint: address.address.city + " " + address.address.state + " " + address.address.country
      }))
    }
    if (type === "endPoint") {
      setFormData(prev => ({
        ...prev,
        destination: address.address.city + " " + address.address.state + " " + address.address.country
      }))
    }
    setSelectedAddress(address)
    console.log("Selected address:", address)
  }
  const IntermidiateHandler = (address: LocationResult, type: string) => {
    updateWaypoint(type, "location", address.address.city + " " + address.address.state + " " + address.address.country)
    setSelectedAddress(address)
    console.log("Selected address:", address)
  }


  const travelStyles = [
    { value: "luxury", label: "Luxury" },
    { value: "adventure", label: "Adventure" },
    { value: "budget", label: "Budget" },
    { value: "cultural", label: "Cultural" },
    { value: "romantic", label: "Romantic" },
    { value: "family", label: "Family" },
    { value: "cultural", label: "Cultural" },
    {}
  ];

  const interests = [
    "Food & Dining", "Hiking", "History", "Beaches",
    "Nightlife", "Shopping", "Art", "Photography", "Education",
    "Religion"
  ];


  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      specialInterests: prev.specialInterests.includes(interest)
        ? prev.specialInterests.filter(i => i !== interest)
        : [...prev.specialInterests, interest]
    }));
  };

  const addWaypoint = () => {
    const newWaypoint: Waypoint = {
      id: Date.now().toString(),
      location: ""
    };
    setFormData(prev => ({
      ...prev,
      waypoints: [...prev.waypoints, newWaypoint]
    }));
  };

  const removeWaypoint = (id: string) => {
    setFormData(prev => ({
      ...prev,
      waypoints: prev.waypoints.filter(w => w.id !== id)
    }));
  };

  const updateWaypoint = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      waypoints: prev.waypoints.map(w =>
        w.id === id ? { ...w, [field]: value } : w
      )
    }));
  };

  const handleSubmit = async () => {
    console.log(formData)
    if (!formData.startPoint || !formData.destination || !formData.startDate || !formData.endDate || !formData.travelStyle) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const middlePoint = formData.waypoints.map((w: { location: string }) => w.location);
    try {
      setIsLoading(true);
      const response = await fetch("https://travilling-server.vercel.app/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          {
            "startPoint": formData.startPoint,
            "midPoints": middlePoint,
            "destination": formData.destination,
            "startDate": formData.startDate ? format(formData.startDate, "yyyy-MM-dd") : "",
            "endDate": formData.endDate ? format(formData.endDate, "yyyy-MM-dd") : "",
            "travelers": formData.travelers,
            "travel_style": formData.travelStyle,
            "special_interests": formData.specialInterests
          }

        )
      })
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setIsLoading(false);
      localStorage.setItem("trip", JSON.stringify(data.response));
      setTripData(data.response);
    } catch (e) {
      console.error("Error in form submission:", e);
      setIsLoading(false);
      toast({
        title: "Server Load",
        description: "Please Try again",
        variant: "destructive"
      });
    }
    navigate("/results");
  };

  if (isLoading) {
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
    <div className="min-h-screen ">
      <div className="container   mx-auto px-2  py-8">
        <Card className="max-w-4xl mx-auto bg-white/15 shadow-2xl backdrop-blur-md shadow-forest  border-none isolate">
          <CardHeader className="bg-gradient-forest text-pink-secondary rounded-t-lg">

          </CardHeader>

          <CardContent className="lg:p-8 p-4 md:p-6 space-y-8">
            {/* Trip Route - Google Maps Style Layout */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-secondary-foreground font-semibold text-lg flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5" />
                    Your Journey Route
                  </Label>
                  <p className="text-sm text-secondary-foreground mt-1">Plan your route from start to destination</p>
                </div>
              </div>

              <Card className="p-6 bg-gradient-to-br from-forest-light/30 to-pink-light/20 border-forest-muted">
                <div className="space-y-4 relative">
                  <div className="w-[2px] hidden lg:block absolute top-[52%] transform -translate-y-1/2 left-[7px] z-0   h-[75%] bg-forest-muted"></div>
                  {/* Start Point */}
                  <div className="flex items-center gap-4">
                    <div className="hidden lg:block w-4 h-4 z-10 rounded-full bg-primary flex-shrink-0 mt-1"></div>
                    <div className="flex-1 relative">
                      <Label htmlFor="startPoint" className="text-primary font-semibold text-sm mb-2 block">
                        Starting Point *
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <AddressAutocomplete
                          placeholder="Enter your starting point"
                          apiKey={apiKey}
                          tag={"startPoint"}
                          onAddressSelect={handleAddressSelect}
                        />
                      </div>

                    </div>

                  </div>

                  {/* Waypoints */}
                  {formData.waypoints.map((waypoint, index) => (
                    <div key={waypoint.id} className="flex items-center gap-4">
                      {/* Connection Line */}
                      <div className=" hidden lg:flex relative flex-col items-center">
                        <div className="w-3 h-3 p-2 mt-4s rounded-full z-10  bg-black flex-shrink-0"></div>
                      </div>
                      <div className="flex-1 flex items-center gap-3">
                        <div className="flex-1">
                          <Label className="text-black font-semibold text-sm mb-2 block">
                            Stop {index + 1}
                          </Label>
                          <AddressAutocomplete
                            placeholder="Add intermediate stop"
                            apiKey={apiKey}
                            tag={waypoint.id}
                            onAddressSelect={IntermidiateHandler}
                          />
                        </div>
                        <Button
                          onClick={() => removeWaypoint(waypoint.id)}
                          variant="ghost"
                          size="sm"
                          type="button"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-6"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Add Waypoint Button */}
                  <div className="flex relative  items-center gap-4">
                    <div className=" hidden relative lg:flex flex-col items-center">

                      <Button
                        onClick={addWaypoint}
                        variant="ghost"
                        size="sm"
                        type="button"
                        className="w-8 h-8  absolute -left-[7px] -top-[16px] hidden lg:flex rounded-full p-0 bg-pink-light hover:bg-black hover:text-white border border-black   text-black"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <Button
                        onClick={addWaypoint}
                        variant="ghost"
                        type="button"
                        className="justify-start text-black hover:text-black hover:bg-black/10  w-full"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add intermediate stop
                      </Button>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="flex items-center gap-4">
                    <div className="hidden lg:flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full z-10 bg-secondary flex-shrink-0"></div>
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="destination" className="text-secondary font-semibold text-sm mb-2 block">
                        Destination *
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <AddressAutocomplete
                          placeholder="Enter your starting point"
                          apiKey={apiKey}
                          tag={"endPoint"}
                          onAddressSelect={handleAddressSelect}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-secondary-foreground font-semibold">Start Date *</Label>
                <Popover open={openStart} onOpenChange={setOpenStart}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-forest-muted",
                        !formData.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "PPP") : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => {
                        setFormData(prev => ({
                          ...prev,
                          startDate: date,
                          endDate: prev.endDate && date && prev.endDate <= date ? undefined : prev.endDate
                        }));
                        setOpenStart(false);
                      }}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-secondary-foreground font-semibold">End Date *</Label>
                <Popover  open={openEnd} onOpenChange={setOpenEnd} >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-forest-muted",
                        !formData.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(formData.endDate, "PPP") : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => {setFormData(prev => ({ ...prev, endDate: date }))
                      setOpenEnd(false)
                      }
                    }
                      disabled={(date) => {
                        const today = new Date(new Date().setHours(0, 0, 0, 0));
                        // Disable past dates
                        if (date < today) return true;
                        // Disable dates before or equal to start date
                        if (formData.startDate && date <= formData.startDate) return true;
                        return false;
                      }}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Travelers and Style */}
<div className="grid md:grid-cols-2 gap-6">
  <div className="space-y-4">
    <Label htmlFor="travelers" className="text-secondary-foreground font-semibold flex items-center gap-2">
      <UsersIcon className="h-4 w-4" />
      Number of Travelers
    </Label>
    <Input
      id="travelers"
      type="text"
      value={formData.travelers}
      onChange={(e) => {
        const value = e.target.value.trim();
        
        // Allow empty input for editing
        if (value === "") {
          setFormData(prev => ({ ...prev, travelers: "" }));
          return;
        }
        
        // Only accept numeric input
        if (!/^\d+$/.test(value)) {
          return;
        }
        
        const numValue = parseInt(value);
        
        // Ensure minimum value of 1
        if (numValue < 1) {
          setFormData(prev => ({ ...prev, travelers: 1 }));
          return;
        }
        
        setFormData(prev => ({ ...prev, travelers: numValue }));
      }}
      onBlur={() => {
        // Set to 1 if empty on blur
        if (formData.travelers === "" || formData.travelers === 0) {
          setFormData(prev => ({ ...prev, travelers: 1 }));
        }
      }}
      placeholder="Enter number (min: 1)"
      className="border-forest-muted focus:border-forest-secondary"
    />
  </div>

  <div className="space-y-2">
    <Label className="text-secondary-foreground font-semibold">Travel Style *</Label>
    <Select value={formData.travelStyle} onValueChange={(value) => setFormData(prev => ({ ...prev, travelStyle: value }))}>
      <SelectTrigger className="border-forest-muted">
        <SelectValue placeholder="Choose your style" />
      </SelectTrigger>
      <SelectContent>
        {travelStyles.map(style => (
          <SelectItem key={style.value} value={style.value}>
            {style.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
</div>

            {/* Special Interests */}
            <div className="space-y-4">
              <Label className="text-secondary-foreground font-semibold text-lg">Special Interests</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {interests.map(interest => (
                  <div key={interest} className="flex cursor-pointer items-center space-x-2">
                    <Checkbox
                      id={interest}
                      checked={formData.specialInterests.includes(interest)}
                      onCheckedChange={() => handleInterestToggle(interest)}
                      className="border-white data-[state=checked]:bg-primary"
                    />
                    <Label
                      htmlFor={interest}
                      className="text-sm text-black  cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {interest}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8 py-3 text-lg hover:bg-pink-secondary rounded-full shadow-forest transition-all duration-300"
              >
                Generate Itinerary
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
