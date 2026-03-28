import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import EventCard from "../../components/events/EventCard";

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await api.get("/events");
      setEvents(res.data);
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h1 className="text-3xl text-white mb-6">
        Discover Events 
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {events.map((event: any) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}