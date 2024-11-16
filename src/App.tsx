import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home/home.tsx'
import Explore from './pages/explore/explore.tsx'
import BusinessForm from './pages/form/form.tsx'

const AppRoutes = () => {
  return (
      <BrowserRouter>
          <Routes>
            <Route path="*" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/addbusiness" element={<BusinessForm />} />
          </Routes>
      </BrowserRouter>
  );
};

export default AppRoutes;
