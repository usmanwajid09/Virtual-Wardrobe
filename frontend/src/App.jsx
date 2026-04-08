import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './components/DashboardLayout';
import Wardrobe from './pages/Wardrobe';
import Outfits from './pages/Outfits';
import Events from './pages/Events';
import AIStylist from './pages/AIStylist';
import Vision from './pages/Vision';
import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <Router>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/vision" element={<Vision />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Wardrobe />} />
          <Route path="wardrobe" element={<Wardrobe />} />
          <Route path="outfits" element={<Outfits />} />
          <Route path="events" element={<Events />} />
          <Route path="stylist" element={<AIStylist />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
