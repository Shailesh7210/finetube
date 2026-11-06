'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Clock, CheckCircle } from 'lucide-react';

export interface VideoPlayerRef {
  seekTo: (seconds: number) => void;
  getCurrentTime: () => number;
}

interface VideoPlayerProps {
  providerVideoId: string;
  title: string;
  onTimeUpdate?: (seconds: number) => void;
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(({
  providerVideoId,
  title,
  onTimeUpdate
}, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  // Expose imperative handle for seeking
  useImperativeHandle(ref, () => ({
    seekTo: (seconds: number) => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'seekTo',
            args: [seconds, true]
          }),
          '*'
        );
        setCurrentTime(seconds);
        if (onTimeUpdate) onTimeUpdate(seconds);
      }
    },
    getCurrentTime: () => currentTime
  }));

  // Listen to messages from YouTube iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        if (typeof event.data === 'string') {
          const data = JSON.parse(event.data);
          if (data.event === 'infoDelivery' && data.info && typeof data.info.currentTime === 'number') {
            const time = Math.floor(data.info.currentTime);
            setCurrentTime(time);
            if (onTimeUpdate) onTimeUpdate(time);
          }
        }
      } catch {
        // Non-json messages from other extensions/frames
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onTimeUpdate]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      <iframe
        ref={iframeRef}
        src={`https://www.youtube-nocookie.com/embed/${providerVideoId}?enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}&rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full border-0"
      />
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
