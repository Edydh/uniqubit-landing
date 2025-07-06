import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TermsOfService() {
  const lastUpdated = "January 1, 2025";

  return (
    <>
      <Head>
        <title>Terms of Service | uniQubit</title>
        <meta name="description" content="Terms of Service for uniQubit - The terms and conditions governing the use of our services." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://uniqubit.ca/terms-of-service" />
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
                Terms of Service
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                The terms and conditions governing our professional services.
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
                  <h2 className="text-2xl font-bold font-heading text-white mb-4">1. Agreement to Terms</h2>
                  <p className="text-gray-300 leading-relaxed">
                    By accessing and using uniQubit's services, you accept and agree to be bound by these Terms of Service. 
                    If you do not agree to these terms, please do not use our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold font-heading text-white mb-4">2. Description of Services</h2>
                  <p className="text-gray-300 leading-relaxed">
                    uniQubit provides professional software development services including but not limited to:
                  </p>
                  <ul className="text-gray-300 mt-4 space-y-2">
                    <li>• Custom web application development</li>
                    <li>• Mobile application development</li>
                    <li>• AI integration and consulting</li>
                    <li>• SaaS platform development</li>
                    <li>• Technical consulting and architecture</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold font-heading text-white mb-4">3. Service Agreements</h2>
                  <p className="text-gray-300 leading-relaxed">
                    Specific terms for each project will be outlined in separate service agreements or statements of work. 
                    These documents will detail:
                  </p>
                  <ul className="text-gray-300 mt-4 space-y-2">
                    <li>• Project scope and deliverables</li>
                    <li>• Timeline and milestones</li>
                    <li>• Payment terms and schedule</li>
                    <li>• Intellectual property rights</li>
                    <li>• Confidentiality agreements</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold font-heading text-white mb-4">4. Client Responsibilities</h2>
                  <p className="text-gray-300 leading-relaxed">
                    Clients are responsible for:
                  </p>
                  <ul className="text-gray-300 mt-4 space-y-2">
                    <li>• Providing accurate and complete project requirements</li>
                    <li>• Timely feedback and approvals</li>
                    <li>• Access to necessary systems and resources</li>
                    <li>• Payment according to agreed terms</li>
                    <li>• Maintaining confidentiality of proprietary information</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold font-heading text-white mb-4">5. Intellectual Property</h2>
                  <p className="text-gray-300 leading-relaxed">
                    Unless otherwise specified in the service agreement, clients retain ownership of their proprietary data and 
                    content. uniQubit retains rights to general methodologies, techniques, and non-proprietary code developed 
                    during the course of providing services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold font-heading text-white mb-4">6. Confidentiality</h2>
                  <p className="text-gray-300 leading-relaxed">
                    Both parties agree to maintain the confidentiality of proprietary information shared during the course 
                    of the business relationship. This includes technical specifications, business strategies, and other 
                    sensitive information.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold font-heading text-white mb-4">7. Limitation of Liability</h2>
                  <p className="text-gray-300 leading-relaxed">
                    uniQubit's liability for any claims arising from our services is limited to the total amount paid for 
                    the specific services giving rise to the claim. We are not liable for indirect, incidental, or 
                    consequential damages.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold font-heading text-white mb-4">8. Termination</h2>
                  <p className="text-gray-300 leading-relaxed">
                    Either party may terminate the service agreement with written notice. Termination procedures and 
                    obligations will be detailed in the specific service agreement.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold font-heading text-white mb-4">9. Governing Law</h2>
                  <p className="text-gray-300 leading-relaxed">
                    These terms are governed by the laws of Ontario, Canada. Any disputes will be resolved through 
                    binding arbitration in Toronto, Ontario.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold font-heading text-white mb-4">10. Contact Information</h2>
                  <p className="text-gray-300 leading-relaxed">
                    For questions about these Terms of Service, please contact us at:
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
