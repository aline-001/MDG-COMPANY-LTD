import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './app/page';
import ServicesPage from './app/services/page';
import ContactPage from './app/contact/page';
import HowItWorksPage from './app/how-it-works/page';
import TrackOrderPage from './app/track-order/page';
import LoginPage from './app/auth/login/page';
import RegisterPage from './app/auth/register/page';
import HelpPage from './app/help/page';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
export default App;