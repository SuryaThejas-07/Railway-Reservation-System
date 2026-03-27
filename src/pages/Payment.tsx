import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { createBooking } from "@/services/bookingService";
import { Train } from "@/services/trainService";
import { CreditCard, Loader2, Armchair } from "lucide-react";

interface Seat {
  seatNumber: string;
  class: string;
  price: number;
}

interface Passenger {
  name: string;
  age: number | string;
  gender: string;
}

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { train, date, passengers = [], seats = [], seatTotal = 0 } = (location.state as {
    train: Train;
    date: string;
    passengers: Passenger[];
    seats?: Seat[];
    seatTotal?: number;
  }) || {};

  const [processing, setProcessing] = useState(false);

  if (!train || !passengers || passengers.length === 0 || !user) {
    navigate("/");
    return null;
  }

  // Calculate total: (fare * number of passengers) + additional seat charges
  const baseFareTotal = train.fare * passengers.length;
  const totalAmount = seatTotal > 0 ? seatTotal : baseFareTotal;

  const handlePay = async () => {
    setProcessing(true);
    try {
      // For now, book the first passenger as primary
      // In a real app, you might create multiple bookings or a combined one
      const firstPassenger = passengers[0];
      const result = await createBooking(
        user.uid,
        train.id,
        train.trainNumber,
        train.trainName,
        firstPassenger.name,
        typeof firstPassenger.age === 'string' ? Number(firstPassenger.age) : firstPassenger.age,
        firstPassenger.gender,
        date,
        totalAmount,
        seats,
        {
          source: train.source,
          destination: train.destination,
          departureTime: train.departureTime,
          arrivalTime: train.arrivalTime,
          fare: train.fare,
        }
      );
      navigate("/booking-confirmation", {
        state: {
          PNR: result.PNR,
          bookingId: result.bookingId,
          coach: result.coach,
          seatNumber: result.seatNumber,
          trainName: train.trainName || "N/A",
          trainNumber: train.trainNumber || "N/A",
          source: train.source || "N/A",
          destination: train.destination || "N/A",
          departureTime: train.departureTime || "N/A",
          arrivalTime: train.arrivalTime || "N/A",
          travelDate: date,
          passengerName: firstPassenger.name,
          age: typeof firstPassenger.age === 'string' ? Number(firstPassenger.age) : firstPassenger.age,
          gender: firstPassenger.gender,
          fare: train.fare || 0,
          totalPrice: totalAmount,
          bookingStatus: "confirmed",
          seats: result.seats || seats,
          passengers,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl animate-fade-in px-4 py-10">
      <div className="card-shadow rounded-2xl border bg-card p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Payment Summary</h1>
            <p className="text-sm text-muted-foreground">Review your booking details</p>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          {/* Trip Details */}
          <div className="rounded-lg border border-secondary bg-secondary/30 p-4">
            <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">Trip Details</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Train</span>
                <span className="font-medium">{train.trainName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Route</span>
                <span className="font-medium">{train.source} → {train.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{new Date(date).toLocaleDateString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Passenger Details */}
          <div className="rounded-lg border border-secondary bg-secondary/30 p-4">
            <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">Passengers ({passengers.length})</p>
            <div className="space-y-3">
              {passengers.map((passenger, index) => (
                <div key={index} className="space-y-2 pb-3 border-b last:border-b-0 last:pb-0">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Passenger {index + 1}</span>
                    <span className="font-medium">{passenger.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Age</span>
                    <span className="font-medium">{passenger.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gender</span>
                    <span className="font-medium">{passenger.gender}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seats Section */}
          {seats && seats.length > 0 && (
            <div className="rounded-lg border border-secondary bg-secondary/30 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Armchair className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold uppercase text-muted-foreground">Booked Seats</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {seats.map((seat) => (
                  <div
                    key={seat.seatNumber}
                    className="flex items-center justify-between rounded-md bg-background p-2"
                  >
                    <span className="font-medium">
                      {seat.seatNumber} <span className="text-xs text-muted-foreground">{seat.class}</span>
                    </span>
                    <span className="text-sm text-primary">₹{seat.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="space-y-2 border-t pt-4">
            {seats && seats.length > 0 ? (
              <>
                <div className="flex justify-between text-muted-foreground">
                  <span>Base Fare ({passengers.length} passengers)</span>
                  <span>₹{baseFareTotal}</span>
                </div>
                {seatTotal > baseFareTotal && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Seat Charges</span>
                    <span>₹{seatTotal - baseFareTotal}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{totalAmount}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between pt-2 text-lg font-bold">
                <span>Total Fare ({passengers.length} passengers)</span>
                <span className="text-primary">₹{totalAmount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePay}
          disabled={processing}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          {processing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              Pay ₹{totalAmount}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Payment;
