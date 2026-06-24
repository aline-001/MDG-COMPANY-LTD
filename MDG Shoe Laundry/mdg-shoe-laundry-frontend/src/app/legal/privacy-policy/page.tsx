'use client';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
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
          <h1 className="text-4xl font-black text-mdg-navy mb-2">Privacy Policy</h1>
          <p className="text-mdg-slate font-medium mb-8">Last Updated: June 2026</p>

          <div className="prose prose-lg max-w-none text-mdg-slate leading-relaxed space-y-6">
            <section>
              <h2 className="text-2xl font-black text-mdg-navy mt-8 mb-4">1. Introduction</h2>
              <p>MDG Shoe Laundry ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-mdg-navy mt-8 mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-bold text-mdg-navy mt-6 mb-3">2.1 Information You Provide Directly</h3>
              <p><strong>Account Registration:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Full name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Residential/business address</li>
                <li>Payment information</li>
              </ul>

              <p className="mt-4"><strong>Order Information:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Item descriptions</li>
                <li>Special instructions</li>
                <li>Service selections</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-mdg-navy mt-8 mb-4">3. Information Collected Automatically</h2>
              <p><strong>Website Usage Data:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent</li>
                <li>Device identifiers</li>
              </ul>

              <p className="mt-4"><strong>Cookies and Similar Technologies:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Session cookies for authentication</li>
                <li>Preference cookies for user experience</li>
                <li>Analytics cookies for service improvement</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-mdg-navy mt-8 mb-4">4. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Delivery:</strong> Creating accounts, processing orders, scheduling pickups</li>
                <li><strong>Communication:</strong> Sending confirmations, notifications, and support responses</li>
                <li><strong>Marketing:</strong> Promotional emails and service recommendations (with consent)</li>
                <li><strong>Analytics:</strong> Improving website functionality and user experience</li>
                <li><strong>Security:</strong> Preventing fraud and protecting rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-mdg-navy mt-8 mb-4">5. How We Share Your Information</h2>
              <p>We share information with trusted third-party service providers:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Payment Processors:</strong> Credit card processors and payment gateways</li>
                <li><strong>Communication Services:</strong> Email and SMS providers</li>
                <li><strong>Delivery Partners:</strong> Logistics and courier services</li>
                <li><strong>Analytics Providers:</strong> Web analytics services</li>
              </ul>
              <p className="mt-4"><strong>We DO NOT sell your personal information to third parties for marketing purposes.</strong></p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-mdg-navy mt-8 mb-4">6. Data Security</h2>
              <p>We implement comprehensive security measures:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>SSL/TLS encryption for data in transit</li>
                <li>Bcrypt hashing for stored passwords</li>
                <li>Role-based access controls</li>
                <li>Regular security audits</li>
                <li>Secure database infrastructure</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-mdg-navy mt-8 mb-4">7. Your Rights and Choices</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Request corrections to inaccurate data</li>
                <li>Request deletion of your account and data</li>
                <li>Download your information</li>
                <li>Opt out of marketing communications</li>
                <li>Disable cookies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-mdg-navy mt-8 mb-4">8. Data Retention</h2>
              <p>We retain personal information as follows:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account Information: Until deletion or 3 years of inactivity</li>
                <li>Order Information: 7 years (legal/tax requirements)</li>
                <li>Payment Records: 7 years (financial compliance)</li>
                <li>Communication Records: 2 years</li>
                <li>Analytics Data: 90 days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-mdg-navy mt-8 mb-4">9. Children's Privacy</h2>
              <p>MDG Shoe Laundry does not knowingly collect information from children under 13 years old. If we become aware that we have collected information from a child under 13, we will delete such information immediately.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-mdg-navy mt-8 mb-4">10. Third-Party Links</h2>
              <p>Our website may contain links to third-party websites. We are not responsible for their privacy practices or content. Please review their privacy policies before providing information.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-mdg-navy mt-8 mb-4">11. Changes to This Policy</h2>
              <p>We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will notify you of material changes via email and update the "Last Updated" date.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-mdg-navy mt-8 mb-4">12. Contact Information</h2>
              <p>For privacy-related questions or to exercise your rights:</p>
              <div className="bg-mdg-background p-6 rounded-2xl mt-4">
                <p className="font-bold">MDG Shoe Laundry - Privacy Team</p>
                <p>Email: privacy@mdgshoelaundry.com</p>
                <p>Support Email: support@mdgshoelaundry.com</p>
                <p>Phone: +250 (0) 123 456 789</p>
                <p>Address: Bumbogo Facility, Gasabo, Kigali, Rwanda</p>
              </div>
            </section>

            <section className="bg-mdg-blue/10 p-6 rounded-2xl mt-8">
              <p className="text-center text-mdg-navy font-bold">
                By using MDG Shoe Laundry services, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
