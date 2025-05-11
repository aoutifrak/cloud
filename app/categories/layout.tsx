import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Categories | Movie App",
  description: "Browse movies and TV shows by categories",
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
} 