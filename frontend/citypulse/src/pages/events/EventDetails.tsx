import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import { motion } from "framer-motion";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="text-white">
      
      {/* 🎨 HERO CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl"
      >
        <h1 className="text-4xl font-bold mb-4">
          {event.title}
        </h1>

        <p className="text-gray-300 mb-4">
          {event.description}
        </p>

        <div className="flex gap-6 text-sm text-gray-400 mb-6">
          <p>📍 {event.city}</p>
          <p>🗓 {new Date(event.startDateTime).toLocaleString()}</p>
        </div>

        <button
          onClick={() => navigate(`/booking/${event.id}`)}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl text-white font-semibold"
        >
          Book Seats 🎟
        </button>
      </motion.div>

    </div>
  );
}