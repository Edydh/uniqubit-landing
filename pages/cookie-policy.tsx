import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CookiePolicy() {
  const lastUpdated = "January 1, 2025";

  return (
    <>
      <Head>
        <title>Cookie Policy | uniQubit</title>
        <meta name="description" content="Cookie Policy for uniQubit - How we use cookies and tracking technologies on our website." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://uniqubit.ca/cookie-policy" />
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
                Cookie Policy
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Learn about how we use cookies and tracking technologies.
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
                  <h2 className="text-2xl font-bold font-heading text-white mb-4">1. What Are Cookies?</h2>
                  <p className="text-gray-300 leading-relaxed">
                    Cookies are small text files that are placed on your device when you visit our website. They help us 
                    provide you with a better browsing experience by remembering your preferences and analyzing how you 
                    use our site.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold font-heading text-white mb-4">2. Types of Cookies We Use</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-white/5 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-white mb-3">Essential Cookies</h3>
                      <p className="text-gray-300 leading-relaxed">
                        These cookies are necessary for our website to function properly. They enable basic features like 
                        page navigation and access to secure areas of the website.
                      </p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-white mb-3">Analytics Cookies</h3>
                      <p className="text-gray-300 leading-relaxed">
                        We use analytics cookies to understand how visitors interact with our website. This helps us 
                        improve our site's performance and user experience.
                      </p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-white mb-3">Functional Cookies</h3>
                      <p className="text-gray-300 leading-relaxed">
                        These cookies enable enhanced functionality and personalization, such as remembering your 
                        preferences and settings.
                      </p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-white mb-3">Marketing Cookies</h3>
                      <p className="text-gray-300 leading-relaxed">
                        We may use marketing cookies to deliver relevant advertisements and measure the effectiveness 
                        of our marketing campaigns.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold font-heading text-white mb-4">3. Third-Party Cookies</h2>
                  <p className="text-gray-300 leading-relaxed">
                    We may use third-party services that set cookies on our behalf. These may include:
                  </p>
                  <ul className="text-gray-300 mt-4 space-y-2">
                    <li>• Google Analytics for website analytics</li>
                    <li>• Social media platforms for social sharing features</li>
                    <li>• Marketing platforms for advertising and retargeting</li>
                    <li>• Customer support tools for chat functionality</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold font-heading text-white mb-4">4. Managing Your Cookie Preferences</h2>
                  <p className="text-gray-300 leading-relaxed">
                    You can control and manage cookies in several ways:
                  </p>
                  <ul className="text-gray-300 mt-4 space-y-2">
                    <li>• <strong>Browser Settings:</strong> Most browsers allow you to block or delete cookies</li>
                    <li>• <strong>Opt-out Tools:</strong> Use industry opt-out tools for advertising cookies</li>
                    <li>• <strong>Direct Control:</strong> Some services provide their own cookie management tools</li>
                  </ul>
                  
                  <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <p className="text-gray-300">
                      <strong>Note:</strong> Disabling certain cookies may impact your experience on our website and 
                      limit some functionality.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold font-heading text-white mb-4">5. Browser-Specific Instructions</h2>
                  <p className="text-gray-300 leading-relaxed">
                    Here's how to manage cookies in popular browsers:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-white/5 p-4 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">Chrome</h4>
                      <p className="text-gray-300 text-sm">Settings → Privacy and Security → Cookies and other site data</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">Firefox</h4>
                      <p className="text-gray-300 text-sm">Settings → Privacy & Security → Cookies and Site Data</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">Safari</h4>
                      <p className="text-gray-300 text-sm">Preferences → Privacy → Manage Website Data</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">Edge</h4>
                      <p className="text-gray-300 text-sm">Settings → Cookies and site permissions → Cookies and site data</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold font-heading text-white mb-4">6. Updates to This Policy</h2>
                  <p className="text-gray-300 leading-relaxed">
                    We may update this Cookie Policy from time to time to reflect changes in our practices or 
                    applicable laws. We will notify you of any material changes by posting the updated policy on 
                    our website.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold font-heading text-white mb-4">7. Contact Us</h2>
                  <p className="text-gray-300 leading-relaxed">
                    If you have any questions about our use of cookies, please contact us at:
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
