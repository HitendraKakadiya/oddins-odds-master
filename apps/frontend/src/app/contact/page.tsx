import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
      <div className="card">
        <p className="text-lg text-gray-600 mb-6">
          Have questions or feedback? We&apos;d love to hear from you!
        </p>
        
        <div className="space-y-4 mb-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
            <a href="mailto:support@oddinsodds.com" className="text-primary-600 hover:underline">
              support@oddinsodds.com
            </a>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Business Inquiries</h3>
            <a href="mailto:business@oddinsodds.com" className="text-primary-600 hover:underline">
              business@oddinsodds.com
            </a>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
