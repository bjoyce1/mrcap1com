import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Calendar,
  Mail,
  Users,
  LogOut,
  Loader2,
  Check,
  X,
  Clock,
  Phone,
  MapPin,
  Building,
  MessageSquare,
  ChevronDown,
  Trash2,
  Download,
  Music
} from 'lucide-react';
import ChromaGrid from '@/components/ui/ChromaGrid';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type BookingStatus = 'pending' | 'confirmed' | 'declined' | 'completed';

interface BookingRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  booking_type: string;
  city: string | null;
  venue: string | null;
  event_date: string | null;
  message: string | null;
  status: BookingStatus;
  admin_notes: string | null;
  created_at: string;
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  name: string | null;
  source: string | null;
  subscribed_at: string;
  is_active: boolean;
}

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'bookings' | 'newsletter'>('bookings');
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchData();
    }
  }, [user, isAdmin]);

  const fetchData = async () => {
    setLoadingData(true);
    
    const [bookingsRes, subscribersRes] = await Promise.all([
      supabase.from('booking_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false })
    ]);

    if (bookingsRes.data) setBookings(bookingsRes.data as BookingRequest[]);
    if (subscribersRes.data) setSubscribers(subscribersRes.data);
    
    setLoadingData(false);
  };

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    const { error } = await supabase
      .from('booking_requests')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success(`Booking ${status}`);
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    }
  };

  const deleteBooking = async (id: string) => {
    const { error } = await supabase
      .from('booking_requests')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete booking');
    } else {
      toast.success('Booking deleted');
      setBookings(bookings.filter(b => b.id !== id));
    }
  };

  const toggleSubscriberStatus = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ is_active: !isActive })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update subscriber');
    } else {
      toast.success(isActive ? 'Subscriber deactivated' : 'Subscriber activated');
      setSubscribers(subscribers.map(s => s.id === id ? { ...s, is_active: !isActive } : s));
    }
  };

  const exportSubscribers = () => {
    const activeSubscribers = subscribers.filter(s => s.is_active);
    const csv = [
      'Email,Name,Source,Subscribed Date',
      ...activeSubscribers.map(s => 
        `${s.email},${s.name || ''},${s.source || ''},${new Date(s.subscribed_at).toLocaleDateString()}`
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mrcap-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400 bg-green-400/10';
      case 'declined': return 'text-red-400 bg-red-400/10';
      case 'completed': return 'text-blue-400 bg-blue-400/10';
      default: return 'text-yellow-400 bg-yellow-400/10';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-2xl font-medium mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don't have permission to access this page.</p>
          <Button variant="flux" onClick={() => navigate('/')}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Mr. CAP</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        {/* Header */}
        <header className="border-b border-white/5 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="font-display text-xl font-medium tracking-tight">
                Mr. CAP
              </Link>
              <span className="text-xs text-muted-foreground px-2 py-1 bg-primary/10 rounded-full">
                Admin
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Stats */}
          <div className="mb-8" style={{ height: '120px', position: 'relative' }}>
            <ChromaGrid
              items={[
                { title: String(bookings.length), subtitle: "Bookings", borderColor: "hsl(var(--primary))", gradient: "linear-gradient(145deg, hsl(var(--primary) / 0.1), hsl(var(--background)))", _icon: "calendar" },
                { title: String(bookings.filter(b => b.status === 'pending').length), subtitle: "Pending", borderColor: "#EAB308", gradient: "linear-gradient(210deg, rgba(234,179,8,0.1), hsl(var(--background)))", _icon: "clock" },
                { title: String(bookings.filter(b => b.status === 'confirmed').length), subtitle: "Confirmed", borderColor: "#22C55E", gradient: "linear-gradient(165deg, rgba(34,197,94,0.1), hsl(var(--background)))", _icon: "check" },
                { title: String(subscribers.filter(s => s.is_active).length), subtitle: "Subscribers", borderColor: "#3B82F6", gradient: "linear-gradient(195deg, rgba(59,130,246,0.1), hsl(var(--background)))", _icon: "users" },
              ]}
              columns={4}
              radius={200}
              fadeOut={0}
              renderCard={(item) => {
                const iconMap: Record<string, React.ComponentType<{className?: string}>> = { calendar: Calendar, clock: Clock, check: Check, users: Users };
                const Icon = iconMap[item._icon as string] || Calendar;
                return (
                  <div className="flex items-center gap-3 p-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-display font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                    </div>
                  </div>
                );
              }}
            />
          </div>

          {/* Quick Links */}
          <div className="mb-6">
            <Link
              to="/admin/library"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              <Music className="w-4 h-4" />
              Music Library Manager
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'bookings'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Calendar className="w-4 h-4 inline-block mr-2" />
              Booking Requests
            </button>
            <button
              onClick={() => setActiveTab('newsletter')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'newsletter'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Mail className="w-4 h-4 inline-block mr-2" />
              Newsletter
            </button>
          </div>

          {/* Content */}
          {loadingData ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : activeTab === 'bookings' ? (
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No booking requests yet</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="space-y-3">
                  {bookings.map((booking) => (
                    <AccordionItem
                      key={booking.id}
                      value={booking.id}
                      className="bg-card/50 rounded-xl border border-white/5 overflow-hidden"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center gap-4 w-full">
                          <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                          <span className="font-medium">{booking.name}</span>
                          <span className="text-xs text-muted-foreground capitalize">{booking.booking_type}</span>
                          <span className="text-xs text-muted-foreground ml-auto mr-4">
                            {new Date(booking.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="grid md:grid-cols-2 gap-4 pt-2">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <a href={`mailto:${booking.email}`} className="hover:text-primary">
                                {booking.email}
                              </a>
                            </div>
                            {booking.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <a href={`tel:${booking.phone}`} className="hover:text-primary">
                                  {booking.phone}
                                </a>
                              </div>
                            )}
                            {booking.city && (
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                {booking.city}
                              </div>
                            )}
                            {booking.venue && (
                              <div className="flex items-center gap-2 text-sm">
                                <Building className="w-4 h-4 text-muted-foreground" />
                                {booking.venue}
                              </div>
                            )}
                            {booking.event_date && (
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                {new Date(booking.event_date).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          {booking.message && (
                            <div className="bg-secondary/30 rounded-lg p-3">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <MessageSquare className="w-3 h-3" />
                                Message
                              </div>
                              <p className="text-sm">{booking.message}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                          <Select
                            value={booking.status}
                            onValueChange={(value) => updateBookingStatus(booking.id, value as BookingStatus)}
                          >
                            <SelectTrigger className="w-40 bg-secondary/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="declined">Declined</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteBooking(booking.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-medium">Newsletter Subscribers</h2>
                <Button variant="fluxOutline" size="sm" onClick={exportSubscribers}>
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </div>
              
              {subscribers.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No subscribers yet</p>
                </div>
              ) : (
                <div className="bg-card/50 rounded-xl border border-white/5 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3">Email</th>
                        <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3 hidden sm:table-cell">Name</th>
                        <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3 hidden md:table-cell">Source</th>
                        <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3 hidden md:table-cell">Date</th>
                        <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((subscriber) => (
                        <tr key={subscriber.id} className="border-b border-white/5 last:border-0">
                          <td className="px-4 py-3 text-sm">{subscriber.email}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                            {subscriber.name || '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell capitalize">
                            {subscriber.source || '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                            {new Date(subscriber.subscribed_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleSubscriberStatus(subscriber.id, subscriber.is_active)}
                              className={`text-xs px-2 py-1 rounded-full ${
                                subscriber.is_active
                                  ? 'text-green-400 bg-green-400/10'
                                  : 'text-red-400 bg-red-400/10'
                              }`}
                            >
                              {subscriber.is_active ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Admin;
