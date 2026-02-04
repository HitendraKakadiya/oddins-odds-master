export default function TermsConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms & Conditions</h1>
      <div className="card prose prose-lg max-w-none">
        <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">Acceptance of Terms</h2>
        <p>
          By accessing and using Oddins Odds, you accept and agree to be bound by these Terms and Conditions.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Use of Service</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>You must be at least 18 years old to use this service</li>
          <li>You are responsible for maintaining the confidentiality of your account</li>
          <li>You agree not to use the service for any illegal or unauthorized purpose</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Disclaimer</h2>
        <p>
          The predictions and information provided on Oddins Odds are for informational purposes only. 
          We do not guarantee the accuracy or completeness of any prediction or analysis.
        </p>
        <p>
          <strong>Gambling Disclaimer:</strong> Betting involves risk. Only bet what you can afford to lose. 
          If you have a gambling problem, please seek help from appropriate organizations.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Intellectual Property</h2>
        <p>
          All content on Oddins Odds, including text, graphics, logos, and software, is the property 
          of Oddins Odds and is protected by copyright laws.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Limitation of Liability</h2>
        <p>
          Oddins Odds shall not be liable for any direct, indirect, incidental, or consequential damages 
          arising from your use of the service.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use of the service after 
          changes constitutes acceptance of the modified terms.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Contact</h2>
        <p>
          For questions about these Terms & Conditions, contact us at{' '}
          <a href="mailto:legal@oddinsodds.com" className="text-primary-600 hover:underline">
            legal@oddinsodds.com
          </a>
        </p>
      </div>
    </div>
  );
}

