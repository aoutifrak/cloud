import { MovieType, TVShowType } from "@/lib/types";

interface SchemaProps {
  type: 'Movie' | 'TVShow' | 'Collection';
  items?: (MovieType | TVShowType)[];
  title: string;
  description: string;
}

export function Schema({ type, items, title, description }: SchemaProps) {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type === 'Collection' ? 'CollectionPage' : 'ItemList',
    "name": title,
    "description": description,
  };

  if (type === 'Collection' && items) {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            ...baseSchema,
            "itemListElement": items.map((item, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": 'title' in item ? 'Movie' : 'TVSeries',
                "name": 'title' in item ? item.title : item.name,
                "image": `https://image.tmdb.org/t/p/original${item.poster_path}`,
                "description": item.overview,
                "datePublished": 'release_date' in item ? item.release_date : item.first_air_date,
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": item.vote_average,
                  "ratingCount": item.rating
                }
              }
            }))
          })
        }}
      />
    );
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(baseSchema)
      }}
    />
  );
} 