import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Train } from "@/services/trainService";
import { UserCircle, Armchair } from "lucide-react";
import SeatSelector, { SeatInfo } from "@/components/SeatSelector";
import { Button } from "@/components/ui/button";

interface PassengerInfo {
  name: string;
  age: string;
  gender: string;
}

const PassengerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { train, date, passengerCount } = (location.state as { train: Train; date: string; passengerCount: number }) || {};

  const [step, setStep] = useState(1); // 1 = Passenger Details, 2 = Seat Selection
  const [currentPassenger, setCurrentPassenger] = useState(0);
  const [passengers, setPassengers] = useState<PassengerInfo[]>(
    Array(passengerCount || 1).fill(null).map(() => ({ name: "", age: "", gender: "" }))
  );
  const [selectedSeats, setSelectedSeats] = useState<SeatInfo[]>([]);

  if (!train || !passengerCount) {
    navigate("/");
    return null;
  }

  const handlePassengerChange = (field: keyof PassengerInfo, value: string) => {
    const updated = [...passengers];
    updated[currentPassenger] = { ...updated[currentPassenger], [field]: value };
    setPassengers(updated);
  };

  const handleNextPassenger = () => {
    const current = passengers[currentPassenger];
    if (!current.name || !current.age || !current.gender) {
      alert("Please fill in all fields for this passenger");
      return;
    }

    if (currentPassenger < passengers.length - 1) {
      setCurrentPassenger(currentPassenger + 1);
    } else {
      // All passengers filled, go to seat selection
      setStep(2);
    }
  };

  const handlePreviousPassenger = () => {
    if (currentPassenger > 0) {
      setCurrentPassenger(currentPassenger - 1);
    }
  };

  const allPassengersComplete = passengers.every(p => p.name && p.age && p.gender);

  const handleSeatSelection = (seats: SeatInfo[]) => {
    if (seats.length !== passengerCount) {
      alert(`Please select exactly ${passengerCount} seat(s) for your passengers`);
      return;
    }

    setSelectedSeats(seats);
    // Calculate seat prices
    const totalSeatPrice = seats.reduce((sum, seat) => sum + seat.price, 0);
    
    navigate("/payment", {
      state: { 
        train, 
        date, 
        passengers: passengers,
        seats: seats.map(s => ({ seatNumber: s.seatNumber, class: s.class, price: s.price })),
        seatTotal: totalSeatPrice,
      },
    });
  };

  const handleBackToPassenger = () => {
    setStep(1);
    setSelectedSeats([]);
  };

  return (
    <div className="container mx-auto max-w-4xl animate-fade-in px-4 py-10">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          {/* Step 1 */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
                step >= 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              <UserCircle className="h-6 w-6" />
            </div>
            <span className={`text-sm font-semibold ${step >= 1 ? "text-foreground" : "text-muted-foreground"}`}>
              Passenger Details
            </span>
          </div>

          {/* Connector */}
          <div className={`h-1 flex-1 mb-8 rounded transition ${step >= 2 ? "bg-primary" : "bg-secondary"}`} />

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
                step >= 2
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              <Armchair className="h-6 w-6" />
            </div>
            <span className={`text-sm font-semibold ${step >= 2 ? "text-foreground" : "text-muted-foreground"}`}>
              Seat Selection
            </span>
          </div>
        </div>
      </div>

      {/* Train Info Card */}
      <div className="mb-8 rounded-xl border bg-gradient-to-r from-primary/10 to-primary/5 p-4">
        <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
          <div>
            <h2 className="text-lg font-bold">{train.trainName}</h2>
            <p className="text-sm text-muted-foreground">
              {train.source} → {train.destination} • {new Date(date).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Fare per person</p>
            <p className="text-2xl font-bold text-primary">₹{train.fare}</p>
          </div>
        </div>
      </div>

      {/* Step 1: Passenger Details */}
      {step === 1 && (
        <div className="card-shadow rounded-2xl border bg-card p-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <UserCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Passenger {currentPassenger + 1} Details</h1>
                <p className="text-sm text-muted-foreground">Step 1 of 2 • Passenger {currentPassenger + 1} of {passengerCount}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Progress</div>
              <div className="text-xl font-bold text-primary">{currentPassenger + 1}/{passengerCount}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Full Name</label>
              <input
                value={passengers[currentPassenger].name}
                onChange={(e) => handlePassengerChange("name", e.target.value)}
                placeholder="Enter passenger's full name"
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Age</label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={passengers[currentPassenger].age}
                  onChange={(e) => handlePassengerChange("age", e.target.value)}
                  placeholder="Age"
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Gender</label>
                <select
                  value={passengers[currentPassenger].gender}
                  onChange={(e) => handlePassengerChange("gender", e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Form Summary */}
            <div className="rounded-lg border border-info bg-info/5 p-4 text-sm">
              <p className="font-semibold mb-2">Current Passenger Details</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Name: <span className="text-foreground font-medium">{passengers[currentPassenger].name || "—"}</span></p>
                <p>Age: <span className="text-foreground font-medium">{passengers[currentPassenger].age || "—"}</span></p>
                <p>Gender: <span className="text-foreground font-medium">{passengers[currentPassenger].gender || "—"}</span></p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Passengers filled</span>
                <span>{passengers.filter(p => p.name && p.age && p.gender).length}/{passengerCount}</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all" 
                  style={{ width: `${((passengers.filter(p => p.name && p.age && p.gender).length) / passengerCount) * 100}%` }}
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-6 flex gap-3 border-t pt-6">
              <Button
                onClick={handlePreviousPassenger}
                variant="outline"
                disabled={currentPassenger === 0}
                className="flex-1"
              >
                ← Previous
              </Button>
              <Button
                onClick={handleNextPassenger}
                disabled={!passengers[currentPassenger].name || !passengers[currentPassenger].age || !passengers[currentPassenger].gender}
                className="flex-1"
              >
                {currentPassenger === passengerCount - 1 ? "Continue to Seats →" : "Next →"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Seat Selection */}
      {step === 2 && (
        <div className="card-shadow rounded-2xl border bg-card p-8">
          <SeatSelector 
            trainId={train.id}
            maxSeatsToSelect={passengerCount}
            onSelectSeats={handleSeatSelection}
            onSeatLocked={(time) => {
              console.log(`Seats locked for ${time} seconds`);
            }}
          />

          {/* Navigation */}
          <div className="mt-8 flex gap-3 border-t pt-6">
            <Button
              onClick={handleBackToPassenger}
              variant="outline"
              className="flex-1"
            >
              ← Back to Details
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerDetails;
