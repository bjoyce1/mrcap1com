import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Loader2, Plus, Trash2, Edit, Music, Disc3, Save, ArrowLeft, Upload,
} from "lucide-react";
import ChromaGrid from "@/components/ui/ChromaGrid";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import type { Album, Track } from "@/stores/playerStore";

const AdminLibrary = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"albums" | "tracks">("albums");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [editingAlbum, setEditingAlbum] = useState<Partial<Album> | null>(null);
  const [editingTrack, setEditingTrack] = useState<Partial<Track> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) fetchData();
  }, [user, isAdmin]);

  const fetchData = async () => {
    setLoadingData(true);
    const [albumsRes, tracksRes] = await Promise.all([
      supabase.from("albums").select("*").order("release_year", { ascending: false }),
      supabase.from("tracks").select("*").order("release_year", { ascending: false }),
    ]);
    if (albumsRes.data) setAlbums(albumsRes.data as Album[]);
    if (tracksRes.data) setTracks(tracksRes.data as Track[]);
    setLoadingData(false);
  };

  const saveAlbum = async () => {
    if (!editingAlbum?.title || !editingAlbum?.slug) {
      toast.error("Title and slug are required");
      return;
    }
    setSaving(true);
    try {
      if (editingAlbum.id) {
        const { error } = await supabase.from("albums").update({
          title: editingAlbum.title,
          slug: editingAlbum.slug,
          artist: editingAlbum.artist || "Mr. CAP",
          release_year: editingAlbum.release_year || new Date().getFullYear(),
          cover_art_url: editingAlbum.cover_art_url,
          description: editingAlbum.description,
          credits: editingAlbum.credits,
          track_count: editingAlbum.track_count || 0,
          is_public: editingAlbum.is_public ?? true,
        }).eq("id", editingAlbum.id);
        if (error) throw error;
        toast.success("Album updated");
      } else {
        const { error } = await supabase.from("albums").insert({
          title: editingAlbum.title,
          slug: editingAlbum.slug,
          artist: editingAlbum.artist || "Mr. CAP",
          release_year: editingAlbum.release_year || new Date().getFullYear(),
          cover_art_url: editingAlbum.cover_art_url,
          description: editingAlbum.description,
          credits: editingAlbum.credits,
          track_count: editingAlbum.track_count || 0,
          is_public: editingAlbum.is_public ?? true,
        });
        if (error) throw error;
        toast.success("Album created");
      }
      setEditingAlbum(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save album");
    }
    setSaving(false);
  };

  const saveTrack = async () => {
    if (!editingTrack?.title || !editingTrack?.slug) {
      toast.error("Title and slug are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: editingTrack.title,
        slug: editingTrack.slug,
        artist: editingTrack.artist || "Mr. CAP",
        album_id: editingTrack.album_id || null,
        track_number: editingTrack.track_number || null,
        duration: editingTrack.duration || 0,
        audio_url: editingTrack.audio_url || null,
        cover_art_url: editingTrack.cover_art_url || null,
        explicit: editingTrack.explicit || false,
        release_year: editingTrack.release_year || new Date().getFullYear(),
        credits: editingTrack.credits || null,
        featured_artists: editingTrack.featured_artists || null,
        isrc: editingTrack.isrc || null,
        is_public: editingTrack.is_public ?? true,
        requires_nft: (editingTrack as any).requires_nft || false,
      };
      if (editingTrack.id) {
        const { error } = await supabase.from("tracks").update(payload).eq("id", editingTrack.id);
        if (error) throw error;
        toast.success("Track updated");
      } else {
        const { error } = await supabase.from("tracks").insert(payload);
        if (error) throw error;
        toast.success("Track created");
      }
      setEditingTrack(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save track");
    }
    setSaving(false);
  };

  const deleteAlbum = async (id: string) => {
    if (!confirm("Delete this album? Tracks won't be deleted but will be unlinked.")) return;
    const { error } = await supabase.from("albums").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else { toast.success("Album deleted"); fetchData(); }
  };

  const deleteTrack = async (id: string) => {
    if (!confirm("Delete this track?")) return;
    const { error } = await supabase.from("tracks").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else { toast.success("Track deleted"); fetchData(); }
  };

  const uploadAudio = async (file: File, trackId: string) => {
    const ext = file.name.split(".").pop();
    const path = `tracks/${trackId}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("audio").upload(path, file, { upsert: true });
    if (uploadError) { toast.error("Upload failed: " + uploadError.message); return; }
    const { data: urlData } = supabase.storage.from("audio").getPublicUrl(path);
    await supabase.from("tracks").update({ audio_url: urlData.publicUrl }).eq("id", trackId);
    toast.success("Audio uploaded");
    fetchData();
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!isAdmin) return <div className="min-h-screen bg-background flex items-center justify-center px-4"><div className="text-center"><h1 className="font-display text-2xl mb-4">Access Denied</h1><Button onClick={() => navigate("/")}>Return Home</Button></div></div>;

  return (
    <>
      <Helmet><title>Music Library Admin | Mr. CAP</title><meta name="robots" content="noindex, nofollow" /></Helmet>
      <div className="min-h-screen bg-background">
        <Navigation />
        <header className="border-b border-border/30 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" /></Link>
              <h1 className="font-display text-lg">Music Library</h1>
              <span className="text-xs text-muted-foreground px-2 py-1 bg-primary/10 rounded-full">Admin</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="flux" onClick={() => activeTab === "albums" ? setEditingAlbum({ is_public: true, artist: "Mr. CAP", release_year: new Date().getFullYear() }) : setEditingTrack({ is_public: true, artist: "Mr. CAP", release_year: new Date().getFullYear() } as any)}>
                <Plus className="w-4 h-4 mr-1" /> New {activeTab === "albums" ? "Album" : "Track"}
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Stats */}
          <div className="mb-6" style={{ height: '100px', position: 'relative' }}>
            <ChromaGrid
              items={[
                { title: String(albums.length), subtitle: "Albums", borderColor: "hsl(var(--primary))", gradient: "linear-gradient(145deg, hsl(var(--primary) / 0.1), hsl(var(--background)))" },
                { title: String(tracks.length), subtitle: "Tracks", borderColor: "#3B82F6", gradient: "linear-gradient(210deg, rgba(59,130,246,0.1), hsl(var(--background)))" },
              ]}
              columns={2}
              radius={150}
              fadeOut={0}
              renderCard={(item) => (
                <div className="flex items-center gap-3 p-4">
                  {item.subtitle === "Albums" ? <Disc3 className="w-8 h-8 text-primary" /> : <Music className="w-8 h-8 text-primary" />}
                  <div><p className="text-2xl font-display text-foreground">{item.title}</p><p className="text-xs text-muted-foreground">{item.subtitle}</p></div>
                </div>
              )}
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {(["albums", "tracks"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${activeTab === tab ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:text-foreground"}`}>
                {tab === "albums" ? <Disc3 className="w-4 h-4 inline mr-2" /> : <Music className="w-4 h-4 inline mr-2" />}
                {tab}
              </button>
            ))}
          </div>

          {loadingData ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : activeTab === "albums" ? (
            <div className="space-y-3">
              {albums.map((album) => (
                <div key={album.id} className="bg-card/50 rounded-xl border border-border/30 p-4 flex items-center gap-4">
                  <img src={album.cover_art_url || "/placeholder.svg"} alt={album.title} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{album.title}</p>
                    <p className="text-sm text-muted-foreground">{album.artist} · {album.release_year} · {album.track_count} tracks</p>
                    <p className="text-xs text-muted-foreground">/album/{album.slug}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${album.is_public ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                    {album.is_public ? "Public" : "Draft"}
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => setEditingAlbum(album)}><Edit className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteAlbum(album.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {tracks.map((track) => (
                <div key={track.id} className="bg-card/50 rounded-xl border border-border/30 p-3 flex items-center gap-3">
                  <img src={track.cover_art_url || "/placeholder.svg"} alt={track.title} className="w-12 h-12 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {track.title}
                      {track.requires_nft && <span className="ml-1.5 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">NFT</span>}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {track.artist}{track.featured_artists && ` ft. ${track.featured_artists}`} · {track.release_year}
                    </p>
                  </div>
                  <span className={`text-[10px] ${track.audio_url ? "text-primary" : "text-muted-foreground"}`}>
                    {track.audio_url ? "✓ Audio" : "No audio"}
                  </span>
                  {!track.audio_url && (
                    <label className="cursor-pointer">
                      <input type="file" accept="audio/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) uploadAudio(e.target.files[0], track.id); }} />
                      <div className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 px-2 py-1 rounded bg-primary/10"><Upload className="w-3 h-3" />Upload</div>
                    </label>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => setEditingTrack(track)}><Edit className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteTrack(track.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Album Edit Dialog */}
        <Dialog open={!!editingAlbum} onOpenChange={(open) => !open && setEditingAlbum(null)}>
          <DialogContent className="max-w-lg bg-card border-border/50">
            <DialogHeader><DialogTitle className="font-display">{editingAlbum?.id ? "Edit Album" : "New Album"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Title</Label><Input value={editingAlbum?.title || ""} onChange={(e) => setEditingAlbum(prev => prev ? { ...prev, title: e.target.value } : prev)} /></div>
              <div><Label>Slug</Label><Input value={editingAlbum?.slug || ""} onChange={(e) => setEditingAlbum(prev => prev ? { ...prev, slug: e.target.value } : prev)} placeholder="the-art-of-ism" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Artist</Label><Input value={editingAlbum?.artist || ""} onChange={(e) => setEditingAlbum(prev => prev ? { ...prev, artist: e.target.value } : prev)} /></div>
                <div><Label>Release Year</Label><Input type="number" value={editingAlbum?.release_year || ""} onChange={(e) => setEditingAlbum(prev => prev ? { ...prev, release_year: Number(e.target.value) } : prev)} /></div>
              </div>
              <div><Label>Cover Art URL</Label><Input value={editingAlbum?.cover_art_url || ""} onChange={(e) => setEditingAlbum(prev => prev ? { ...prev, cover_art_url: e.target.value } : prev)} /></div>
              <div><Label>Description</Label><Textarea value={editingAlbum?.description || ""} onChange={(e) => setEditingAlbum(prev => prev ? { ...prev, description: e.target.value } : prev)} /></div>
              <div><Label>Track Count</Label><Input type="number" value={editingAlbum?.track_count || 0} onChange={(e) => setEditingAlbum(prev => prev ? { ...prev, track_count: Number(e.target.value) } : prev)} /></div>
              <div className="flex items-center gap-2"><Switch checked={editingAlbum?.is_public ?? true} onCheckedChange={(c) => setEditingAlbum(prev => prev ? { ...prev, is_public: c } : prev)} /><Label>Public</Label></div>
              <Button onClick={saveAlbum} disabled={saving} className="w-full"><Save className="w-4 h-4 mr-2" />{saving ? "Saving..." : "Save Album"}</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Track Edit Dialog */}
        <Dialog open={!!editingTrack} onOpenChange={(open) => !open && setEditingTrack(null)}>
          <DialogContent className="max-w-lg bg-card border-border/50 max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display">{editingTrack?.id ? "Edit Track" : "New Track"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Title</Label><Input value={editingTrack?.title || ""} onChange={(e) => setEditingTrack(prev => prev ? { ...prev, title: e.target.value } : prev)} /></div>
              <div><Label>Slug</Label><Input value={editingTrack?.slug || ""} onChange={(e) => setEditingTrack(prev => prev ? { ...prev, slug: e.target.value } : prev)} placeholder="limitless" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Artist</Label><Input value={editingTrack?.artist || ""} onChange={(e) => setEditingTrack(prev => prev ? { ...prev, artist: e.target.value } : prev)} /></div>
                <div><Label>Featured Artists</Label><Input value={editingTrack?.featured_artists || ""} onChange={(e) => setEditingTrack(prev => prev ? { ...prev, featured_artists: e.target.value } : prev)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Album</Label>
                  <select value={editingTrack?.album_id || ""} onChange={(e) => setEditingTrack(prev => prev ? { ...prev, album_id: e.target.value || null } : prev)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">No Album (Single)</option>
                    {albums.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                  </select>
                </div>
                <div><Label>Track #</Label><Input type="number" value={editingTrack?.track_number || ""} onChange={(e) => setEditingTrack(prev => prev ? { ...prev, track_number: Number(e.target.value) || null } : prev)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Duration (sec)</Label><Input type="number" value={editingTrack?.duration || 0} onChange={(e) => setEditingTrack(prev => prev ? { ...prev, duration: Number(e.target.value) } : prev)} /></div>
                <div><Label>Release Year</Label><Input type="number" value={editingTrack?.release_year || ""} onChange={(e) => setEditingTrack(prev => prev ? { ...prev, release_year: Number(e.target.value) } : prev)} /></div>
              </div>
              <div><Label>Audio URL</Label><Input value={editingTrack?.audio_url || ""} onChange={(e) => setEditingTrack(prev => prev ? { ...prev, audio_url: e.target.value } : prev)} placeholder="https://cdn.../track.mp3" /></div>
              <div><Label>Cover Art URL</Label><Input value={editingTrack?.cover_art_url || ""} onChange={(e) => setEditingTrack(prev => prev ? { ...prev, cover_art_url: e.target.value } : prev)} /></div>
              <div><Label>Credits</Label><Textarea value={editingTrack?.credits || ""} onChange={(e) => setEditingTrack(prev => prev ? { ...prev, credits: e.target.value } : prev)} /></div>
              <div><Label>ISRC</Label><Input value={editingTrack?.isrc || ""} onChange={(e) => setEditingTrack(prev => prev ? { ...prev, isrc: e.target.value } : prev)} placeholder="USRC17607839" /></div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2"><Switch checked={editingTrack?.is_public ?? true} onCheckedChange={(c) => setEditingTrack(prev => prev ? { ...prev, is_public: c } : prev)} /><Label>Public</Label></div>
                <div className="flex items-center gap-2"><Switch checked={editingTrack?.explicit || false} onCheckedChange={(c) => setEditingTrack(prev => prev ? { ...prev, explicit: c } : prev)} /><Label>Explicit</Label></div>
                <div className="flex items-center gap-2"><Switch checked={(editingTrack as any)?.requires_nft || false} onCheckedChange={(c) => setEditingTrack(prev => prev ? { ...prev, requires_nft: c } as any : prev)} /><Label>NFT-Gated</Label></div>
              </div>
              <Button onClick={saveTrack} disabled={saving} className="w-full"><Save className="w-4 h-4 mr-2" />{saving ? "Saving..." : "Save Track"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AdminLibrary;
