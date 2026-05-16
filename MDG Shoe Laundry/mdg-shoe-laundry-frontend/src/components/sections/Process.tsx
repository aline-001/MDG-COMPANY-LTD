export const ProcessSection = () => {
  const steps = [
    { num: "01", name: "Create Order", desc: "Select shoe or bag service online." },
    { num: "02", name: "Free Pickup", desc: "We meet you at your campus spot." },
    { num: "03", name: "Expert Care", desc: "Specialized cleaning in our facility." },
    { num: "04", name: "Fresh Delivery", desc: "Receive your items in 2-3 days." }
  ];

  return (
    <section className="py-32 bg-mdg-navy relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <h2 className="text-white text-4xl font-black text-center mb-20">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="relative">
              <span className="text-8xl font-black text-white/5 absolute -top-10 left-0 leading-none">
                {step.num}
              </span>
              <h3 className="text-mdg-lime text-xl font-bold mb-3 relative z-10">{step.name}</h3>
              <p className="text-gray-400 relative z-10">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};