import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home/home';
import Explore from './pages/explore/explore';
import BusinessForm from './pages/form/form'; 
import BusinessDetail from './pages/biztemplate/biztemplate';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/addbusiness" element={<BusinessForm />} />
        <Route path="/businesses/:id" element={<BusinessDetail />} /> {/* Ensure this route is correct */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
