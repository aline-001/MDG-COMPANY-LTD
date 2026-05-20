import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(
        error.response?.data?.message ||
        'Invalid credentials. Please try again.'
      );
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

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-700 text-sm font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-mdg-navy uppercase tracking-widest ml-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-mdg-background border-2 border-gray-100 p-5 rounded-2xl outline-none focus:border-mdg-blue transition-all font-bold" 
              placeholder="name@example.com"
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-mdg-navy text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-mdg-blue transition-all shadow-lg shadow-mdg-blue/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Login to System'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-mdg-slate">
            Don't have an account? <Link to="/auth/register" className="text-mdg-blue font-bold hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;