'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface VideoSource {
  file: string;
  type: string;
  quality: string;
  lang: string;
}

interface ProviderSource {
  provider: string;
  files: VideoSource[];
  subtitles: {
    url: string;
    lang: string;
  }[];
}

interface SourceSelectorProps {
  providers: ProviderSource[];
  onSourceSelect: (source: VideoSource, subtitles: { url: string; lang: string; }[]) => void;
}

export default function SourceSelector({ providers, onSourceSelect }: SourceSelectorProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedQuality, setSelectedQuality] = useState<string>('auto');
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>('off');

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider);
    const currentProvider = providers.find(p => p.provider === provider);
    if (currentProvider && currentProvider.files && currentProvider.files.length > 0) {
      setSelectedQuality(currentProvider.files[0].quality);
      onSourceSelect(
        currentProvider.files[0],
        currentProvider.subtitles || []
      );
    }
  };

  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality);
    const currentProvider = providers.find(p => p.provider === selectedProvider);
    if (currentProvider) {
      const source = currentProvider.files.find(f => f.quality === quality) || currentProvider.files[0];
      onSourceSelect(source, currentProvider.subtitles || []);
    }
  };

  const handleSubtitleChange = (lang: string) => {
    setSelectedSubtitle(lang);
  };

  const currentProvider = providers.find(p => p.provider === selectedProvider);
  const hasSubtitles = currentProvider?.subtitles && currentProvider.subtitles.length > 0;

  return (
    <div className="flex flex-col gap-4 p-4 bg-black/80 rounded-lg">
      <div className="flex flex-wrap gap-2">
        {providers.map((provider) => (
          <Button
            key={provider.provider}
            variant={selectedProvider === provider.provider ? "default" : "outline"}
            onClick={() => handleProviderChange(provider.provider)}
            className="text-sm"
          >
            {provider.provider}
          </Button>
        ))}
      </div>

      {currentProvider && (
        <div className="flex flex-wrap gap-2">
          {currentProvider.files.map((file) => (
            <Button
              key={file.quality}
              variant={selectedQuality === file.quality ? "default" : "outline"}
              onClick={() => handleQualityChange(file.quality)}
              className="text-sm"
            >
              {file.quality}
            </Button>
          ))}
        </div>
      )}

      {hasSubtitles && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedSubtitle === 'off' ? "default" : "outline"}
            onClick={() => handleSubtitleChange('off')}
            className="text-sm"
          >
            Subtitles: Off
          </Button>
          {currentProvider?.subtitles.map((subtitle) => (
            <Button
              key={subtitle.lang}
              variant={selectedSubtitle === subtitle.lang ? "default" : "outline"}
              onClick={() => handleSubtitleChange(subtitle.lang)}
              className="text-sm"
            >
              {subtitle.lang}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
} 