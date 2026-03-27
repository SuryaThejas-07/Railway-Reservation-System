import {
  addDocument,
  queryCollection,
  updateDocument,
  incrementField,
  getCollection,
} from "@/firebase/firestore";

export interface Seat {
  seatNumber: string;
  class: string;
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  trainId: string;
  trainNumber: string;
  trainName?: string;
  passengerName: string;
  age: number;
  gender: string;
  coach: string;
  seatNumber: number;
  travelDate: string; // ISO format: YYYY-MM-DD
  PNR: string;
  bookingStatus: string;
  seats?: Seat[];
  totalAmount?: number;
  fare?: number;
  source?: string;
  destination?: string;
  departureTime?: string;
  arrivalTime?: string;
  createdAt: any;
}

const generatePNR = () => {
  const chars = "0123456789";
  let pnr = "";
  for (let i = 0; i < 10; i++) pnr += chars[Math.floor(Math.random() * chars.length)];
  return pnr;
};

const generateSeat = () => {
  const coaches = ["S1", "S2", "S3", "A1", "A2", "B1", "B2"];
  const coach = coaches[Math.floor(Math.random() * coaches.length)];
  const seat = Math.floor(Math.random() * 72) + 1;
  return { coach, seatNumber: seat };
};

export const createBooking = async (
  userId: string,
  trainId: string,
  trainNumber: string,
  trainName: string,
  passengerName: string,
  age: number,
  gender: string,
  travelDate: string, // ISO format: YYYY-MM-DD
  amount: number,
  seats?: Seat[],
  trainDetails?: {
    source?: string;
    destination?: string;
    departureTime?: string;
    arrivalTime?: string;
    fare?: number;
  }
) => {
  const { coach, seatNumber } = generateSeat();
  const PNR = generatePNR();

  // Validate and update schedule
  const schedules = await getCollection("trainSchedules") as any[];
  const schedule = schedules.find(s => s.trainId === trainId && s.date === travelDate);
  
  if (!schedule || schedule.seatsAvailable <= 0) {
    throw new Error("No seats available for this date");
  }

  const bookingDoc = await addDocument("bookings", {
    userId,
    trainId,
    trainNumber,
    trainName,
    passengerName,
    age,
    gender,
    coach,
    seatNumber,
    travelDate,
    PNR,
    bookingStatus: "confirmed",
    seats: seats || [],
    totalAmount: amount,
    fare: trainDetails?.fare || 0,
    source: trainDetails?.source || "N/A",
    destination: trainDetails?.destination || "N/A",
    departureTime: trainDetails?.departureTime || "N/A",
    arrivalTime: trainDetails?.arrivalTime || "N/A",
    createdAt: new Date().toISOString(),
  });

  await addDocument("payments", {
    bookingId: bookingDoc.id,
    userId,
    amount,
    paymentMethod: "card",
    paymentStatus: "success",
    transactionId: `TXN${Date.now()}`,
    paymentDate: new Date().toISOString(),
  });

  // Update seats in schedule based on number of selected seats
  const seatsToDeduct = seats && seats.length > 0 ? seats.length : 1;
  await updateDocument("trainSchedules", schedule.id, {
    seatsAvailable: schedule.seatsAvailable - seatsToDeduct,
  });

  // Also update the train's seatsAvailable for backward compatibility
  await incrementField("trains", trainId, "seatsAvailable", -seatsToDeduct);

  return { bookingId: bookingDoc.id, PNR, coach, seatNumber, seats };
};

export const getUserBookings = (userId: string) =>
  queryCollection("bookings", "userId", "==", userId) as Promise<Booking[]>;

export const getAllBookings = () => getCollection("bookings") as Promise<Booking[]>;

export const cancelBooking = async (bookingId: string, trainId: string) => {
  await updateDocument("bookings", bookingId, { bookingStatus: "cancelled" });
  await incrementField("trains", trainId, "seatsAvailable", 1);
};

export const getBookingByPNR = async (pnr: string) => {
  const results = await queryCollection("bookings", "PNR", "==", pnr);
  return results.length > 0 ? (results[0] as Booking) : null;
};
