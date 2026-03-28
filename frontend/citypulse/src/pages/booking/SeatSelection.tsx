import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/axios";

export default function SeatSelection() {
  const { eventId } = useParams();

  const [seats, setSeats] = useState<any[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // 🔥 Fetch seats
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await api.get(`/events/${eventId}/seats`);
        setSeats(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSeats();
  }, [eventId]);

  // 🎯 Select seat
  const toggleSeat = (seatId: string, status: string) => {
    if (status !== "AVAILABLE") return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  // 🔐 Lock seats
  const handleLockSeats = async () => {
    try {
      await api.post(`/events/${eventId}/lock-seats`, {
        seatIds: selectedSeats,
      });

      alert("Seats locked successfully 🎉");

    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to lock seats");
    }
  };

  return (
    <div className="text-white">
      <h1 className="text-3xl mb-6">Select Seats 🎟</h1>

      {/* 🎯 Seat Grid */}
      
      <div className="grid grid-cols-10 gap-3">
        
        {
        seats.map((seat) => (
          <div
            key={seat.id}
            onClick={() => toggleSeat(seat.id, seat.status)}
            className={`p-3 text-center rounded cursor-pointer
              ${
                seat.status === "BOOKED"
                  ? "bg-red-600 cursor-not-allowed"
                  : seat.status === "LOCKED"
                  ? "bg-yellow-500 cursor-not-allowed"
                  : selectedSeats.includes(seat.id)
                  ? "bg-purple-600"
                  : "bg-green-600"
              }
            `}
          >
            {seat.seatType}  <br />
            {seat.id.slice(- 4)} 
          </div>
        ))}
      </div>

      {/* 🔘 Action Button */}
      <button
        onClick={handleLockSeats}
        className="mt-6 bg-purple-600 px-6 py-3 rounded-xl"
      >
        Lock Seats
      </button>
    </div>
  );
}