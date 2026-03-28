import {BrowserRouter,Routes,Route} from 'react-router-dom'
 import Login from '../pages/auth/Login.tsx';
import Register from '../pages/auth/Register.tsx';
import Home from '../pages/events/Home.tsx';
import EventDetails from '../pages/events/EventDetails.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import Layout from '../components/layout/Layout.tsx';
import SeatSelection from "../pages/booking/SeatSelection";
export default function AppRoutes() {
    const { user } = useAuth();
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/events/:id" element={<Layout><EventDetails /></Layout>} />
                <Route path="/booking/:eventId" element={<Layout><SeatSelection /></Layout>}/>
            </Routes>
        </BrowserRouter>
    );
}

