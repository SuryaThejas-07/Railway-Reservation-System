import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Search, ArrowRight } from "lucide-react";
import { getAllStations, Station } from "@/services/stationService";

const SearchForm = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [stations, setStations] = useState<Station[]>([]);
  const navigate = useNavigate();
  
  // Get today's date in YYYY-MM-DD format for min date validation
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    getAllStations().then(setStations);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !destination || !date) return;
    
    // Validate source and destination are not the same
    if (source === destination) {
      alert("Source and destination cannot be the same. Please select different stations.");
      return;
    }
    
    navigate(`/search?source=${source}&destination=${destination}&date=${date}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-2xl dark:bg-card"
    >
      <div className="relative z-10">
        <div className="grid gap-5 md:grid-cols-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase text-blue-700 dark:text-blue-400">
              <MapPin className="h-4 w-4" /> From
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full rounded-lg border-2 border-blue-300 bg-blue-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-md transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-blue-800 dark:bg-blue-950/50 dark:text-white"
              required
            >
              <option value="">Select source</option>
              {stations.map((s) => (
                <option key={s.id} value={s.stationCode}>
                  {s.stationName} ({s.stationCode})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase text-blue-700 dark:text-blue-400">
              <MapPin className="h-4 w-4" /> To
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full rounded-lg border-2 border-blue-300 bg-blue-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-md transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-blue-800 dark:bg-blue-950/50 dark:text-white"
              required
            >
              <option value="">Select destination</option>
              {stations.map((s) => (
                <option key={s.id} value={s.stationCode}>
                  {s.stationName} ({s.stationCode})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase text-blue-700 dark:text-blue-400">
              <Calendar className="h-4 w-4 dark:!text-white dark:!stroke-white dark:calendar-glow" strokeWidth={2} /> Travel Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={getTodayDate()}
              placeholder="Select date"
              className="w-full rounded-lg border-2 border-blue-300 bg-blue-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-md transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-blue-800 dark:bg-blue-950/50 dark:text-white"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-bold text-white shadow-xl transition duration-300 hover:shadow-2xl hover:from-blue-700 hover:to-blue-800 active:scale-95 flex items-center justify-center gap-2"
            >
              <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition" />
              <Search className="h-4 w-4" />
              Search Trains
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
