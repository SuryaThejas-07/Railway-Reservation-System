import SearchForm from "@/components/SearchForm";
import { useNavigate } from "react-router-dom";
import { 
  Train, Shield, Clock, CreditCard, MapPin, Users, Zap, TrendingUp,
  Star, CheckCircle, ArrowRight, Award, Smartphone, Percent, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Train, title: "500+ Trains", desc: "All major railways & express routes", color: "from-blue-500/20 to-blue-600/20" },
  { icon: Shield, title: "100% Secure", desc: "Encrypted transactions & data protection", color: "from-green-500/20 to-green-600/20" },
  { icon: Zap, title: "Instant e-Ticket", desc: "Confirmed in less than 30 seconds", color: "from-yellow-500/20 to-yellow-600/20" },
  { icon: CreditCard, title: "8+ Payment Ways", desc: "UPI, Cards, Wallets, Net Banking", color: "from-purple-500/20 to-purple-600/20" },
];

const stats = [
  { number: "50L+", label: "Happy Travelers", icon: Users },
  { number: "2L+", label: "Daily Bookings", icon: TrendingUp },
  { number: "4.8★", label: "App Rating", icon: Star },
  { number: "24/7", label: "Customer Support", icon: Clock },
];

const howItWorks = [
  { 
    step: 1, 
    title: "Search Routes", 
    desc: "Enter departure & destination cities with travel date",
    color: "from-blue-500 to-blue-600"
  },
  { 
    step: 2, 
    title: "Choose Train", 
    desc: "Compare prices, timings, and seat availability",
    color: "from-purple-500 to-purple-600"
  },
  { 
    step: 3, 
    title: "Book Seats", 
    desc: "Select your preferred seats & passenger details",
    color: "from-pink-500 to-pink-600"
  },
  { 
    step: 4, 
    title: "Confirm Payment", 
    desc: "Pay securely & get instant e-ticket",
    color: "from-green-500 to-green-600"
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    city: "Mumbai",
    rating: 5,
    text: "Best app for booking trains! So easy and reliable. Saved me hours of waiting in queues.",
    avatar: "🧑‍🦱"
  },
  {
    name: "Rajesh Kumar",
    city: "Delhi",
    rating: 5,
    text: "Excellent service! Got my ticket within seconds. The seat selection feature is amazing.",
    avatar: "👨‍💼"
  },
  {
    name: "Anjali Patel",
    city: "Bangalore",
    rating: 5,
    text: "Very secure and transparent pricing. No hidden charges. Highly recommended!",
    avatar: "👩‍💻"
  },
];

const specialOffers = [
  {
    title: "First Booking",
    discount: "₹500 OFF",
    desc: "On bookings above ₹2000",
    icon: Percent,
    color: "from-orange-500/20 to-red-500/20"
  },
  {
    title: "Group Travel",
    discount: "15% OFF",
    desc: "Booking 4+ passengers together",
    icon: Users,
    color: "from-green-500/20 to-teal-500/20"
  },
  {
    title: "Student Special",
    discount: "20% OFF",
    desc: "With valid student ID",
    icon: Award,
    color: "from-blue-500/20 to-cyan-500/20"
  },
];

