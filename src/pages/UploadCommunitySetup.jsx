import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, Check, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CAR_LISTS } from "../lib/simData";

const SIM_OPTIONS = Object.keys(CAR_LISTS);

export default function UploadCommunitySetup() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    sim_title: "",
    car: "",
    track: "",
    description: "",
    setup_notes: ""
  });
  const [parameters, setParameters] = useState({});

  useEffect(() => {
    base44.auth.me().then(setCurrentUser).catch(() => {});
  }, []);

  const uploadMutation = useMutation({
    mutationFn: async () => {
      const result = await base44.entities.CommunitySetup.create({
        title: formData.title,
        sim_title: formData.sim_title,
        car: formData.car,
        track: formData.track || "N/A",
        notes: formData.setup_notes,
        parameters: parameters,
        author_id: currentUser?.id || "unknown",
        author_name: currentUser?.full_name || currentUser?.email?.split('@')[0] || "Anonymous",
        download_count: 0,
        rating_count: 0,
        rating_sum: 0,
        popularity_score: 0
      });
      return result;
    },
    onSuccess: () => {
      toast.success("Setup uploaded to community library!");
      navigate("/community-library");
    },
    onError: (error) => {
      toast.error("Failed to upload setup");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.sim_title || !formData.car) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!currentUser) {
      toast.error("You must be logged in to upload setups");
      return;
    }
    uploadMutation.mutate();
  };

  const carClasses = formData.sim_title ? CAR_LISTS[formData.sim_title] || {} : {};
  const allCars = Object.values(carClasses).flat();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-foreground">Upload Community Setup</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Share your setup with the sim racing community
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardDescription>Fill in the details below to share your setup</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Required Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Setup Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Hotlap Setup - Dry Conditions"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sim">Simulation *</Label>
                    <Select
                      value={formData.sim_title}
                      onValueChange={(value) => setFormData({ ...formData, sim_title: value, car: "" })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sim" />
                      </SelectTrigger>
                      <SelectContent>
                        {SIM_OPTIONS.map(sim => (
                          <SelectItem key={sim} value={sim}>{sim}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="car">Car *</Label>
                    <Select
                      value={formData.car}
                      onValueChange={(value) => setFormData({ ...formData, car: value })}
                      disabled={!formData.sim_title}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={formData.sim_title ? "Select car" : "Select sim first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {allCars.map(car => (
                          <SelectItem key={car} value={car}>{car}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="track">Track</Label>
                    <Input
                      id="track"
                      placeholder="e.g., Spa-Francorchamps"
                      value={formData.track}
                      onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Setup Notes *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe conditions, driving style, tyre pressures, and what this setup is optimized for..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="h-24"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="setup_notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="setup_notes"
                    placeholder="Any additional tips, tyre pressures, or setup philosophy..."
                    value={formData.setup_notes}
                    onChange={(e) => setFormData({ ...formData, setup_notes: e.target.value })}
                    className="h-20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90"
                  disabled={uploadMutation.isPending}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadMutation.isPending ? "Uploading..." : "Upload to Community"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/community-library")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <h3 className="font-heading text-sm font-semibold mb-2">Tips for Great Setups</h3>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>Include track and weather conditions</li>
            <li>Describe the driving style this setup suits</li>
            <li>Mention tyre pressures and fuel loads</li>
            <li>Explain what the setup is optimized for (qualifying, race, endurance)</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
}