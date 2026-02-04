export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <div className="card prose prose-lg max-w-none">
        <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">Introduction</h2>
        <p>
          OddinsOdds (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. 
          This Privacy Policy explains how we collect, use, and safeguard your information.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Personal identification information (name, email address)</li>
          <li>Usage data (pages visited, time spent on site)</li>
          <li>Device information (browser type, IP address)</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>To provide and improve our services</li>
          <li>To communicate with you about updates and promotions</li>
          <li>To analyze site usage and optimize user experience</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information from 
          unauthorized access, alteration, or disclosure.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at{' '}
          <a href="mailto:privacy@oddinsodds.com" className="text-primary-600 hover:underline">
            privacy@oddinsodds.com
          </a>
        </p>
      </div>
    </div>
  );
}

