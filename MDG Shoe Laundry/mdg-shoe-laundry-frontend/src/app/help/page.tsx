import React from 'react';
import { Link } from 'react-router-dom';
import { LifeBuoy, MessageCircle, Sparkles } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="bg-white min-h-screen pt-24 px-6 pb-20">
      <div className="max-w-6xl mx-auto space-y-12">
        <section className="rounded-[40px] border border-gray-100 bg-mdg-background p-12 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <p className="text-mdg-blue uppercase tracking-[0.3em] text-sm font-black mb-4">Need support?</p>
              <h1 className="text-4xl md:text-5xl font-black text-mdg-navy leading-tight">
                Help is ready whenever you need it.
              </h1>
            </div>
            <div className="flex flex-col gap-3 text-sm text-mdg-slate">
              <p className="font-bold text-mdg-navy">Call: +250 795 015 780</p>
              <p className="font-bold text-mdg-navy">Email: albertmendolza295@gmail.com</p>
              <p className="text-sm">Available 7 days a week for order tracking, pricing, or general service questions.</p>
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Order Tracking',
              description: 'Quickly check your restoration status and next steps.',
              icon: <Sparkles size={28} className="text-mdg-blue" />,
              link: '/track-order',
              cta: 'Track Order'
            },
            {
              title: 'Contact Support',
              description: 'Reach us through chat, email, or phone for urgent help.',
              icon: <MessageCircle size={28} className="text-mdg-blue" />,
              link: '/contact',
              cta: 'Contact Us'
            },
            {
              title: 'How Our Process Works',
              description: 'Understand every step in our premium laundry workflow.',
              icon: <LifeBuoy size={28} className="text-mdg-blue" />,
              link: '/how-it-works',
              cta: 'View Process'
            }
          ].map((item) => (
            <div key={item.title} className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-sm">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-mdg-blue/10">
                {item.icon}
              </div>
              <h2 className="text-2xl font-black text-mdg-navy mb-3">{item.title}</h2>
              <p className="text-mdg-slate leading-relaxed mb-8">{item.description}</p>
              <Link
                to={item.link}
                className="inline-flex items-center gap-2 font-bold text-mdg-blue hover:text-mdg-navy"
              >
                {item.cta} →
              </Link>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
