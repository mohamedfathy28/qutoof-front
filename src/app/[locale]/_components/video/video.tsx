'use client'
import React, { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { FaPause, FaPlay } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

// Dynamically import ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import('react-player/lazy'), {
  ssr: false
});

interface VideoPlayerProps {
  url: string;
  title?: string;
  thumbnail?: string;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
  width?: string;
  height?: string;
  onReady?: () => void;
  onStart?: () => void;
  onEnded?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (error: any) => void;
}

interface PlayerState {
  playing: boolean;
  volume: number;
  muted: boolean;
  played: number;
  loaded: number;
  duration: number;
  playbackRate: number;
  fullscreen: boolean;
}

export function VideoPlayer({
  url,
  thumbnail,
  loop = false,
  width = '100%',
  height = '100%',
  onReady,
  onStart,
  onError
}: VideoPlayerProps) {
  // Refs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // State
  // const [playerState, setPlayerState] = useState<PlayerState>(true)
  const [playerState, setPlayerState] = useState<PlayerState>({
    playing: false,
    volume: 1,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    fullscreen: false
  });

  // Handlers
  const handlePlayPause = useCallback(() => {
    setPlayerState(prev => ({ ...prev, playing: !prev.playing }));
  }, []);



    const t = useTranslations("HomePage");
  





  return (
    <div 
      ref={containerRef}
      className="relative w-full  overflow-hidden"
    >
      <ReactPlayer
        ref={playerRef}
        url={url}
        width={width}
        height={height}
        playing={playerState.playing}
        loop={loop}
        volume={playerState.volume}
        muted={playerState.muted}
        playbackRate={playerState.playbackRate}
        onReady={onReady}
        onStart={onStart}
        onEnded={()=>{setPlayerState(prev => ({ ...prev, playing: !prev.playing }))}}
        onError={onError}
        progressInterval={1000}
        config={{
          file: {
            attributes: {
              poster: thumbnail
            }
          }
        }}
      />

      {/* Custom Controls */}
      {!playerState.playing && (
        <div className="absolute bottom-0 left-0 w-full h-full z-10 bg-black/40 p-3 flex flex-col items-center justify-center gap-4 lg:gap-12">
            <button 
              onClick={handlePlayPause}
              className="text-black w-16 h-16 rounded-[50%] bg-[#fff] flex items-center justify-center"
            >
              {playerState.playing ? <FaPause className='text-[24px]' /> :  <FaPlay className='text-[24px]' />}
            </button>

            <h4 className='text-[22px] leading-[30px] lg:text-[54px] lg:leading-[70px] text-[#FFFFFF] font-[600] text-center'>&quot;{t("Discover")}&quot;</h4>
          </div>
      )}
    </div>
  );
}

export default VideoPlayer;