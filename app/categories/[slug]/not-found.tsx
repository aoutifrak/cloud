import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container mx-auto py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8">
        The category you're looking for doesn't exist.
      </p>
      <Link href="/category">
        <Button>Back to Categories</Button>
      </Link>
    </div>
  )
} 