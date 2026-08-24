import { Link } from "react-router-dom";
import { Heart, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center rounded-xl border border-border bg-card p-10">
          <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight mb-3">Thank you so much!</h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            Your donation means the world to us. Every penny goes directly towards keeping SimSetApp running and building the features you've asked for. You're keeping us on the black stuff! 🏁
          </p>
          <Button asChild className="w-full font-heading text-xs tracking-wider">
            <Link to="/"><Home className="w-4 h-4 mr-2" />Back to Home</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}