const RunningTrain = () => (
  <div className="relative mt-8 h-20 overflow-hidden">
    <div className="absolute bottom-4 left-0 right-0 h-[2px] bg-primary-foreground/30" />
    <div className="absolute bottom-[14px] left-0 right-0 flex gap-8">
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} className="h-[2px] w-4 bg-primary-foreground/20" style={{ marginLeft: i === 0 ? 0 : undefined }} />
      ))}
    </div>
    <div className="train-running absolute bottom-5">
      <svg width="180" height="50" viewBox="0 0 180 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="10" width="50" height="30" rx="4" fill="currentColor" className="text-primary-foreground/90" />
        <rect x="5" y="15" width="15" height="12" rx="2" fill="currentColor" className="text-primary/60" />
        <polygon points="50,15 65,10 65,40 50,40" fill="currentColor" className="text-primary-foreground" />
        <rect x="10" y="2" width="8" height="10" rx="2" fill="currentColor" className="text-primary-foreground/80" />
        <circle cx="14" cy="0" r="4" fill="currentColor" className="text-primary-foreground/30 animate-pulse" />
        <circle cx="6" cy="-4" r="3" fill="currentColor" className="text-primary-foreground/20 animate-pulse" style={{ animationDelay: "0.3s" }} />
        <rect x="68" y="12" width="45" height="28" rx="3" fill="currentColor" className="text-primary-foreground/80" />
        <rect x="73" y="17" width="10" height="10" rx="1" fill="currentColor" className="text-primary/50" />
        <rect x="86" y="17" width="10" height="10" rx="1" fill="currentColor" className="text-primary/50" />
        <rect x="99" y="17" width="10" height="10" rx="1" fill="currentColor" className="text-primary/50" />
        <rect x="116" y="12" width="45" height="28" rx="3" fill="currentColor" className="text-primary-foreground/70" />
        <rect x="121" y="17" width="10" height="10" rx="1" fill="currentColor" className="text-primary/50" />
        <rect x="134" y="17" width="10" height="10" rx="1" fill="currentColor" className="text-primary/50" />
        <rect x="147" y="17" width="10" height="10" rx="1" fill="currentColor" className="text-primary/50" />
        <circle cx="15" cy="42" r="5" fill="currentColor" className="text-primary-foreground" />
        <circle cx="38" cy="42" r="5" fill="currentColor" className="text-primary-foreground" />
        <circle cx="80" cy="42" r="5" fill="currentColor" className="text-primary-foreground" />
        <circle cx="100" cy="42" r="5" fill="currentColor" className="text-primary-foreground" />
        <circle cx="128" cy="42" r="5" fill="currentColor" className="text-primary-foreground" />
        <circle cx="148" cy="42" r="5" fill="currentColor" className="text-primary-foreground" />
      </svg>
    </div>
  </div>
);

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      {/* HERO SECTION */}
      <section className="hero-gradient px-4 py-20 text-center text-primary-foreground overflow-hidden relative">
        {/* Background elements */}
        <div className="absolute top-0 right-10 w-40 h-40 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-60 h-60 bg-primary-foreground/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary-foreground/20 border border-primary-foreground/40">
            <p className="text-sm font-semibold">🚂 Welcome to RailBook - India's #1 Train Booking Platform</p>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Your Journey, <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-200">Our Priority</span>
          </h1>
          
          <p className="text-xl md:text-2xl opacity-95 mb-2 max-w-2xl mx-auto">
            Book train tickets in seconds, not hours. Travel smart with India's most trusted railway booking platform.
          </p>
          
          <p className="text-base opacity-85 mb-8 max-w-xl mx-auto">
            From Rajdhani Express to local trains, access 500+ trains across 1000+ routes with transparent pricing and instant confirmation.
          </p>
          
          <RunningTrain />
        </div>
      </section>

      {/* SEARCH SECTION */}
      <section className="container mx-auto -mt-10 max-w-4xl px-4 relative z-20">
        <SearchForm />
      </section>

      {/* STATS SECTION */}
      <section className="container mx-auto max-w-5xl px-4 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 hover:shadow-lg transition">
                <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl md:text-3xl font-bold">{stat.number}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="container mx-auto max-w-5xl px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Why Choose RailBook?</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          We've reimagined train booking to be faster, safer, and more convenient than ever before.
        </p>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={`rounded-xl border bg-gradient-to-br ${f.color} p-6 hover:shadow-lg transition group`}
              >
                <div className="mb-4 w-fit rounded-lg bg-primary/20 p-3 group-hover:scale-110 transition">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gradient-to-b from-secondary/30 to-transparent px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">4 Simple Steps</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            From search to confirmation, book your perfect journey in under 2 minutes.
          </p>
          
          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-primary to-primary/50" />
            
            {howItWorks.map((item, i) => (
              <div key={i} className="relative">
                <div className="text-center mb-6">
                  <div className={`w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-3xl font-bold shadow-lg`}>
                    {item.step}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIAL OFFERS */}
      <section className="container mx-auto max-w-5xl px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">🎉 Special Offers</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Exclusive deals and discounts for our valued passengers.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {specialOffers.map((offer, i) => {
            const Icon = offer.icon;
            return (
              <div key={i} className={`rounded-xl border-2 border-primary/20 bg-gradient-to-br ${offer.color} p-6 hover:border-primary hover:shadow-lg transition`}>
                <div className="mb-4 flex items-center justify-between">
                  <Icon className="h-8 w-8 text-primary" />
                  <span className="text-xs font-bold text-primary bg-primary/20 px-3 py-1 rounded-full">Limited Time</span>
                </div>
                <h3 className="font-bold text-xl mb-1">{offer.discount}</h3>
                <p className="text-sm text-muted-foreground">{offer.title}</p>
                <p className="text-xs text-muted-foreground/70 mt-2">{offer.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-gradient-to-b from-transparent to-secondary/30 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Loved by Millions ❤️</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Hear what travelers say about their experience with RailBook.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-xl border bg-card p-6 hover:shadow-lg transition">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{t.avatar}</span>
                  <div>
                    <h4 className="font-bold">{t.name}</h4>
                    <p className="text-xs text-muted-foreground">{t.city}</p>
                  </div>
                </div>
                <div className="mb-3 flex gap-1">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="container mx-auto max-w-5xl px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Trust RailBook?</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">256-bit Encryption</h3>
            <p className="text-sm text-muted-foreground">Bank-level security for all transactions</p>
          </div>
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Instant Refund</h3>
            <p className="text-sm text-muted-foreground">Cancel bookings anytime with no questions</p>
          </div>
          <div className="text-center">
            <MessageSquare className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
            <p className="text-sm text-muted-foreground">Multilingual customer support always ready</p>
          </div>
        </div>
      </section>

      {/* FAQ PREVIEW */}
      <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Quick Questions Answered</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { q: "How long does booking take?", a: "Usually less than 2 minutes from search to confirmation." },
              { q: "Can I modify my ticket?", a: "Yes! Modify seat, date, or passenger up to 3 days before travel." },
              { q: "What if I want to cancel?", a: "Cancel anytime with partial or full refund based on timing." },
              { q: "What payment methods are available?", a: "UPI, Debit/Credit cards, Wallets, NetBanking, and EMI options." },
            ].map((faq, i) => (
              <div key={i} className="rounded-lg border bg-card p-4">
                <p className="font-bold text-sm mb-2">Q: {faq.q}</p>
                <p className="text-sm text-muted-foreground">A: {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="hero-gradient px-4 py-20 text-center text-primary-foreground">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Start Your Journey Today
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Join 50 lakh+ travelers who've already experienced hassle-free train booking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate("/search")}
              size="lg" 
              className="bg-white text-primary hover:bg-primary-foreground"
            >
              Book Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            >
              Learn More
            </Button>
          </div>
          <p className="text-sm opacity-75 mt-6">
            ✓ No hidden charges • ✓ Instant confirmation • ✓ 24/7 support
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
