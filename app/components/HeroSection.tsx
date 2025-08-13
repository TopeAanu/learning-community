// app/components/HeroSection.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  Users,
  TrendingUp,
  Target,
  Heart,
  Briefcase,
  Code,
  UserCheck,
} from "lucide-react";

const HeroSection = () => {
  const [currentVideo, setCurrentVideo] = useState<"adchero1" | "adchero2">(
    "adchero1"
  );
  const [videoState, setVideoState] = useState<
    "transitioning-in" | "playing" | "transitioning-out"
  >("transitioning-in");
  const [videosLoaded, setVideosLoaded] = useState(false);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !videosLoaded) {
            setVideosLoaded(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [videosLoaded]);

  useEffect(() => {
    if (!videosLoaded) return;
    let timeoutId: NodeJS.Timeout;

    const cycleVideos = () => {
      if (currentVideo === "adchero1") {
        setVideoState("transitioning-in");
        setTimeout(() => setVideoState("playing"), 2000);
        setTimeout(() => setVideoState("transitioning-out"), 10000);
        timeoutId = setTimeout(() => {
          setCurrentVideo("adchero2");
        }, 12000);
      } else {
        setVideoState("transitioning-in");
        setTimeout(() => setVideoState("playing"), 2000);
        setTimeout(() => setVideoState("transitioning-out"), 5000);
        timeoutId = setTimeout(() => {
          setCurrentVideo("adchero1");
        }, 7000);
      }
    };

    cycleVideos();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentVideo, videosLoaded]);

  useEffect(() => {
    if (!videosLoaded) return;
    const activeVideo =
      currentVideo === "adchero1" ? video1Ref.current : video2Ref.current;
    if (activeVideo && videoState === "transitioning-in") {
      activeVideo.currentTime = 0;
      activeVideo.play().catch(console.error);
    }
  }, [currentVideo, videoState, videosLoaded]);

  // Carousel functionality
  const features = [
    {
      icon: Users,
      color: "text-purple-400",
      title: "Diverse Community",
      desc: "Developers, PMs, Designers & More",
    },
    {
      icon: TrendingUp,
      color: "text-blue-400",
      title: "Career Growth",
      desc: "Early to Mid-Level Focus",
    },
    {
      icon: Target,
      color: "text-pink-400",
      title: "Practical Skills",
      desc: "Interview, Lead, Collaborate",
    },
    {
      icon: Heart,
      color: "text-red-400",
      title: "Supportive",
      desc: "Learning & Earning Together",
    },
    {
      icon: Briefcase,
      color: "text-green-400",
      title: "VA Services",
      desc: "Virtual Assistant Opportunities",
    },
    {
      icon: Code,
      color: "text-orange-400",
      title: "Hackathons",
      desc: "Build & Compete Together",
    },
    {
      icon: UserCheck,
      color: "text-cyan-400",
      title: "Mentorship & Reviews",
      desc: "Portfolio & Career Guidance",
    },
  ];

  const totalSlides = Math.ceil(features.length / 3); // 3 cards per slide on mobile

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsUserInteracting(true);
    startXRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    currentXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;

    const diff = startXRef.current - currentXRef.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentSlide < totalSlides - 1) {
        setCurrentSlide((prev) => prev + 1);
      } else if (diff < 0 && currentSlide > 0) {
        setCurrentSlide((prev) => prev - 1);
      }
    }

    isDraggingRef.current = false;
    setTimeout(() => setIsUserInteracting(false), 500);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsUserInteracting(true);
    startXRef.current = e.clientX;
    isDraggingRef.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    currentXRef.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;

    const diff = startXRef.current - currentXRef.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentSlide < totalSlides - 1) {
        setCurrentSlide((prev) => prev + 1);
      } else if (diff < 0 && currentSlide > 0) {
        setCurrentSlide((prev) => prev - 1);
      }
    }

    isDraggingRef.current = false;
    setTimeout(() => setIsUserInteracting(false), 500);
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-[70vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {videosLoaded ? (
          <>
            <video
              ref={video1Ref}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-2000 ease-in-out ${
                currentVideo === "adchero1"
                  ? videoState === "transitioning-in"
                    ? "opacity-0 scale-110 skew-y-1 blur-sm"
                    : videoState === "playing"
                    ? "opacity-100 scale-100 skew-y-0 blur-0"
                    : "opacity-0 scale-95 -skew-y-1 blur-md"
                  : "opacity-0 scale-95 skew-y-2 blur-lg pointer-events-none"
              }`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src="/adchero1.mp4" type="video/mp4" />
              <source src="/adchero1.webm" type="video/webm" />
            </video>
            <video
              ref={video2Ref}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-2000 ease-in-out ${
                currentVideo === "adchero2"
                  ? videoState === "transitioning-in"
                    ? "opacity-0 scale-110 -skew-y-1 blur-sm"
                    : videoState === "playing"
                    ? "opacity-100 scale-100 skew-y-0 blur-0"
                    : "opacity-0 scale-95 skew-y-1 blur-md"
                  : "opacity-0 scale-95 -skew-y-2 blur-lg pointer-events-none"
              }`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src="/adchero2.mp4" type="video/mp4" />
              <source src="/adchero2.webm" type="video/webm" />
            </video>
          </>
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
          </div>
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/40 z-10"></div>

        {/* Additional creative overlay effects */}
        <div className="absolute inset-0 z-10 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 bg-purple-400 rounded-full animate-pulse mix-blend-screen"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-blue-400 rounded-full animate-bounce mix-blend-screen"></div>
          <div className="absolute bottom-20 left-32 w-24 h-24 bg-indigo-400 rounded-full animate-pulse mix-blend-screen"></div>
          <div className="absolute bottom-40 right-10 w-12 h-12 bg-pink-400 rounded-full animate-bounce mix-blend-screen"></div>
        </div>

        {/* Floating code elements */}
        <div className="absolute inset-0 z-10 opacity-30">
          <div className="absolute top-20 left-1/4 text-green-300 font-mono text-sm animate-pulse drop-shadow-lg">{`</>`}</div>
          <div className="absolute top-60 right-1/4 text-blue-300 font-mono text-sm animate-pulse drop-shadow-lg">{`{code}`}</div>
          <div className="absolute bottom-32 left-1/3 text-purple-300 font-mono text-sm animate-pulse drop-shadow-lg">{`function()`}</div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight drop-shadow-2xl">
            From{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Learning
            </span>
            <br /> to{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Earning
            </span>
          </h1>
        </div>

        <div className="mb-8 sm:mb-12 max-w-3xl mx-auto px-6 sm:px-0">
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed drop-shadow-lg text-center sm:text-left">
            Join a community that bridges the gap between tech
            <br className="sm:hidden" /> knowledge and career success.
          </p>
        </div>

        {/* Stats/Features - Animated with Carousel */}
        <div className="features-container">
          <div
            ref={carouselRef}
            className={`features-track ${
              isUserInteracting ? "user-interacting" : ""
            }`}
            style={{
              transform: `translateX(calc(-${currentSlide * 100}% - ${
                currentSlide * 0.5
              }rem))`,
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <f.icon
                  className={`h-6 w-6 sm:h-8 sm:w-8 ${f.color} mx-auto mb-2`}
                />
                <div className="text-white font-semibold text-sm sm:text-base">
                  {f.title}
                </div>
                <div className="text-gray-300 text-xs sm:text-sm">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel dots indicator for mobile */}
        <div className="flex justify-center mt-4 gap-2 sm:hidden">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                currentSlide === index ? "bg-purple-400" : "bg-gray-600"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
          <button className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-200 hover:shadow-lg">
            Join The Circle Now
            <ChevronRight className="h-4 w-4 inline-block ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .features-container {
          overflow: hidden;
          max-width: 900px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .features-track {
          display: flex;
          gap: 1rem;
          animation: slideLeftRight 35s ease-in-out infinite;
          cursor: grab;
          user-select: none;
        }
        .features-track:active {
          cursor: grabbing;
        }
        .features-track.user-interacting {
          animation-play-state: paused;
          transition: transform 0.3s ease-out;
        }
        .feature-card {
          flex: 0 0 calc(20% - 1rem);
          min-width: 160px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          border-radius: 0.75rem;
          padding: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: transform 0.3s;
          pointer-events: none;
        }
        .feature-card:hover {
          transform: scale(1.05);
        }
        /* Desktop animation */
        @keyframes slideLeftRight {
          0% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(0);
          }
          40% {
            transform: translateX(-50%);
          }
          60% {
            transform: translateX(-50%);
          }
          80% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(0);
          }
        }

        /* Mobile animation - shows all 7 cards */
        @keyframes slideLeftRightMobile {
          0% {
            transform: translateX(
              calc(-${currentSlide * 100}% - ${currentSlide * 0.5}rem)
            );
          }
          10% {
            transform: translateX(
              calc(-${currentSlide * 100}% - ${currentSlide * 0.5}rem)
            );
          }
          20% {
            transform: translateX(
              calc(-${currentSlide * 100}% - ${currentSlide * 0.5}rem - 31.91%)
            );
          }
          30% {
            transform: translateX(
              calc(-${currentSlide * 100}% - ${currentSlide * 0.5}rem - 31.91%)
            );
          }
          40% {
            transform: translateX(
              calc(-${currentSlide * 100}% - ${currentSlide * 0.5}rem - 60.48%)
            );
          }
          50% {
            transform: translateX(
              calc(-${currentSlide * 100}% - ${currentSlide * 0.5}rem - 60.48%)
            );
          }
          60% {
            transform: translateX(
              calc(-${currentSlide * 100}% - ${currentSlide * 0.5}rem - 89.05%)
            );
          }
          70% {
            transform: translateX(
              calc(-${currentSlide * 100}% - ${currentSlide * 0.5}rem - 89.05%)
            );
          }
          80% {
            transform: translateX(
              calc(-${currentSlide * 100}% - ${currentSlide * 0.5}rem - 117.62%)
            );
          }
          90% {
            transform: translateX(
              calc(-${currentSlide * 100}% - ${currentSlide * 0.5}rem - 117.62%)
            );
          }
          100% {
            transform: translateX(
              calc(-${currentSlide * 100}% - ${currentSlide * 0.5}rem - 150.19%)
            );
          }
        }

        @media (max-width: 640px) {
          .features-container {
            padding: 0 0.5rem;
          }
          .features-track {
            gap: 0.5rem;
            animation: none; /* Disable automatic animation on mobile when using carousel */
          }
          .features-track:not(.user-interacting) {
            animation: slideLeftRightMobile 15s linear infinite;
          }
          .feature-card {
            flex: 0 0 calc(33.333% - 0.333rem);
            min-width: unset;
            padding: 0.4rem;
            border-radius: 0.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
