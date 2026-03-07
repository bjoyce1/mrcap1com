import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Privacy = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy",
    url: "https://mrcap1.com/privacy",
    isPartOf: { "@type": "WebSite", url: "https://mrcap1.com" },
  };

  return (
    <>
      <Helmet>
        <title>Privacy Policy | Mr. CAP</title>
        <meta name="description" content="Privacy policy for mrcap1.com covering analytics, cookies, form data handling, and your rights." />
        <link rel="canonical" href="https://mrcap1.com/privacy" />
        <meta name="robots" content="noindex, follow" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />

        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-8">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground mb-10">Last updated: March 7, 2026</p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">1. Overview</h2>
                <p className="text-muted-foreground leading-relaxed">
                  This privacy policy explains how mrcap1.com ("we", "us", "our") collects, uses, and protects
                  information when you visit our website. We are committed to protecting your privacy and being
                  transparent about our practices.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">2. Information We Collect</h2>
                <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">Analytics Data</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We use Google Analytics (GA4) to understand how visitors interact with our site. This service
                  collects anonymized data including pages visited, time spent on site, referring sources, and
                  general device/browser information. No personally identifiable information is collected through
                  analytics.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">Form Submissions</h3>
                <p className="text-muted-foreground leading-relaxed">
                  When you submit a booking inquiry or newsletter signup, we collect the information you provide
                  (name, email, and any additional details). This data is stored securely and used solely to
                  process your request or deliver updates you've opted into.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">Cookies</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our site uses essential cookies required for basic functionality and analytics cookies from
                  Google Analytics. No advertising or third-party tracking cookies are used.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">3. How We Use Your Information</h2>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>To respond to booking inquiries and media requests</li>
                  <li>To send newsletter updates if you've subscribed</li>
                  <li>To understand site usage and improve the experience</li>
                  <li>To maintain site security and prevent abuse</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">4. Data Sharing</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not sell, trade, or share your personal information with third parties, except as
                  required by law or as necessary to provide our services (e.g., email delivery providers).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">5. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You may request access to, correction of, or deletion of any personal data we hold about you.
                  To exercise these rights, contact us at{" "}
                  <a href="mailto:wrecklessent@gmail.com" className="text-primary hover:underline">
                    wrecklessent@gmail.com
                  </a>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">6. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For privacy-related questions, contact us at{" "}
                  <a href="mailto:wrecklessent@gmail.com" className="text-primary hover:underline">
                    wrecklessent@gmail.com
                  </a>{" "}
                  or visit our{" "}
                  <Link to="/booking" className="text-primary hover:underline">
                    booking page
                  </Link>{" "}
                  to submit an inquiry.
                </p>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Privacy;
