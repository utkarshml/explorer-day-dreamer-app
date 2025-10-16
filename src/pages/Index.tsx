import TripPlanner from "./TripPlanner";
import bannerImage from "../assets/image.png"
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png"
import { SiteHeader } from "@/components/site-header";
const Index = () => {
  return(
  <>
   <div className="bg-gradient-to-br from-primary to-secondary">
   <SiteHeader/>
   <TripPlanner />
   </div>
  </>
  )
};

export default Index;
