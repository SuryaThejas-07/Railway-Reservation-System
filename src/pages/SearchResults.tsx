import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchTrains, Train, getSchedulesForDate, TrainSchedule, getAllTrains } from "@/services/trainService";
import TrainCard from "@/components/TrainCard";
import Loader from "@/components/Loader";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle, Filter, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface FilterState {
  minPrice: number;
  maxPrice: number;
  departureTimeFrom: number;
  departureTimeTo: number;
}

const SearchResults = () => {
  const [params] = useSearchParams();
  const [trains, setTrains] = useState<Train[]>([]);
  const [allTrainsInSystem, setAllTrainsInSystem] = useState<Train[]>([]);
  const [schedules, setSchedules] = useState<TrainSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"price" | "time" | "duration">("price");
  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: 10000,
    departureTimeFrom: 0,
    departureTimeTo: 24,
  });
  const [maxPrice, setMaxPrice] = useState(10000);
  const { user } = useAuth();
  const navigate = useNavigate();

  const source = params.get("source") || "";
  const destination = params.get("destination") || "";
  const date = params.get("date") || "";

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load all trains in the system
        const allTrains = await getAllTrains();
        setAllTrainsInSystem(allTrains);

        // Search trains by source/destination and date
        const searchedTrains = await searchTrains(source, destination, date);
        setTrains(searchedTrains);

        // Calculate max price from results
        if (searchedTrains.length > 0) {
          const max = Math.max(...searchedTrains.map(t => t.fare));
          setMaxPrice(Math.ceil(max / 500) * 500); // Round up to nearest 500
          setFilters(f => ({ ...f, maxPrice: max }));
        }

        // Get schedules for the date
        if (date) {
          try {
            const dateSchedules = await getSchedulesForDate(date);
            setSchedules(dateSchedules);
          } catch (error) {
            console.warn("Could not load schedules:", error);
            setSchedules([]);
          }
        }
      } catch (error) {
        console.error("Error loading trains:", error);
        setTrains([]);
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [source, destination, date]);

  const handleBook = (train: Train) => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Check if train is available on selected date
    const schedule = schedules.find(s => s.trainId === train.id);
    if (!schedule || schedule.seatsAvailable < passengerCount) {
      alert(`Only ${schedule?.seatsAvailable || 0} seats available. Please select fewer passengers or another train.`);
      return;
    }

    navigate("/passenger-details", { state: { train, date, passengerCount } });
  };

  // Helper function to calculate duration in hours
  const calculateDuration = (train: Train): number => {
    const [depHour, depMin] = train.departureTime.split(":").map(Number);
    const [arrHour, arrMin] = train.arrivalTime.split(":").map(Number);
    
    let duration = (arrHour * 60 + arrMin) - (depHour * 60 + depMin);
    if (duration < 0) duration += 24 * 60; // Handle next-day arrival
    return duration / 60;
  };

  // Filter trains by available schedules and filter criteria
  const availableTrains = trains.filter(t => {
    const schedule = schedules.find(s => s.trainId === t.id);
    if (!schedule || schedule.seatsAvailable <= 0) return false;

    // Apply price filter
    if (t.fare < filters.minPrice || t.fare > filters.maxPrice) return false;

    // Apply departure time filter
    const depHour = parseInt(t.departureTime.split(":")[0]);
    if (depHour < filters.departureTimeFrom || depHour > filters.departureTimeTo) return false;

    return true;
  });

  // Sort filtered trains
  const sortedTrains = [...availableTrains].sort((a, b) => {
    if (sortBy === "price") {
      return a.fare - b.fare;
    } else if (sortBy === "time") {
      return parseInt(a.departureTime) - parseInt(b.departureTime);
    } else if (sortBy === "duration") {
      return calculateDuration(a) - calculateDuration(b);
    }
    return 0;
  });

  const resetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: maxPrice,
      departureTimeFrom: 0,
      departureTimeTo: 24,
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto max-w-6xl animate-fade-in px-4 py-10">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">
          {source} → {destination}
        </h1>
        <p className="text-sm text-muted-foreground">
          Travel date: <span className="font-medium">{new Date(date).toLocaleDateString()}</span>
          <span className="mx-2">•</span>
          <span className="font-medium">{availableTrains.length} trains available</span>
        </p>
      </div>

      {/* Passenger Count Section */}
      <div className="mb-6 rounded-lg border bg-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <label className="text-sm font-semibold text-foreground">Number of Passengers</label>
            <p className="text-xs text-muted-foreground">Select how many passengers are traveling</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={passengerCount}
              onChange={(e) => setPassengerCount(Number(e.target.value))}
              className="rounded-md border bg-background px-3 py-2 text-sm font-medium"
            >
              <option value={1}>1 Passenger</option>
              <option value={2}>2 Passengers</option>
              <option value={3}>3 Passengers</option>
              <option value={4}>4 Passengers</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filter Panel */}
        <div className={`${showFilters ? "block" : "hidden"} w-full md:block md:w-72`}>
          <div className="sticky top-4 rounded-lg border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Filters</h3>
              {(filters.minPrice > 0 || filters.maxPrice < maxPrice || 
                filters.departureTimeFrom > 0 || filters.departureTimeTo < 24) && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-primary hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Price Filter */}
            <div className="space-y-4">
              <div>
                <h4 className="mb-3 text-sm font-medium">Price Range</h4>
                <div className="space-y-2">
                  <Slider
                    value={[filters.minPrice]}
                    onValueChange={(value) =>
                      setFilters(f => ({ ...f, minPrice: value[0] }))
                    }
                    min={0}
                    max={maxPrice}
                    step={100}
                    className="w-full"
                  />
                  <Slider
                    value={[filters.maxPrice]}
                    onValueChange={(value) =>
                      setFilters(f => ({ ...f, maxPrice: value[0] }))
                    }
                    min={0}
                    max={maxPrice}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm">
                    <span>₹{filters.minPrice}</span>
                    <span className="text-muted-foreground">-</span>
                    <span>₹{filters.maxPrice}</span>
                  </div>
                </div>
              </div>

              {/* Departure Time Filter */}
              <div className="border-t pt-4">
                <h4 className="mb-3 text-sm font-medium">Departure Time</h4>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <select
                      value={filters.departureTimeFrom}
                      onChange={(e) =>
                        setFilters(f => ({ 
                          ...f, 
                          departureTimeFrom: Math.min(Number(e.target.value), f.departureTimeTo) 
                        }))
                      }
                      className="flex-1 rounded-md border bg-background px-2 py-1.5 text-sm"
                    >
                      {Array.from({ length: 24 }).map((_, i) => (
                        <option key={i} value={i}>
                          {String(i).padStart(2, "0")}:00
                        </option>
                      ))}
                    </select>
                    <span className="flex items-center text-sm text-muted-foreground">to</span>
                    <select
                      value={filters.departureTimeTo}
                      onChange={(e) =>
                        setFilters(f => ({ 
                          ...f, 
                          departureTimeTo: Math.max(Number(e.target.value), f.departureTimeFrom) 
                        }))
                      }
                      className="flex-1 rounded-md border bg-background px-2 py-1.5 text-sm"
                    >
                      {Array.from({ length: 25 }).map((_, i) => (
                        <option key={i} value={i}>
                          {String(i).padStart(2, "0")}:00
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {String(filters.departureTimeFrom).padStart(2, "0")}:00 - {String(filters.departureTimeTo).padStart(2, "0")}:00
                  </p>
                </div>
              </div>
            </div>

            {/* Close button for mobile */}
            <Button
              onClick={() => setShowFilters(false)}
              variant="outline"
              size="sm"
              className="mt-4 w-full md:hidden"
            >
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="mb-6 flex items-center justify-between gap-3">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              size="sm"
              className="md:hidden gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="time">Departure Time</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Trains List */}
          {sortedTrains.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-20 text-center">
              <AlertTriangle className="h-10 w-10 text-warning" />
              <p className="text-lg font-semibold">No trains found</p>
              <p className="text-sm text-muted-foreground">
                {availableTrains.length === 0 && trains.length > 0
                  ? "No trains match your filter criteria. Try adjusting your filters."
                  : trains.length === 0
                  ? "No trains available for this route."
                  : "All trains are fully booked for this date."}
              </p>
              {availableTrains.length === 0 && trains.length > 0 && (
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Reset Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedTrains.map((t) => {
                const schedule = schedules.find(s => s.trainId === t.id);
                return (
                  <div key={t.id} className="relative">
                    <TrainCard 
                      train={t} 
                      onBook={handleBook}
                      seatsAvailable={schedule?.seatsAvailable || 0}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Available Trains Section */}
      {sortedTrains.length === 0 && allTrainsInSystem.length > 0 && (
        <div className="mt-12 border-t pt-12">
          <div className="mb-6 rounded-lg border border-info bg-info/5 p-4 flex gap-3">
            <Info className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-info">No trains on this route?</p>
              <p className="text-xs text-info/80 mt-1">
                Browse all available trains in the system below. You can also try searching for different dates or routes.
              </p>
            </div>
          </div>

          <h2 className="mb-6 text-2xl font-bold">All Available Trains in System</h2>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allTrainsInSystem.map((train) => {
              const trainScheduleCount = schedules.filter(s => s.trainId === train.id).length;
              return (
                <div
                  key={train.id}
                  className="rounded-lg border bg-card p-4 hover:border-primary hover:shadow-md transition"
                >
                  <div className="mb-3">
                    <p className="font-bold text-sm flex items-center gap-2">
                      {train.trainName}
                      <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
                        #{train.trainNumber}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground text-xs">Route</p>
                      <p className="font-medium">
                        {train.source} → {train.destination}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-muted-foreground text-xs">Fare</p>
                        <p className="font-semibold text-primary">₹{train.fare}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Time</p>
                        <p className="font-medium">{train.departureTime} - {train.arrivalTime}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Capacity</p>
                      <p className="font-medium">{train.totalSeats} seats</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-xs text-success font-semibold flex items-center gap-1">
                      📅 {trainScheduleCount} schedules
                    </span>
                    <Button
                      onClick={() => {
                        // Redirect to search for this train's route
                        navigate(`/search?source=${train.source}&destination=${train.destination}&date=${date}`);
                      }}
                      size="sm"
                      variant="outline"
                    >
                      View
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
