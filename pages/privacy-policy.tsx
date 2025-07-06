import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  const lastUpdated = "January 1, 2025";

  return (
    <>
      <Head>
        <title>Privacy Policy | uniQubit</title>
        <meta name="description" content="Privacy Policy for uniQubit - How we collect, use, and protect your personal information." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://uniqubit.ca/privacy-policy" />
      </Head>

      <div className="min-h-screen bg-background text-white">
        {/* Header */}
        <div className="bg-gradient-to-b from-background to-secondary/50 py-20">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Your privacy matters to us. Learn how we protect your information.
              </p>
              <div className="flex justify-center">
                <Link
                  href="/"
                  className="px-6 py-3 bg-glass backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>← Back to Home</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-glass backdrop-blur-md rounded-2xl border border-white/10 p-8 md:p-12"
          >
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-gray-300 mb-8">
                <strong>Last updated:</strong> {lastUpdated}
              </p>

              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold font-heading text-white mb-4">1. Information We Collect</h2>
                  <p className="text-gray-300 leading-relaxed">
                    We collect information you provide directly to us, such as when you contact us through our website, 
                    request our services, or communicate with us. This may include:
                  </p>
                  <ul className="text-gray-300 mt-4 space-y-2">
                    <li>• Name and contact information (email, phone number)</li>
                    <li>• Company information</li>
                    <li>• Project requirements and preferences</li>
                    <li>• Communication preferences</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold font-heading text-white mb-4">2. How We Use Your Information</h2>
                  <p className="text-gray-300 leading-relaxed">
                    We use the information we collect to:
                  </p>
                  <ul className="text-gray-300 mt-4 space-y-2">
                    <li>• Respond to your inquiries and provide customer service</li>
                    <li>• Deliver the services you request</li>
                    <li>• Communicate with you about our services</li>
                    <li>• Improve our website and services</li>
                    <li>• Comply with legal obligations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold font-heading text-white mb-4">3. Information Sharing</h2>
                  <p className="text-gray-300 leading-relaxed">
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
                    except as described in this privacy policy. We may share information with:
                  </p>
                  <ul className="text-gray-300 mt-4 space-y-2">
                    <li>• Service providers who assist us in operating our business</li>
                    <li>• Legal authorities when required by law</li>
                    <li>• Business partners with your explicit consent</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold font-heading text-white mb-4">4. Data Security</h2>
                  <p className="text-gray-300 leading-relaxed">
                    We implement appropriate security measures to protect your personal information against unauthorized access, 
                    alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold font-heading text-white mb-4">5. Your Rights</h2>
                  <p className="text-gray-300 leading-relaxed">
                    You have the right to:
                  </p>
                  <ul className="text-gray-300 mt-4 space-y-2">
                    <li>• Access your personal information</li>
                    <li>• Correct inaccurate information</li>
                    <li>• Request deletion of your information</li>
                    <li>• Opt out of marketing communications</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold font-heading text-white mb-4">6. Cookies and Tracking</h2>
                  <p className="text-gray-300 leading-relaxed">
                    We use cookies and similar tracking technologies to enhance your browsing experience and analyze website traffic. 
                    You can control cookie settings through your browser preferences.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold font-heading text-white mb-4">7. Contact Us</h2>
                  <p className="text-gray-300 leading-relaxed">
                    If you have any questions about this Privacy Policy, please contact us at:
                  </p>
                  <div className="mt-4 p-4 bg-white/5 rounded-lg">
                    <p className="text-gray-300">
                      <strong>Email:</strong> info@uniqubit.ca<br />
                      <strong>Address:</strong> Toronto, Canada
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
