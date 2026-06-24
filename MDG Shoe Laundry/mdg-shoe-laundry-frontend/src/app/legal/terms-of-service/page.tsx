'use client';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-mdg-navy min-h-screen pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-mdg-lime font-bold text-sm mb-8 hover:gap-3 transition-all"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>

        <div className="bg-white rounded-[40px] p-12 shadow-2xl">
          <h1 className="text-4xl font-black text-mdg-navy mb-2">Terms of Service</h1>
          <p className="text-mdg-slate font-medium mb-8">Last Updated: June 2026</p>

          <div className="prose prose-lg max-w-none text-mdg-slate leading-relaxed space-y-6">
            <section>
              <h2 className="text-2xl font-black text-mdg-navy mt-8 mb-4">1. Agreement to Terms</h2>
              <p>By accessing and using the MDG Shoe Laundry website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-mdg-navy mt-8 mb-4">2. Use License</h2>
              <p>Permission is granted to temporarily download one copy of the materials (information or software) on the MDG Shoe Laundry website for personal, non-commercial transitory viewing only. You may not:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software</li>
                <li>Remove any copyright or other proprietary notations</li>
                <li>Transfer the materials to another person or mirror them on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-mdg-navy mt-8 mb-4">3. Service Description</h2>
              <p>MDG Shoe Laundry provides professional shoe and bag cleaning services including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Shoe laundry and restoration</li>
                <li>Bag cleaning and restoration</li>
                <li>Premium care services</li>
                <li>Unyellowing treatments</li>
                <li>Other specialized cleaning services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-mdg-navy mt-8 mb-4">4. Payment Terms</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payment is due upon order confirmation or before pickup</li>
                <li>We accept multiple payment methods</li>
                <li>All prices are in the currency specified at time of order</li>
                <li>Refunds are issued within 5-7 business days for cancelled orders</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-mdg-navy mt-8 mb-4">5. Cancellation Policy</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Orders may be cancelled up to 48 hours before scheduled pickup</li>
                <li>Cancellations are subject to a 10% administrative fee</li>
                <li>No refunds for services already completed</li>
                <li>Emergency cancellations may result in additional fees</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-mdg-navy mt-8 mb-4">6. Liability Limitations</h2>
              <p>MDG Shoe Laundry will exercise reasonable care with all items. We are not responsible for damage caused by:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Pre-existing wear or damage</li>
                <li>Manufacturing defects</li>
                <li>Improper original construction</li>
                <li>Inherent material vulnerabilities</li>
              </ul>
              <p className="mt-4"><strong>Maximum Liability:</strong> Our liability is limited to the service fee paid for the order.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-mdg-navy mt-8 mb-4">7. Pickup and Delivery</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Items must be picked up within 14 days of completion</li>
                <li>Storage fees apply after this period ($5 per day)</li>
                <li>Risk of loss or damage transfers to customer upon pickup</li>
                <li>Delivery services may be available at additional cost</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-mdg-navy mt-8 mb-4">8. User Accounts</h2>
              <p>When creating an account with MDG Shoe Laundry:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are responsible for maintaining password confidentiality</li>
                <li>You accept responsibility for all activities under your account</li>
                <li>You agree to provide accurate and current information</li>
                <li>You must notify us immediately of unauthorized account use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-mdg-navy mt-8 mb-4">9. Prohibited Activities</h2>
              <p>Users agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon intellectual property rights</li>
                <li>Harass, abuse, or threaten any person</li>
                <li>Upload viruses or malicious code</li>
                <li>Spam or send unsolicited messages</li>
                <li>Attempt unauthorized system access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-mdg-navy mt-8 mb-4">10. Governing Law</h2>
              <p>These terms and conditions are governed by and construed in accordance with the laws of Rwanda, and you irrevocably submit to the exclusive jurisdiction of the courts located in Rwanda.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-mdg-navy mt-8 mb-4">11. Contact Information</h2>
              <p>For questions about these Terms of Service, please contact:</p>
              <div className="bg-mdg-background p-6 rounded-2xl mt-4">
                <p className="font-bold">MDG Shoe Laundry</p>
                <p>Email: support@mdgshoelaundry.com</p>
                <p>Phone: +250 (0) 123 456 789</p>
                <p>Address: Bumbogo Facility, Gasabo, Kigali, Rwanda</p>
              </div>
            </section>

            <section className="bg-mdg-blue/10 p-6 rounded-2xl mt-8">
              <p className="text-center text-mdg-navy font-bold">
                By using MDG Shoe Laundry services, you acknowledge that you have read, understood, and agree to be bound by all terms and conditions outlined above.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
