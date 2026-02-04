export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">About OddinsOdds</h1>
      <div className="card prose prose-lg max-w-none">
        <p>
          OddinsOdds is your premier destination for football betting insights, predictions, and analytics.
        </p>
        <p>
          We combine advanced statistical models, expert analysis, and real-time data to provide you with 
          the most accurate predictions and valuable betting opportunities.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
        <p>
          To empower sports bettors with data-driven insights and transparent analysis, helping them make 
          informed decisions and improve their betting strategies.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">What We Offer</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Daily match predictions across major football leagues</li>
          <li>Real-time odds comparison from top bookmakers</li>
          <li>Comprehensive team and league statistics</li>
          <li>Educational content in our Betting Academy</li>
          <li>Expert analysis and betting tips</li>
        </ul>
      </div>
    </div>
  );
}
