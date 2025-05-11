"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Category {
  title: string
  description: string
  slug: string
}

const categories: Category[] = [
  {
    title: "Action",
    description: "High-energy movies and shows with intense sequences",
    slug: "action",
  },
  {
    title: "Comedy",
    description: "Light-hearted entertainment to make you laugh",
    slug: "comedy",
  },
  {
    title: "Drama",
    description: "Character-driven stories with emotional depth",
    slug: "drama",
  },
  {
    title: "Horror",
    description: "Scary and suspenseful content",
    slug: "horror",
  },
  {
    title: "Romance",
    description: "Love stories and romantic relationships",
    slug: "romance",
  },
  {
    title: "Sci-Fi",
    description: "Futuristic and scientific fiction",
    slug: "scifi",
  },
]

const CategoryCard = ({ category }: { category: Category }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{category.title}</CardTitle>
        <CardDescription>{category.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={`/genre/${category.slug}`}>
          <Button variant="outline" className="w-full">
            Browse {category.title}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export default function CategoryPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.title} category={category} />
        ))}
      </div>
    </div>
  )
} 