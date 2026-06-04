import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Heart, Lightbulb, Loader2, CheckCircle2, ArrowLeft, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileHeader from "../components/MobileHeader";

const AMOUNTS = [1, 3, 5, 10];

export default function Support() {
  const [amount, setAmount] = useState(3);
  const [customAmount, setCustomAmount] = useState("");
  const [donating, setDonating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(setIsAuthenticated);
  }, []);

  const [suggestion, setSuggestion] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();
  const finalAmount = customAmount ? parseFloat(customAmount) : amount;

  const handleDonate = async () => {
    if (!isAuthenticated) {
      base44.auth.redirectToLogin(window.location.pathname);
      return;
    }
    if (!finalAmount || finalAmount < 1) {
      toast.error("Minimum donation is £1");
      return;
    }
    setDonating(true);
    try {
      const res = await base44.functions.invoke("createCheckout", { amount: finalAmount });
      if (res.data?.redirectUrl) {
        window.location.href = res.data.redirectUrl;
      } else {
        toast.error(res.data?.error || "Something went wrong");
        setDonating(false);
      }
    } catch (err) {
      toast.error("Failed to start checkout");
      setDonating(false);
    }
  };

  const handleSuggestion = async (e) => {
    e.preventDefault();
    if (!suggestion.trim()) return;
    setSubmitting(true);
    try {
      await base44.entities.Suggestion.create({ message: suggestion.trim(), email: email.trim() });
      setSubmitted(true);
      setSuggestion("");
      setEmail("");
    } catch (err) {
      toast.error("Failed to submit suggestion");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MobileHeader title="Support Us" />
      <div className="max-w-2xl mx-auto px-4 py-10 pb-24">

        {/* Back button - desktop only */}
        <button
          onClick={() => navigate(-1)}
          className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-3">Support SimSetApp</h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Whilst donations are not imperative, they allow us to keep it on the black stuff!
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto mt-3">
            Every donation made goes towards fixing issues and implementing your suggestions. This started as a project for one guy in a bedroom and with your help, we can work on becoming the go-to sim racing companion app!
          </p>
        </div>

        {/* Donation card */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <h2 className="font-heading text-sm font-bold tracking-wide mb-4 flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" /> Make a Donation
          </h2>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {AMOUNTS.map(a => (
              <button
                key={a}
                onClick={() => { setAmount(a); setCustomAmount(""); }}
                className={`h-11 rounded-xl border text-sm font-semibold font-heading tracking-wide transition-colors ${
                  !customAmount && amount === a
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary text-foreground hover:border-primary/40"
                }`}
              >
                £{a}
              </button>
            ))}
          </div>

          <div className="relative mb-5">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">£</span>
            <Input
              type="number"
              min="1"
              placeholder="Custom amount"
              value={customAmount}
              onChange={e => { setCustomAmount(e.target.value); }}
              className="pl-7"
            />
          </div>

          <Button
            onClick={handleDonate}
            disabled={donating || !finalAmount || finalAmount < 1}
            className="w-full font-heading text-xs tracking-wider"
          >
            {donating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Heart className="w-4 h-4 mr-2" />}
            {donating ? "Redirecting to checkout..." : isAuthenticated ? `Donate £${finalAmount || "?"}` : "Sign in to Donate"}
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-3">
            Secure checkout powered by Base44 Payments.{!isAuthenticated && " An account is required to donate."}
          </p>
        </div>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/simsetapp"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-card p-4 mb-6 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all group"
        >
          <Instagram className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
          <div>
            <p className="text-xs font-semibold text-foreground">Follow us on Instagram</p>
            <p className="text-xs text-muted-foreground">@simsetapp — updates, tips & community</p>
          </div>
        </a>

        {/* Suggestion card */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-sm font-bold tracking-wide mb-1 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary" /> Got a Suggestion?
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Tell us what you'd love to see in SimSetApp. We read every single one.</p>

          {submitted ? (
            <div className="flex flex-col items-center py-6 gap-3 text-center">
              <CheckCircle2 className="w-10 h-10 text-primary" />
              <p className="font-heading text-sm font-semibold tracking-wide">Thanks for the idea!</p>
              <p className="text-xs text-muted-foreground">We'll consider it for a future update.</p>
              <button onClick={() => setSubmitted(false)} className="text-xs text-primary underline underline-offset-2 mt-1">Submit another</button>
            </div>
          ) : (
            <form onSubmit={handleSuggestion} className="space-y-3">
              <Textarea
                placeholder="Your idea or suggestion..."
                value={suggestion}
                onChange={e => setSuggestion(e.target.value)}
                rows={4}
                className="resize-none"
                required
              />
              <Input
                type="email"
                placeholder="Email (optional — if you'd like a reply)"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Button
                type="submit"
                disabled={submitting || !suggestion.trim()}
                variant="outline"
                className="w-full font-heading text-xs tracking-wider"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lightbulb className="w-4 h-4 mr-2" />}
                {submitting ? "Submitting..." : "Send Suggestion"}
              </Button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}