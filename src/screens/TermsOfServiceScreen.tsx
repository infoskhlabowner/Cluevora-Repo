import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TermsOfServiceScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 pt-12 pb-24">
      <header className="mb-8 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-[#434832] opacity-60 hover:opacity-100 transition-opacity">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-serif text-[#2D331F] italic">Terms of Service</h1>
      </header>
      <div className="prose prose-sm max-w-none text-[#434832]">
        <p><strong>Last Updated: September 11, 2026</strong></p>
        <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Cluevora mobile application (the "Service").</p>
        
        <h3 className="text-lg font-bold mt-6 mb-2">1. Acceptance of Terms</h3>
        <p>By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</p>

        <h3 className="text-lg font-bold mt-6 mb-2">2. Accounts</h3>
        <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
        <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</p>

        <h3 className="text-lg font-bold mt-6 mb-2">3. Intellectual Property</h3>
        <p>The Service and its original content, features and functionality are and will remain the exclusive property of Cluevora and its licensors. The Service is protected by copyright, trademark, and other laws.</p>

        <h3 className="text-lg font-bold mt-6 mb-2">4. Virtual Currency and Purchases</h3>
        <p>The Service may include virtual currency ("Coins") or Premium access. These virtual items have no real-world value and cannot be redeemed for actual currency, goods, or other items of monetary value from us or any other party. All purchases of virtual currency and premium access are final and non-refundable.</p>

        <h3 className="text-lg font-bold mt-6 mb-2">5. Termination</h3>
        <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
        <p>All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.</p>

        <h3 className="text-lg font-bold mt-6 mb-2">6. Changes</h3>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.</p>

        <h3 className="text-lg font-bold mt-6 mb-2">7. Contact Us</h3>
        <p>If you have any questions about these Terms, please contact us at: support@cluevora.com</p>
      </div>
    </div>
  );
}
