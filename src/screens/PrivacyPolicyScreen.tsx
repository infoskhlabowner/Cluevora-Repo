import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicyScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 pt-12 pb-24">
      <header className="mb-8 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-[#434832] opacity-60 hover:opacity-100 transition-opacity">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-serif text-[#2D331F] italic">Privacy Policy</h1>
      </header>
      <div className="prose prose-sm max-w-none text-[#434832]">
        <p><strong>Last Updated: September 11, 2026</strong></p>
        <p>Welcome to Cluevora. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our mobile application.</p>
        
        <h3 className="text-lg font-bold mt-6 mb-2">1. Information We Collect</h3>
        <p>We may collect information about you in a variety of ways. The information we may collect includes:</p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li><strong>Personal Data:</strong> Personally identifiable information, such as your email address, that you voluntarily give to us when you register with the application.</li>
          <li><strong>Game Data:</strong> Information about your progress, solved cases, coins, XP, and other related gameplay metrics.</li>
          <li><strong>Device Data:</strong> We may collect device information (such as your mobile device ID, model, and manufacturer) when you access the application.</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">2. How We Use Your Information</h3>
        <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:</p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Create and manage your account.</li>
          <li>Compile anonymous statistical data and analysis for use internally.</li>
          <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the application to you.</li>
          <li>Monitor and analyze usage and trends to improve your experience.</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">3. Account Deletion (Google Play Requirement)</h3>
        <p>You have the right to request the deletion of your account and associated personal data. You can delete your account directly within the app by navigating to <strong>Settings &gt; Delete Account</strong>. This action is permanent and will remove all your progress, purchased items, and personal data from our active databases.</p>

        <h3 className="text-lg font-bold mt-6 mb-2">4. Third-Party Services</h3>
        <p>We may share your information with third parties that perform services for us or on our behalf, including data analysis, email delivery, hosting services, customer service, and marketing assistance. We utilize Firebase (Google) for authentication and database services.</p>

        <h3 className="text-lg font-bold mt-6 mb-2">5. Security of Your Information</h3>
        <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p>

        <h3 className="text-lg font-bold mt-6 mb-2">6. Contact Us</h3>
        <p>If you have questions or comments about this Privacy Policy, please contact us at: support@cluevora.com</p>
      </div>
    </div>
  );
}
