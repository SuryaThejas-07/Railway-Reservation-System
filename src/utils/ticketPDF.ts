import jsPDF from "jspdf";

interface TicketData {
  PNR: string;
  trainName: string;
  trainNumber: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  travelDate: string;
  passengerName: string;
  coach: string;
  seatNumber: string;
  fare: number;
  totalPrice: number;
  bookingStatus: string;
}

export const generateTicketPDF = (ticketData: TicketData): boolean => {
  try {
    // Validate required fields
    if (!ticketData.PNR) {
      console.error("Missing PNR in ticket data");
      throw new Error("PNR is required to generate ticket");
    }

    // Create a new PDF document
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 15;

    // Set default font to avoid encoding issues
    pdf.setFont("helvetica");

    // Header - Title
    pdf.setFontSize(28);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 102, 204);
    pdf.text("RAILBOOK", pageWidth / 2, yPosition, { align: "center" });

    yPosition += 8;
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont("helvetica", "normal");
    pdf.text("Official Train Ticket", pageWidth / 2, yPosition, { align: "center" });

    // Divider line
    yPosition += 8;
    pdf.setDrawColor(0, 102, 204);
    pdf.line(15, yPosition, pageWidth - 15, yPosition);

    // PNR Box
    yPosition += 12;
    pdf.setDrawColor(0, 102, 204);
    pdf.setFillColor(220, 240, 255);
    pdf.rect(15, yPosition - 8, pageWidth - 30, 16, "F");
    pdf.setDrawColor(0, 102, 204);
    pdf.rect(15, yPosition - 8, pageWidth - 30, 16);
    
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100, 100, 100);
    pdf.text("PNR Number", 20, yPosition - 3);
    
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 102, 204);
    pdf.text(ticketData.PNR, pageWidth / 2, yPosition + 4, { align: "center" });

    // Journey Details Section
    yPosition += 22;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("JOURNEY DETAILS", 15, yPosition);

    yPosition += 8;
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(50, 50, 50);

    const journeyDetails = [
      { label: "Train Name:", value: ticketData.trainName || "N/A" },
      { label: "Train Number:", value: ticketData.trainNumber || "N/A" },
      { label: "From:", value: ticketData.source || "N/A" },
      { label: "To:", value: ticketData.destination || "N/A" },
      { label: "Travel Date:", value: new Date(ticketData.travelDate).toLocaleDateString("en-IN") || "N/A" },
      { label: "Departure Time:", value: ticketData.departureTime || "N/A" },
      { label: "Arrival Time:", value: ticketData.arrivalTime || "N/A" },
    ];

    journeyDetails.forEach((detail) => {
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      pdf.text(detail.label, 20, yPosition);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(detail.value, 80, yPosition);
      yPosition += 6;
    });

    // Passenger Details Section
    yPosition += 5;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("PASSENGER DETAILS", 15, yPosition);

    yPosition += 8;
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(50, 50, 50);

    const passengerDetails = [
      { label: "Name:", value: ticketData.passengerName || "N/A" },
      { label: "Coach:", value: ticketData.coach || "N/A" },
      { label: "Seat Number:", value: ticketData.seatNumber || "N/A" },
      { label: "Status:", value: ticketData.bookingStatus || "N/A" },
    ];

    passengerDetails.forEach((detail) => {
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      pdf.text(detail.label, 20, yPosition);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(String(detail.value), 80, yPosition);
      yPosition += 6;
    });

    // Fare Details Section
    yPosition += 8;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(15, yPosition, pageWidth - 15, yPosition);

    yPosition += 8;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("FARE BREAKDOWN", 15, yPosition);

    yPosition += 8;
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(50, 50, 50);

    pdf.text("Base Fare:", 20, yPosition);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("Rs. " + (ticketData.fare || 0).toString(), 80, yPosition);

    yPosition += 6;
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(50, 50, 50);
    pdf.text("Tax (5%):", 20, yPosition);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("Rs. " + Math.round((ticketData.fare || 0) * 0.05).toString(), 80, yPosition);

    // Total line
    yPosition += 8;
    pdf.setDrawColor(0, 102, 204);
    pdf.line(15, yPosition, pageWidth - 15, yPosition);

    yPosition += 6;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 102, 204);
    pdf.text("TOTAL AMOUNT:", 20, yPosition);
    pdf.setFontSize(14);
    pdf.text("Rs. " + (ticketData.totalPrice || 0).toString(), pageWidth - 30, yPosition, { align: "right" });

    // Footer
    yPosition = pageHeight - 20;
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(150, 150, 150);
    pdf.text("This is a computer-generated ticket. No signature required.", pageWidth / 2, yPosition, {
      align: "center",
    });

    yPosition += 5;
    pdf.text("Generated on " + new Date().toLocaleString("en-IN"), pageWidth / 2, yPosition, {
      align: "center",
    });

    yPosition += 5;
    pdf.text("Keep this ticket safe. You will need it for check-in at the station.", pageWidth / 2, yPosition, {
      align: "center",
    });

    // Save the PDF
    const fileName = `Ticket_${ticketData.PNR}.pdf`;
    console.log("Generating PDF:", fileName);
    pdf.save(fileName);
    console.log("PDF saved successfully:", fileName);
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return false;
  }
};

// Share ticket on WhatsApp
export const shareTicketWhatsApp = (ticketData: TicketData): string => {
  return `🚆 My RailBook Ticket\n\nPNR: ${ticketData.PNR}\nTrain: ${ticketData.trainName} (${ticketData.trainNumber})\nFrom: ${ticketData.source} → To: ${ticketData.destination}\nDate: ${new Date(ticketData.travelDate).toLocaleDateString()}\nTime: ${ticketData.departureTime}\nSeat: ${ticketData.seatNumber} (${ticketData.coach})\nFare: ₹${ticketData.totalPrice}\n\nBook your tickets at RailBook! 🎫`;
};

// Share ticket via Email
export const shareTicketEmail = (ticketData: TicketData) => {
  const subject = `Your RailBook E-Ticket - ${ticketData.trainName}`;
  const body = `Dear ${ticketData.passengerName},\n\nYour e-ticket is ready!\n\nPNR: ${ticketData.PNR}\nTrain: ${ticketData.trainName} (${ticketData.trainNumber})\nRoute: ${ticketData.source} → ${ticketData.destination}\nDate: ${new Date(ticketData.travelDate).toLocaleDateString()}\nTime: ${ticketData.departureTime}\nSeat: ${ticketData.seatNumber} (${ticketData.coach})\nTotal Fare: ₹${ticketData.totalPrice}\n\nSafe travels!\nRailBook Team`;

  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
