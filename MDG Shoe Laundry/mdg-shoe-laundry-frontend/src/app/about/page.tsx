'use client';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Target, Users } from 'lucide-react';

const values = [
  {
    title: 'Craftsmanship',
    desc: 'Every pair is treated with precision, care, and respect for detail.',
    icon: <Target size={20} />,
  },
  {
    title: 'Honesty',
    desc: 'We keep our communication clear, our pricing straightforward, and our promises real.',
    icon: <ShieldCheck size={20} />,
  },
  {
    title: 'Sustainability',
    desc: 'We believe in care that lasts and choices that protect the future.',
    icon: <Leaf size={20} />,
  },
  {
    title: 'Community',
    desc: 'We are rooted in campus life and committed to creating opportunity for young people.',
    icon: <Users size={20} />,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-0 md:pt-0">
      <section className="bg-gradient-to-br from-mdg-navy via-slate-900 to-mdg-navy px-6 py-20 text-center text-white lg:px-8 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <h1 className="mt-8 text-5xl font-black leading-[0.95] md:mt-10 md:text-7xl">
            About <span className="text-cyan-300">MDG</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
            MDG began with one dirty pair of sneakers and grew into a brand built on purpose, precision, and pride.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="rounded-[32px] border border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-slate-50 p-8 shadow-sm sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-600">Our story</p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
              Built from a simple observation and a strong belief.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              We saw students and everyday people carrying shoes and bags that mattered deeply to them, yet receiving care that felt rushed and forgettable. MDG was created to change that experience.
            </p>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              We wanted to build a service that felt personal, professional, and trustworthy. A place where every shoe and every customer was treated with dignity and attention.
            </p>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-600">Founder note</p>
            <p className="mt-5 text-xl leading-9 text-slate-900">
              “It started with a pair of dirty shoes, but it became a vision for something greater.”
            </p>
            <p className="mt-6 text-base leading-7 text-slate-600">
              I am Albert Afiti, a student building MDG while balancing lectures, deadlines, and the reality of life on scholarship. What I learned is simple: you do not need perfect conditions to start something meaningful.
            </p>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Albert Afiti, Founder</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
        <div className="mb-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />
          <h3 className="text-2xl font-black uppercase tracking-[0.25em] text-slate-900">Our Values</h3>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {values.map((value) => (
            <div key={value.title} className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                {value.icon}
              </div>
              <h4 className="mt-5 text-lg font-bold text-slate-900">{value.title}</h4>
              <p className="mt-2 text-sm leading-7 text-slate-600">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="rounded-[36px] bg-gradient-to-r from-mdg-navy to-slate-900 p-8 text-white shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">Why we exist</p>
              <h3 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
                We do more than clean shoes. We help people protect what matters.
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-[20px] bg-cyan-500 px-10 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400"
              >
                Contact MDG
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}