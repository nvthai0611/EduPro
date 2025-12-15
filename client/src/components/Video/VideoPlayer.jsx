import React, { useRef, useEffect, useState } from "react";
import YouTube from "react-youtube";
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { formatDuration } from "../../utils/format";

const VideoPlayer = ({ src, poster, title, className = "", onRef, showCustomControls = false, speedControls }) => {
  const isYouTube = src.includes("youtube.com") || src.includes("youtu.be");
  const playerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isHovering, setIsHovering] = useState(true);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const hideTimerRef = useRef(null);

  // Auto hide controls
  const handleMouseMove = () => {
    setIsHovering(true);

    // reset timer
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    hideTimerRef.current = setTimeout(() => {
      setIsHovering(false);
    }, 2000); // 2 giây
  };

  // Close settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSettingsDropdown && !event.target.closest('.settings-dropdown')) {
        setShowSettingsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettingsDropdown]);


  const getYouTubeId = () => {
    if (!src) return null;

    const trimmed = src.trim();
    if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;

    const patterns = [
      /youtu\.be\/([A-Za-z0-9_-]{11})/, // short links
      /youtu\.be\/watch\?v=([A-Za-z0-9_-]{11})/, // non-standard short links
      /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/, // shorts
      /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/, // embed
      /youtube\.com\/v\/([A-Za-z0-9_-]{11})/, // legacy
      /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/, // standard
      /youtube\.com\/.*[?&]v=([A-Za-z0-9_-]{11})/, // fallback query param
    ];

    for (const pattern of patterns) {
      const match = trimmed.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  const ytOptions = {
    height: "100%",
    width: "100%", 
    playerVars: {
      autoplay: 0,
      controls: 0, // tắt UI gốc Youtube
      modestbranding: 1,
      rel: 0,
    },
  };

  /** Khi player sẵn sàng */
  const onReady = (event) => {
    playerRef.current = event.target;

    // Call onRef callback if provided
    if (onRef && typeof onRef === 'function') {
      onRef(event.target);
    }

    // Duration lúc này thường = 0, YouTube chưa load metadata
    const checkDuration = setInterval(() => {
      const d = event.target.getDuration();
      if (d && d > 0) {
        setDuration(d);
        clearInterval(checkDuration);
      }
    }, 300);
  };

  /** Khi state thay đổi */
  const onStateChange = (event) => {
    const player = event.target;

    if (event.data === 1) {
      // playing
      setIsPlaying(true);

      // Duration chính xác ở thời điểm này
      const d = player.getDuration();
      if (d > 0) setDuration(d);
    }

    if (event.data === 2) {
      setIsPlaying(false);
    }
  };

  /** Cập nhật currentTime mỗi 200ms */
  useEffect(() => {
    const timer = setInterval(() => {
      if (playerRef.current && isPlaying) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 200);

    return () => clearInterval(timer);
  }, [isPlaying]);

  /** Play / Pause */
  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
    setIsPlaying(!isPlaying);
  };

  /** Seek */
  const handleSeek = (v) => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(v[0], true);
    setCurrentTime(v[0]);
  };

  /** Volume */
  const handleVolumeChange = (v) => {
    if (!playerRef.current) return;

    const vol = Math.floor(v[0] * 100);
    setVolume(vol);
    playerRef.current.setVolume(vol);
    setIsMuted(vol === 0);
  };

  /** Mute */
  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  /** Fullscreen custom container (not YouTube iframe) */
  const toggleFullscreen = () => {
    const wrapper = document.getElementById("yt-wrapper");
    if (!wrapper) return;

    if (!document.fullscreenElement) {
      wrapper.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  /** Format time */
  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || timeInSeconds === 0) return "0:00";
    
    // Convert seconds to minutes for formatDuration
    const timeInMinutes = timeInSeconds / 60;
    return formatDuration(timeInMinutes, 'time');
  };

  return (
    <div
      id="yt-wrapper"
      className={`relative bg-black rounded-lg overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* YouTube Player */}
      <div id="yt-player-frame" className="w-full h-full">
        {(() => {
          const videoId = getYouTubeId();
          return (
            <YouTube
              videoId={videoId}
              opts={ytOptions}
              onReady={onReady}
              onStateChange={onStateChange}
              className="w-full h-full"
            />
          );
        })()}
      </div>

      {/* Title */} 
      {/* {title && (
        <div className="absolute top-0 left-0 right-0 z-20">
          <h2 className="text-white text-lg font-semibold bg-black/50 px-3 py-4">
            {title}
          </h2>
        </div>
      )} */}

      {/* Controls */}
      {showControls && (
        <div
          className={`absolute inset-0 z-20 bg-gradient-to-t from-black/60 via-transparent to-transparent
        transition-opacity duration-300
        ${isHovering ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={togglePlay}
        >
          {/* Center Play */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="lg"
              variant="ghost"
              className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 text-white"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />

            <div className="flex items-center justify-between text-white mt-3">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={togglePlay}>
                  {isPlaying ? <Pause /> : <Play />}
                </Button>

                <Button variant="ghost" size="sm" onClick={toggleMute}>
                  {isMuted ? <VolumeX /> : <Volume2 />}
                </Button>

                <div className="w-[100px]">
                  <Slider
                    value={[volume / 100]}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                  />
                </div>

                <div className="text-sm w-[100%]">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center gap-2 relative">
                {/* Settings Button */}
                {showCustomControls && speedControls && (
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                      className="text-white hover:bg-white/20"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    
                    {/* Settings Dropdown */}
                    {showSettingsDropdown && (
                      <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-sm rounded-lg p-3 min-w-[160px]">
                        <div className="text-white text-sm mb-2 font-medium">Tốc độ phát</div>
                        <div className="space-y-1">
                          {speedControls.speedOptions.map(speed => (
                            <button
                              key={speed}
                              onClick={() => {
                                if (playerRef.current) {
                                  playerRef.current.setPlaybackRate(speed);
                                }
                                speedControls.onSpeedChange?.(speed);
                                setShowSettingsDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-white/20 transition ${
                                speedControls.currentSpeed === speed
                                  ? 'text-blue-400 font-medium'
                                  : 'text-white'
                              }`}
                            >
                              {speed === 1 ? 'Bình thường' : `${speed}x`}
                              {speedControls.currentSpeed === speed && (
                                <span className="ml-2">✓</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                  <Maximize />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );


};

export default VideoPlayer;