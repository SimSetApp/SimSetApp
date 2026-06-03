import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MessagesPanel from "@/components/MessagesPanel";

export default function Messages() {
  const { isAuthenticated, isLoadingAuth, navigateToLogin } = useAuth();
  const [me, setMe] = useState(null);

  // Support ?with=userId to open a specific conversation on load
  const urlParams = new URLSearchParams(window.location.search);
  const initialUserId = urlParams.get("with") || null;

  useEffect(() => {
    if (isAuthenticated) {
      base44.auth.me().then(u => setMe(u));
    }
  }, [isAuthenticated]);

  if (!isLoadingAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-24 text-center">
          <div className="rounded-2xl border border-border bg-card p-10">
            <MessageCircle className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold mb-2">Sign in to use Messages</h2>
            <p className="text-sm text-muted-foreground mb-6">Connect with other sim racers.</p>
            <Button onClick={navigateToLogin} className="w-full">Sign In / Register</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <MobileHeader title="Messages" />
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 pb-28">
        <div className="flex items-center gap-2 mb-5">
          <MessageCircle className="w-5 h-5 text-primary" />
          <h1 className="font-heading text-xl font-bold">Messages</h1>
        </div>
        {me && <MessagesPanel me={me} initialUserId={initialUserId} />}
      </div>
      <Footer />
    </div>
  );
}