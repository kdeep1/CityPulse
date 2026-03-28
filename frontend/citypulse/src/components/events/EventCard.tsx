import {motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
export default function Eventcard({event}:{event:any}) {
    const navigate = useNavigate();
    return (
       <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl cursor-pointer"
      onClick={() => navigate(`/events/${event.id}`)}
    >
        <h2 className="text-xl font-semibold text-white">
        {event.title}
      </h2>

      <p className="text-gray-400 mt-2">{event.city}</p>

      <p className="text-purple-400 mt-3 text-sm">
        View Details →
      </p>
    </motion.div>
  );
}