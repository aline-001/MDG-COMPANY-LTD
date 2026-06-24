'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { getStoredGalleryItems, GalleryItem } from '../../lib/gallery';

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    setGalleryItems(getStoredGalleryItems());
  }, []);
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f7fbff_0%,#ffffff_100%)] text-slate-800">
      <section className="px-6 pt-32 pb-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
                Signature transformations
              </p>
              <h1 className="text-4xl font-black tracking-[-0.02em] text-slate-900 sm:text-5xl lg:text-6xl">
                A refined gallery of restored footwear.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Discover how careful cleaning, finishing, and detailing restore shoes with a more polished and lasting appearance.
              </p>
            </div>

            <Link
              to="/dashboard/new-order"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition duration-300 hover:bg-blue-900"
            >
              Book a pickup
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {galleryItems.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.35 }}
                className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)]"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-600">{item.category}</p>
                  <h2 className="mt-3 text-xl font-semibold text-slate-900">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-[32px] border border-slate-200 bg-slate-900 p-8 text-white shadow-[0_30px_80px_-25px_rgba(15,23,42,0.45)] md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
                Professional care
              </p>
              <h2 className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
                A polished finish for every pair.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                Our restoration process combines careful cleaning, surface finishing, and detail work to bring footwear back to a refined, presentable condition.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <ShieldCheck size={22} className="mt-1 text-blue-400" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200">Why clients choose us</p>
                  <ul className="mt-3 space-y-3 text-sm leading-7 text-slate-300">
                    <li>Material-specific care for leather, canvas, and mesh.</li>
                    <li>Reliable turnaround with clear order tracking.</li>
                    <li>Consistent finishing designed for a premium look.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
