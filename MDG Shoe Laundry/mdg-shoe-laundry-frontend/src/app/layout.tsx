import "../globals.css";
import Navbar from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="antialiased">
      <Navbar />
      <div className="min-h-screen">
        {children}
      </div>
      <Footer />
    </div>
  );
}

