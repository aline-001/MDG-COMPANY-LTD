const services = [
  {
    title: "Shoe Laundry",
    items: ["Regular Cleaning", "Medium Cleaning", "Extreme Cleaning", "Unyellowing"],
    price: "800 - 1000 RWF",
    icon: ""
  },
  {
    title: "Bag Laundry",
    items: ["Leather Bags", "Canvas Bags", "Lace Bags", "Backpacks"],
    price: "Starting 1000 RWF",
    icon: "",
    promo: "25% Cash Back"
  }
];

export const ServiceCategories = () => {
  return (
    <section className="py-20 bg-mdg-gray">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-black text-mdg-navy text-center mb-12">Expert Cleaning, Fresh Results</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((s) => (
            <div key={s.title} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow relative overflow-hidden">
              {s.promo && (
                <div className="absolute top-0 right-0 bg-mdg-lime text-mdg-navy px-4 py-1 font-bold text-xs">
                  {s.promo}
                </div>
              )}
              <div className="text-4xl mb-4">{s.icon}</div>
              <h3 className="text-2xl font-bold text-mdg-navy mb-2">{s.title}</h3>
              <p className="text-mdg-blue font-bold mb-4">{s.price}</p>
              <ul className="space-y-2 mb-6 text-gray-600">
                {s.items.map(item => <li key={item}>• {item}</li>)}
              </ul>
              <button className="w-full py-3 rounded-xl bg-mdg-navy text-white font-bold hover:bg-mdg-blue transition-colors">
                Select {s.title}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};