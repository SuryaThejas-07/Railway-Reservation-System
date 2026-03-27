import {
  getCollection,
  addDocument,
  updateDocument,
  deleteDocument,
  queryCollection,
} from "@/firebase/firestore";

export interface Train {
  id: string;
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  fare: number;
  totalSeats: number;
  seatsAvailable: number;
}

export interface TrainSchedule {
  id: string;
  trainId: string;
  trainNumber: string;
  date: string; // ISO format: YYYY-MM-DD
  seatsAvailable: number;
  totalSeats: number;
  isActive: boolean;
}

/**
 * Generate 30-day schedules starting from today
 */
export const generateSchedulesFor30Days = (
  trainId: string,
  trainNumber: string,
  totalSeats: number,
  startDate?: Date
): Omit<TrainSchedule, "id">[] => {
  const schedules = [];
  const start = startDate ? new Date(startDate) : new Date();
  
  for (let i = 0; i < 30; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(currentDate.getDate() + i);
    
    const dateStr = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD format

    schedules.push({
      trainId,
      trainNumber,
      date: dateStr,
      seatsAvailable: totalSeats,
      totalSeats,
      isActive: true,
    });
  }

  return schedules;
};

export const getAllTrains = () => getCollection("trains") as Promise<Train[]>;

export const searchTrains = async (source: string, destination: string, date?: string) => {
  const trains = await queryCollection("trains", "source", "==", source).then((trains) =>
    trains.filter((t: any) => t.destination === destination)
  ) as Promise<Train[]>;

  if (!date) return trains;

  // Check if schedule exists for this date
  const schedules = await getSchedulesForDate(date);
  const scheduledTrainIds = new Set(schedules.map(s => s.trainId));
  
  return trains.filter(t => scheduledTrainIds.has(t.id));
};

export const getSchedulesForDate = async (date: string): Promise<TrainSchedule[]> => {
  try {
    const schedules = await getCollection("trainSchedules") as TrainSchedule[];
    if (!schedules) return [];
    return schedules.filter(s => s.date === date && s.isActive);
  } catch (error) {
    console.warn("trainSchedules collection may not exist yet:", error);
    return [];
  }
};

export const getTrainSchedule = async (trainId: string, date: string): Promise<TrainSchedule | null> => {
  try {
    const schedules = await getCollection("trainSchedules") as TrainSchedule[];
    if (!schedules) return null;
    return schedules.find(s => s.trainId === trainId && s.date === date) || null;
  } catch (error) {
    console.warn("trainSchedules collection may not exist yet:", error);
    return null;
  }
};

export const addTrain = async (data: Omit<Train, "id">) => {
  const trainDoc = await addDocument("trains", data as Record<string, unknown>);
  
  try {
    // Auto-generate schedules for next 30 days
    const schedules = generateSchedulesFor30Days(
      trainDoc.id,
      data.trainNumber,
      data.totalSeats
    );

    // Add all schedules to the database
    for (const schedule of schedules) {
      try {
        await addDocument("trainSchedules", schedule as Record<string, unknown>);
      } catch (error) {
        console.warn("Could not create schedule for date:", schedule.date, error);
      }
    }
  } catch (error) {
    console.warn("Could not auto-generate schedules:", error);
    // Don't throw - train was created successfully
  }

  return trainDoc;
};

export const updateTrain = (id: string, data: Partial<Train>) =>
  updateDocument("trains", id, data as Record<string, unknown>);

export const deleteTrain = (id: string) => deleteDocument("trains", id);

export const addTrainSchedule = (data: Omit<TrainSchedule, "id">) =>
  addDocument("trainSchedules", data as Record<string, unknown>);

export const updateTrainSchedule = (id: string, data: Partial<TrainSchedule>) =>
  updateDocument("trainSchedules", id, data as Record<string, unknown>);

export const deleteTrainSchedule = (id: string) =>
  deleteDocument("trainSchedules", id);

export const getTrainSchedules = async (trainId: string): Promise<TrainSchedule[]> => {
  try {
    const schedules = await getCollection("trainSchedules") as TrainSchedule[];
    if (!schedules) return [];
    return schedules.filter(s => s.trainId === trainId).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    console.warn("trainSchedules collection may not exist yet:", error);
    return [];
  }
};

/**
 * Manually generate and add 30-day schedules for an existing train
 */
export const regenerateSchedulesFor30Days = async (
  trainId: string,
  train: Train
): Promise<void> => {
  try {
    const schedules = generateSchedulesFor30Days(
      trainId,
      train.trainNumber,
      train.totalSeats,
      new Date()
    );

    for (const schedule of schedules) {
      try {
        await addDocument("trainSchedules", schedule as Record<string, unknown>);
      } catch (error) {
        console.warn("Could not create schedule for date:", schedule.date, error);
      }
    }
  } catch (error) {
    console.error("Failed to regenerate schedules:", error);
    throw error;
  }
};
