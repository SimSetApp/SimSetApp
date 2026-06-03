import { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Camera, Save, User, Loader2, Settings, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileHeader from "@/components/MobileHeader";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";
import MessagesPanel from "@/components/MessagesPanel";

export default function Profile() {
  const { isAuthenticated, isLoadingAuth, navigateToLogin } = useAuth();
  const queryClient = useQueryClient();
  const fileRef = useRef(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "messages" ? "messages" : "settings";
  const initialWith = searchParams.get("with") || null;

  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
    enabled: !!isAuthenticated,
  });

  const [form, setForm] = useState(null);

  if (user && form === null) {
    setForm({
      display_name: user.display_name || user.full_name || "",
      bio: user.bio || "",
      avatar_url: user.avatar_url || "",
    });
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      await base44.auth.updateMe({ display_name: form.display_name, bio: form.bio, avatar_url: form.avatar_url });
      const mySetups = await base44.entities.CommunitySetup.filter({ author_id: user.id });
      if (mySetups.length > 0 && form.display_name) {
        await Promise.all(mySetups.map(s => base44.entities.CommunitySetup.update(s.id, { author_name: form.display_name })));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["communitySetups"] });
      queryClient.invalidateQueries({ queryKey: ["author-profiles-bulk"] });
      toast.success("Profile updated!");
    },
    onError: () => toast.error("Failed to save profile"),
  });

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, avatar_url: file_url }));
    setAvatarUploading(false);
  };

  if (!isLoadingAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-24 text-center">
          <p className="text-muted-foreground mb-4">Sign in to manage your profile.</p>
          <Button onClick={navigateToLogin}>Sign In</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MobileHeader title="My Profile" />
      <div className="max-w-5xl mx-auto px-4 py-10 pb-24">
        <div className="hidden md:flex items-center gap-3 mb-6">
          <Settings className="w-5 h-5 text-primary" />
          <h1 className="font-heading text-2xl font-bold">My Profile</h1>
        </div>

        {isLoading || !form ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs defaultValue={initialTab}>
            <TabsList className="bg-secondary mb-6">
              <TabsTrigger value="settings" className="text-xs font-heading tracking-wide">
                <Settings className="w-3.5 h-3.5 mr-1.5" />Profile Settings
              </TabsTrigger>
              <TabsTrigger value="messages" className="text-xs font-heading tracking-wide">
                <MessageCircle className="w-3.5 h-3.5 mr-1.5" />Messages
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings">
              <div className="max-w-lg space-y-7">
                <p className="text-sm text-muted-foreground -mt-2">
                  Changes reflect immediately across the community.
                </p>

                {/* Avatar */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-border">
                      {form.avatar_url ? (
                        <img src={form.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-muted-foreground" />
                      )}
                    </div>
                    <button
                      onClick={() => fileRef.current?.click()}
                      disabled={avatarUploading}
                      className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
                    >
                      {avatarUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </div>
                  <p className="text-xs text-muted-foreground">Click the camera to change your avatar</p>
                </div>

                {/* Display Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="username">Display Name</Label>
                  <Input
                    id="username"
                    value={form.display_name}
                    onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                    placeholder="Your name"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={form.bio}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    placeholder="Tell the community about your sim racing..."
                    className="resize-none h-28"
                    maxLength={300}
                  />
                  <p className="text-xs text-muted-foreground text-right">{(form.bio || "").length}/300</p>
                </div>

                <Button
                  className="w-full font-heading text-xs tracking-wider"
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending || avatarUploading}
                >
                  {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Profile
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="messages">
              <MessagesPanel me={user} initialUserId={initialWith} />
            </TabsContent>
          </Tabs>
        )}
      </div>
      <Footer />
    </div>
  );
}