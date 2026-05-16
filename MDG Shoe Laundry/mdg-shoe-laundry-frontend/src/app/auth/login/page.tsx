import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../lib/api'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Connects to your NestJS User model via the auth endpoint
      const response = await api.post('/auth/login', { email, password });
      
      // Store the JWT token for session management
      localStorage.setItem('token', response.data.access_token);
      
      // Redirect to the main dashboard or home after successful "collabo"
      navigate('/');
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-mdg-navy min-h-screen flex items-center justify-center px-6">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-mdg-navy tracking-tighter">WELCOME BACK.</h2>
          <p className="text-mdg-slate text-sm font-bold uppercase tracking-widest mt-2">Secure Access to MDG Systems</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-mdg-navy uppercase tracking-widest ml-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-mdg-background border-2 border-gray-100 p-5 rounded-2xl outline-none focus:border-mdg-blue transition-all font-bold" 
              placeholder="name@campus.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-mdg-navy uppercase tracking-widest ml-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-mdg-background border-2 border-gray-100 p-5 rounded-2xl outline-none focus:border-mdg-blue transition-all font-bold" 
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-mdg-navy text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-mdg-blue transition-all shadow-lg shadow-mdg-blue/20"
          >
            {loading ? 'Authenticating...' : 'Login to System'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;