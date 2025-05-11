import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Help Center",
  description: "Get help and support for your streaming experience",
}

export default function HelpCenter() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Help Center</h1>
      
      <div className="grid md:grid-cols-4 gap-8">
        {/* Navigation Menu */}
        <div className="md:col-span-1">
          <nav className="sticky top-24 space-y-2">
            <h2 className="text-lg font-semibold mb-4">Help Topics</h2>
            <Link 
              href="#account" 
              className="block px-4 py-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              Account & Security
            </Link>
            <Link 
              href="#streaming" 
              className="block px-4 py-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              Streaming & Playback
            </Link>
            <Link 
              href="#billing" 
              className="block px-4 py-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              Billing & Subscription
            </Link>
            <Link 
              href="#technical" 
              className="block px-4 py-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              Technical Support
            </Link>
            <Link 
              href="#faq" 
              className="block px-4 py-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              Frequently Asked Questions
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 space-y-8">
          <section id="account" className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Account & Security</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">How do I create an account?</h3>
                <p className="text-muted-foreground">Click on the "Sign Up" button in the top right corner and follow the registration process.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">How do I reset my password?</h3>
                <p className="text-muted-foreground">Click on "Forgot Password" on the login page and follow the instructions sent to your email.</p>
              </div>
            </div>
          </section>

          <section id="streaming" className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Streaming & Playback</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">How do I add movies to my watchlist?</h3>
                <p className="text-muted-foreground">Click the "+" icon on any movie card to add it to your watchlist.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">How do I search for movies?</h3>
                <p className="text-muted-foreground">Use the search bar at the top of the page to find movies by title, genre, or actor.</p>
              </div>
            </div>
          </section>

          <section id="billing" className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Billing & Subscription</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">How do I update my payment method?</h3>
                <p className="text-muted-foreground">Go to your account settings and select "Payment Methods" to update your information.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">How do I cancel my subscription?</h3>
                <p className="text-muted-foreground">Visit your account settings and select "Subscription" to manage your subscription status.</p>
              </div>
            </div>
          </section>

          <section id="technical" className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Technical Support</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">What are the system requirements?</h3>
                <p className="text-muted-foreground">Our service works best on modern browsers and devices. We recommend using the latest version of Chrome, Firefox, or Safari.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">How do I report a technical issue?</h3>
                <p className="text-muted-foreground">Use our contact form to report any technical issues you encounter while using our service.</p>
              </div>
            </div>
          </section>

          <section id="faq" className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">What video quality is available?</h3>
                <p className="text-muted-foreground">We offer streaming in various qualities including HD and 4K, depending on your subscription plan and internet connection.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Can I download movies to watch offline?</h3>
                <p className="text-muted-foreground">Yes, you can download movies for offline viewing on our mobile apps. This feature is available for select titles.</p>
              </div>
            </div>
          </section>

          <section className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
            <p className="text-muted-foreground mb-4">Our support team is here for you.</p>
            <Link 
              href="/contact" 
              className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
} 