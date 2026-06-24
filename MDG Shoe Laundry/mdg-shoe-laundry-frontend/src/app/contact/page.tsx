'use client';
import { useState } from 'react';
import { MapPin, Phone, Mail, MessageSquare, Send, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

const contactInfo = [
  {
    title: "Visit Our Facility",
    value: "Bumbogo, Gasabo, Kigali, Rwanda",
    icon: <MapPin className="text-mdg-blue" size={24} />,
    link: "https://maps.google.com"
  },
  {
    title: "Call Us Directly",
    value: "+250 795 015 780",
    icon: <Phone className="text-mdg-blue" size={24} />,
    link: "tel:+250795015780"
  },
  {
    title: "WhatsApp Care",
    value: "+233 24 097 1028",
    icon: <MessageSquare className="text-mdg-blue" size={24} />,
    link: "https://wa.me/233240971028"
  },
  {
    title: "Email Support",
    value: "albertmendolza295@gmail.com",
    icon: <Mail className="text-mdg-blue" size={24} />,
    link: "mailto:albertmendolza295@gmail.com"
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await api.post('/contact', formData);
      setFeedback({
        type: 'success',
        message: response.data?.message || 'Your message has been sent successfully.',
      });
      setFormData({ fullName: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (error: any) {
      setFeedback({
        type: 'error',
        message: error.response?.data?.message || 'Unable to send your message right now. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pt-0 md:pt-0">
      {/* Hero Header */}
      <section className="bg-mdg-navy py-20 px-6 text-center">
        <h1 className="mt-8 text-4xl md:mt-10 md:text-6xl font-black text-white mb-4">Get In Touch</h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Have questions about your shoes or bags? Our team in Bumbogo is ready to assist you.
        </p>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* 1. Contact Cards */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((info) => (
              <a 
                href={info.link} 
                key={info.title}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 rounded-3xl border border-gray-100 bg-mdg-background hover:border-mdg-blue transition-all group"
              >
                <div className="mb-4">{info.icon}</div>
                <h3 className="font-bold text-mdg-navy mb-1">{info.title}</h3>
                <p className="text-mdg-slate text-sm break-words">{info.value}</p>
              </a>
            ))}

            <div className="p-6 rounded-3xl bg-mdg-navy text-white">
              <div className="flex items-center gap-3 mb-4 text-mdg-lime">
                <Clock size={20} />
                <span className="font-bold uppercase tracking-widest text-xs">Service Hours</span>
              </div>
              <div className="space-y-2 text-sm opacity-80">
                <p className="flex justify-between"><span>Online Orders:</span> <span>24/7</span></p>
                <p className="flex justify-between"><span>Pickups:</span> <span>7 AM - 6 PM</span></p>
                <p className="flex justify-between"><span>Daily:</span> <span>Mon - Sun</span></p>
              </div>
            </div>
          </div>

          {/* 2. Professional Contact Form */}
          <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-sm">
            <h2 className="text-3xl font-black text-mdg-navy mb-8">Send a Message</h2>
            <form className="grid md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-mdg-navy">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(event) => setFormData({ ...formData, fullName: event.target.value })}
                  className="w-full px-6 py-4 rounded-2xl bg-mdg-background border-none focus:ring-2 focus:ring-mdg-blue transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-mdg-navy">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  className="w-full px-6 py-4 rounded-2xl bg-mdg-background border-none focus:ring-2 focus:ring-mdg-blue transition-all"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-mdg-navy">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(event) => setFormData({ ...formData, subject: event.target.value })}
                  className="w-full px-6 py-4 rounded-2xl bg-mdg-background border-none focus:ring-2 focus:ring-mdg-blue transition-all appearance-none"
                >
                  <option>General Inquiry</option>
                  <option>Shoe Laundry Question</option>
                  <option>Bag Laundry Inquiry</option>
                  <option>Partnership/Internship</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-mdg-navy">Message</label>
                <textarea 
                  rows={5} 
                  placeholder="How can we help your gear?"
                  value={formData.message}
                  onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                  className="w-full px-6 py-4 rounded-2xl bg-mdg-background border-none focus:ring-2 focus:ring-mdg-blue transition-all"
                />
              </div>
              {feedback && (
                <div className={`md:col-span-2 rounded-2xl px-4 py-3 text-sm font-medium ${feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {feedback.message}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="md:col-span-2 bg-mdg-navy text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-mdg-blue transition-all disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={20} />
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* 3. Call to Action */}
      <section className="py-20 bg-mdg-background text-center px-6">
        <h2 className="text-2xl font-black text-mdg-navy mb-4">Ready to get started?</h2>
        {/* FIX: Changed href to to */}
        <Link 
          to="/auth/register" 
          className="inline-block bg-mdg-blue text-white px-12 py-4 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-mdg-blue/20"
        >
          Order Now
        </Link>
      </section>
    </div>
  );
}