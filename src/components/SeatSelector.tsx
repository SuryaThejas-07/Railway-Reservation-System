import { useState, useEffect } from "react";
import { AlertCircle, Clock, Armchair, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SeatInfo {
  seatNumber: string;
  class: "SL" | "2A" | "3A" | "1A";
  price: number;
  isWindow?: boolean;
  isBooked?: boolean;
  isSelected?: boolean;
}

interface SeatSelectorProps {
  trainId?: string;
  totalSeats?: number;
  className?: string;
  onSelectSeats?: (seats: SeatInfo[]) => void;
  bookedSeats?: string[];
  maxSeatsToSelect?: number;
  onSeatLocked?: (expiresIn: number) => void;
}

const SEAT_PRICES: Record<string, number> = {
  "SL": 1500,  // Sleeper
  "2A": 3500,  // AC 2-Tier
  "3A": 2500,  // AC 3-Tier
  "1A": 4500,  // AC 1-Tier
};

const SEATS_PER_CLASS = {
  "SL": { rows: 3, seats: 8, type: "Sleeper (Lower/Upper)" },
  "2A": { rows: 2, seats: 8, type: "AC 2-Tier" },
  "3A": { rows: 4, seats: 8, type: "AC 3-Tier" },
  "1A": { rows: 2, seats: 4, type: "AC 1-Tier (Deluxe)" },
};

const SeatSelector = ({
  trainId = "12295",
  bookedSeats = ["SL-5", "2A-6", "3A-12"],
  maxSeatsToSelect = 4,
  onSelectSeats,
  onSeatLocked,
  className = "",
}: SeatSelectorProps) => {
  const [selectedSeats, setSelectedSeats] = useState<SeatInfo[]>([]);
  const [windowPreference, setWindowPreference] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState<number | null>(null);
  const [showGroupSuggestions, setShowGroupSuggestions] = useState(false);

  // Timer for seat lock (5 minutes)
  useEffect(() => {
    if (lockTimeRemaining === null || lockTimeRemaining <= 0) return;

    const timer = setInterval(() => {
      setLockTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          setSelectedSeats([]);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lockTimeRemaining]);

  // Lock seats when selected
  useEffect(() => {
    if (selectedSeats.length > 0 && lockTimeRemaining === null) {
      const fiveMinutes = 5 * 60;
      setLockTimeRemaining(fiveMinutes);
      onSeatLocked?.(fiveMinutes);
    }
  }, [selectedSeats]);

  const generateSeats = (seatClass: string, startNumber: number) => {
    const config = SEATS_PER_CLASS[seatClass as keyof typeof SEATS_PER_CLASS];
    if (!config) return [];

    const seats: SeatInfo[] = [];
    for (let row = 0; row < config.rows; row++) {
      for (let seat = 0; seat < config.seats; seat++) {
        const seatNum = startNumber + row * config.seats + seat + 1;
        const seatId = `${seatClass}-${seatNum}`;
        const isWindow = windowPreference && [0, config.seats - 1].includes(seat);

        seats.push({
          seatNumber: seatId,
          class: seatClass as any,
          price: SEAT_PRICES[seatClass],
          isWindow,
          isBooked: bookedSeats.includes(seatId),
        });
      }
    }
    return seats;
  };

  const allSeats = [
    ...generateSeats("SL", 0),
    ...generateSeats("2A", 100),
    ...generateSeats("3A", 200),
    ...generateSeats("1A", 300),
  ];

  const handleSeatClick = (seat: SeatInfo) => {
    if (seat.isBooked) return;

    setSelectedSeats((prev) => {
      const isSelected = prev.some((s) => s.seatNumber === seat.seatNumber);

      if (isSelected) {
        return prev.filter((s) => s.seatNumber !== seat.seatNumber);
      } else if (prev.length < maxSeatsToSelect) {
        return [...prev, seat];
      }
      return prev;
    });
  };

  const getSeatColor = (seat: SeatInfo): string => {
    if (seat.isBooked) return "bg-destructive hover:bg-destructive cursor-not-allowed opacity-60";
    if (selectedSeats.some((s) => s.seatNumber === seat.seatNumber)) return "bg-primary text-primary-foreground";
    if (seat.isWindow) return "bg-success/20 hover:bg-success/30 border-2 border-success";
    return "bg-secondary hover:bg-secondary/80";
  };

  const groupSuggestions = [
    { seats: 4, label: "Family (4 seats)", price: SEAT_PRICES["2A"] * 4 },
    { seats: 2, label: "Couple (2 seats)", price: SEAT_PRICES["2A"] * 2 },
    { seats: 3, label: "Group (3 seats)", price: SEAT_PRICES["3A"] * 3 },
  ];

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Select Your Seats</h2>
        <p className="text-sm text-muted-foreground">
          Choose up to {maxSeatsToSelect} seats • Your seats will be locked for 5 minutes
        </p>
      </div>

      {/* Lock Timer Alert */}
      {lockTimeRemaining !== null && (
        <div className="flex items-center gap-3 rounded-lg border border-warning bg-warning/5 p-4">
          <Clock className="h-5 w-5 text-warning" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-warning">Seats Locked</p>
            <p className="text-xs text-warning/80">
              Your selected seats are reserved for {formatTime(lockTimeRemaining)}
            </p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="grid gap-3 md:grid-cols-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-secondary" />
          <span className="text-xs">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border-2 border-success bg-success/20" />
          <span className="text-xs">Window (₹+100)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-primary" />
          <span className="text-xs">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-destructive opacity-60" />
          <span className="text-xs">Booked</span>
        </div>
      </div>

      {/* Seat Classes */}
      <div className="space-y-6">
        {(["SL", "2A", "3A", "1A"] as const).map((seatClass) => {
          const config = SEATS_PER_CLASS[seatClass];
          const classSeats = allSeats.filter((s) => s.class === seatClass);
          const selectedInClass = selectedSeats.filter((s) => s.class === seatClass);

          return (
            <div key={seatClass} className="rounded-xl border bg-card p-6">
              {/* Class Header */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold">{config.type} Seats</h3>
                  <p className="text-sm text-muted-foreground">₹{SEAT_PRICES[seatClass]} per seat</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {classSeats.filter((s) => !s.isBooked).length} available
                  </p>
                  {selectedInClass.length > 0 && (
                    <p className="text-sm font-semibold text-primary">
                      {selectedInClass.length} selected
                    </p>
                  )}
                </div>
              </div>

              {/* Seat Grid */}
              <div className="space-y-2">
                {Array.from({ length: config.rows }).map((_, rowIdx) => (
                  <div key={`row-${rowIdx}`} className="flex gap-2 justify-center items-center">
                    {/* Row Label */}
                    <span className="w-8 text-center text-xs font-semibold text-muted-foreground">
                      {String.fromCharCode(65 + rowIdx)}
                    </span>

                    {/* Seats */}
                    <div className="flex gap-2">
                      {classSeats
                        .slice(rowIdx * config.seats, (rowIdx + 1) * config.seats)
                        .map((seat) => (
                          <button
                            key={seat.seatNumber}
                            onClick={() => handleSeatClick(seat)}
                            disabled={seat.isBooked}
                            title={
                              seat.isBooked
                                ? "Booked"
                                : `${seat.seatNumber} - ₹${seat.price}${seat.isWindow ? " (Window)" : ""}`
                            }
                            className={`group relative h-8 w-8 rounded transition-all ${getSeatColor(seat)}`}
                          >
                            <Armchair className="h-4 w-4 mx-auto mt-2" />
                            {seat.isWindow && !seat.isBooked && (
                              <Star className="absolute -top-1 -right-1 h-3 w-3 fill-success text-success" />
                            )}

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md whitespace-nowrap group-hover:block z-10">
                              {seat.seatNumber}
                              <br />
                              ₹{seat.price}
                            </div>
                          </button>
                        ))}
                    </div>

                    {/* Row Label (Right) */}
                    <span className="w-8 text-center text-xs font-semibold text-muted-foreground">
                      {String.fromCharCode(65 + rowIdx)}
                    </span>
                  </div>
                ))}

                {/* Aisle Divider */}
                {seatClass === "SL" && (
                  <p className="text-center text-xs text-muted-foreground mt-3">← Aisle →</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Preferences & Suggestions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Window Preference */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-3 flex items-center gap-2 font-semibold">
            <Star className="h-5 w-5 text-warning" />
            Window Preference
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Window seats offer better views and are marked with a star (⭐)
          </p>
          <button
            onClick={() => setWindowPreference(!windowPreference)}
            className={`w-full rounded-lg border-2 px-4 py-2 text-sm font-semibold transition ${
              windowPreference
                ? "border-success bg-success/10 text-success"
                : "border-muted-foreground bg-secondary text-muted-foreground hover:border-success"
            }`}
          >
            {windowPreference ? "✓ Window Preference Enabled" : "Prefer Window Seats"}
          </button>
        </div>

        {/* Group Suggestions */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-3 font-semibold">Quick Group Bookings</h3>
          <div className="space-y-2">
            {groupSuggestions.map((group, i) => (
              <button
                key={i}
                disabled={selectedSeats.length > 0}
                onClick={() => {
                  // This would integrate with a suggestion algorithm
                  // For now, just show the option
                  alert(
                    `${group.label}: ₹${group.price} total\n\nThis feature suggests the best available seats for your group.`
                  );
                }}
                className="w-full rounded-lg border bg-secondary px-3 py-2 text-left text-sm hover:bg-secondary/80 disabled:opacity-50 transition"
              >
                <div className="font-medium">{group.label}</div>
                <div className="text-xs text-muted-foreground">Total: ₹{group.price}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Seats Summary */}
      {selectedSeats.length > 0 && (
        <div className="rounded-xl border border-primary bg-primary/5 p-6">
          <h3 className="mb-3 font-bold">Selected Seats</h3>
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedSeats.map((seat) => (
              <div
                key={seat.seatNumber}
                className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
              >
                <span>{seat.seatNumber}</span>
                <button
                  onClick={() => handleSeatClick(seat)}
                  className="hover:opacity-80 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="space-y-2 border-t border-primary/20 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span>Base fare ({selectedSeats.length} seats)</span>
              <span>₹{totalPrice}</span>
            </div>
            {selectedSeats.some((s) => s.isWindow) && (
              <div className="flex items-center justify-between text-sm text-warning">
                <span>Window seat premium</span>
                <span>₹{selectedSeats.filter((s) => s.isWindow).length * 100}</span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-primary/20 pt-2 text-base font-bold">
              <span>Total</span>
              <span>
                ₹
                {totalPrice +
                  (selectedSeats.filter((s) => s.isWindow).length * 100)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => onSelectSeats?.(selectedSeats)}
          disabled={selectedSeats.length === 0}
          className="flex-1"
          size="lg"
        >
          {selectedSeats.length === 0
            ? "Select Seats"
            : `Continue with ${selectedSeats.length} Seat${selectedSeats.length > 1 ? "s" : ""}`}
        </Button>
        {selectedSeats.length > 0 && (
          <Button
            onClick={() => setSelectedSeats([])}
            variant="outline"
            size="lg"
          >
            Clear Selection
          </Button>
        )}
      </div>

      {/* Info Message */}
      {selectedSeats.length === 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-info bg-info/5 p-4">
          <AlertCircle className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
          <div className="text-sm text-info">
            <p className="font-semibold">Select {maxSeatsToSelect > 1 ? "up to " + maxSeatsToSelect + " seats" : "your seat"}</p>
            <p className="text-xs mt-1">
              Click any available seat to select it. Your selection will be reserved for 5 minutes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelector;
