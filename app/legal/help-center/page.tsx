import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Help Center",
  description: "Get help and support for your streaming experience",
}

export default function HelpCenterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Help Center</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <p className="text-gray-600">
            Welcome to our streaming platform! Here you'll find everything you need to know about using our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Account Management</h2>
          <p className="text-gray-600">
            Learn how to manage your account, update your profile, and handle subscription settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Streaming Guide</h2>
          <p className="text-gray-600">
            Discover how to stream content, manage your watchlist, and optimize your viewing experience.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Technical Support</h2>
          <p className="text-gray-600">
            Find solutions to common technical issues and learn about our supported devices.
          </p>
        </section>
      </div>
    </div>
  )
} 