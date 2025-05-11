'use client';

import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SeasonEpisodeSelectorProps {
  tvShowId: number;
  currentSeason: number;
  currentEpisode: number;
  totalSeasons: number;
  episodeCount: number;
}

export default function SeasonEpisodeSelector({
  tvShowId,
  currentSeason,
  currentEpisode,
  totalSeasons,
  episodeCount,
}: SeasonEpisodeSelectorProps) {
  const router = useRouter();

  const handleSeasonChange = (value: string) => {
    router.push(`/tv-show/${tvShowId}/watch?season=${value}&episode=1`);
  };

  const handleEpisodeChange = (value: string) => {
    router.push(`/tv-show/${tvShowId}/watch?season=${currentSeason}&episode=${value}`);
  };

  return (
    <div className="flex gap-4 mb-4">
      <Select
        value={currentSeason.toString()}
        onValueChange={handleSeasonChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Season" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((season) => (
            <SelectItem key={season} value={season.toString()}>
              Season {season}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select
        value={currentEpisode.toString()}
        onValueChange={handleEpisodeChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Episode" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: episodeCount }, (_, i) => i + 1).map((episode) => (
            <SelectItem key={episode} value={episode.toString()}>
              Episode {episode}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 