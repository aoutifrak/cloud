'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Play, Pause } from 'lucide-react';
import Hls from 'hls.js';
import { fetchVideoSources } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

interface VideoSource {
  file: string;
  type: string;
  quality: string;
  lang: string;
}

interface Subtitle {
  url: string;
  lang: string;
}

interface ProviderSource {
  provider: string;
  files: VideoSource[];
  subtitles: Subtitle[];
  headers?: {
    Referer: string;
    'User-Agent': string;
    Origin: string;
  };
}

interface VideoPlayerProps {
  mediaType: 'movie' | 'tv';
  tmdbId: string;
  season?: number;
  episode?: number;
  provider?: string;
}

export default function VideoPlayer({
  mediaType,
  tmdbId,
  season,
  episode,
  provider
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<ProviderSource[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedQuality, setSelectedQuality] = useState<string>('auto');
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>('off');
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadVideoSources = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const sources = await fetchVideoSources({
          mediaType,
          tmdbId,
          season,
          episode,
          provider
        });

        setProviders(sources);
        
        // Set default provider to first available
        if (sources.length > 0) {
          setSelectedProvider(sources[0].provider);
        }
      } catch (err) {
        console.error('Error fetching video sources:', err);
        setError(err instanceof Error ? err.message : 'Failed to load video');
      } finally {
        setIsLoading(false);
      }
    };

    loadVideoSources();
  }, [mediaType, tmdbId, season, episode, provider]);

  useEffect(() => {
    if (!videoRef.current || !selectedProvider) return;

    const currentProvider = providers.find(p => p.provider === selectedProvider);
    if (!currentProvider) return;

    const video = videoRef.current;
    const source = currentProvider.files.find(f => f.quality === selectedQuality) || currentProvider.files[0];


    if (source.type === 'hls') {
      if (Hls.isSupported()) {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }

        const hls = new Hls({
          xhrSetup: (xhr, url) => {
            const proxyUrl = `/api/video?url=${encodeURIComponent(url)}`;
            xhr.open('GET', proxyUrl, true);
          }
        });

        hlsRef.current = hls;

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS Error:', data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('Network error:', data);
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error('Media error:', data);
                break;
              default:
                console.error('Fatal error:', data);
                break;
            }
          }
        });

        hls.loadSource(source.file);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().then(() => {
            setIsPlaying(true);
          }).catch(err => {
            console.error('Error playing video:', err);
          });
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        const proxyUrl = `/api/video?url=${encodeURIComponent(source.file)}`;
        video.src = proxyUrl;
        video.addEventListener('loadedmetadata', () => {
          video.play().then(() => {
            setIsPlaying(true);
          }).catch(err => {
            console.error('Error playing video:', err);
          });
        });
      }
    } else {
      const proxyUrl = `/api/video?url=${encodeURIComponent(source.file)}`;
      video.src = proxyUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.error('Error playing video:', err);
        });
      });
    }

    // Add event listeners for play/pause
    video.addEventListener('play', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));

    // Handle subtitles
    if (currentProvider.subtitles && currentProvider.subtitles.length > 0) {
      // Remove existing tracks
      while (video.firstChild) {
        video.removeChild(video.firstChild);
      }

      // Add new tracks
      currentProvider.subtitles.forEach(subtitle => {
        const track = document.createElement('track');
        track.kind = 'subtitles';
        track.label = subtitle.lang;
        track.srclang = subtitle.lang.toLowerCase();
        track.src = subtitle.url;
        track.default = false;
        video.appendChild(track);
      });

      // Set initial subtitle state
      if (selectedSubtitle === 'off') {
        const tracks = video.textTracks;
        for (let i = 0; i < tracks.length; i++) {
          tracks[i].mode = 'disabled';
        }
      } else {
        const tracks = video.textTracks;
        for (let i = 0; i < tracks.length; i++) {
          const track = tracks[i];
          track.mode = track.language === selectedSubtitle ? 'showing' : 'hidden';
        }
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [selectedProvider, selectedQuality, providers, selectedSubtitle]);

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider);
    const currentProvider = providers.find(p => p.provider === provider);
    if (currentProvider && currentProvider.files && currentProvider.files.length > 0) {
      setSelectedQuality(currentProvider.files[0].quality);
    }
  };

  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality);
  };

  const handleSubtitleChange = (lang: string) => {
    setSelectedSubtitle(lang);
    if (videoRef.current) {
      const tracks = videoRef.current.textTracks;
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        if (lang === 'off') {
          track.mode = 'disabled';
        } else {
          track.mode = track.language === lang ? 'showing' : 'hidden';
        }
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
    if (!isSettingsOpen) {
      setShowControls(true);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (!isSettingsOpen) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleMouseLeave = () => {
    if (!isSettingsOpen) {
      setShowControls(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <p className="text-lg mb-2">Error loading video</p>
          <p className="text-sm text-gray-400">{error}</p>
          <p className="text-xs text-gray-500 mt-2">
            "error"
          </p>
        </div>
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <p className="text-lg mb-2">No video sources available</p>
          <p className="text-sm text-gray-400">Please try again later</p>
        </div>
      </div>
    );
  }

  const currentProvider = providers.find(p => p.provider === selectedProvider);

  return (
    <div 
      className="relative w-full h-full bg-black"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        controls={false}
        autoPlay
        onClick={togglePlay}
      />
      
      {/* Controls overlay */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          {/* Progress bar */}
          <div className="w-full h-1 bg-gray-600 rounded-full mb-4 cursor-pointer" onClick={(e) => {
            if (!videoRef.current) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            videoRef.current.currentTime = pos * videoRef.current.duration;
          }}>
            <div 
              className="h-full bg-blue-500 rounded-full relative"
              style={{ 
                width: videoRef.current ? `${(videoRef.current.currentTime / videoRef.current.duration) * 100}%` : '0%'
              }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full transform translate-x-1/2" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Left controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="text-white hover:text-white/80"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-white hover:text-white/80"
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
            </div>

            {/* Right controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSettings}
                className="text-white hover:text-white/80"
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="text-white hover:text-white/80"
              >
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Settings panel */}
          {isSettingsOpen && (
            <div 
              className="mt-2 p-4 bg-black/90 rounded-lg absolute bottom-full mb-2 left-0 right-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Provider selector */}
                <div>
                  <label className="text-sm text-white/80 block mb-2">Provider</label>
                  <Select value={selectedProvider} onValueChange={handleProviderChange}>
                    <SelectTrigger className="w-full bg-transparent text-white">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map((provider) => (
                        <SelectItem key={provider.provider} value={provider.provider}>
                          {provider.provider}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quality selector */}
                {currentProvider && (
                  <div>
                    <label className="text-sm text-white/80 block mb-2">Quality</label>
                    <Select value={selectedQuality} onValueChange={handleQualityChange}>
                      <SelectTrigger className="w-full bg-transparent text-white">
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentProvider.files.map((file) => (
                          <SelectItem key={file.quality} value={file.quality}>
                            {file.quality}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Subtitle selector */}
                {currentProvider?.subtitles && currentProvider.subtitles.length > 0 && (
                  <div>
                    <label className="text-sm text-white/80 block mb-2">Subtitles</label>
                    <Select value={selectedSubtitle} onValueChange={handleSubtitleChange}>
                      <SelectTrigger className="w-full bg-transparent text-white">
                        <SelectValue placeholder="Select subtitle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="off">Off</SelectItem>
                        {currentProvider.subtitles.map((subtitle) => (
                          <SelectItem key={subtitle.lang} value={subtitle.lang}>
                            {subtitle.lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 