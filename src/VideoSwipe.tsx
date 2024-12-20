import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";

const VideoSwipe: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [showCatchUpMessage, setShowCatchUpMessage] = useState<boolean>(false);
  const [showFirstVideoMessage, setShowFirstVideoMessage] =
    useState<boolean>(false);
  const videos: string[] = ["/video1.mp4", "/video2.mp4", "/video3.mp4"];

  const [isAtStart, setIsAtStart] = useState<boolean>(false);
  const [isAtEnd, setIsAtEnd] = useState<boolean>(false);

  const handleSwipe = (direction: string) => {
    if (direction === "Up" && !isAtEnd) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
      setShowCatchUpMessage(false);
      setShowFirstVideoMessage(false);
    } else if (direction === "Down" && !isAtStart) {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + videos.length) % videos.length
      );
      setShowCatchUpMessage(false);
      setShowFirstVideoMessage(false);
    } else if (direction === "Up" && isAtEnd) {
      setShowCatchUpMessage(true);
    } else if (direction === "Down" && isAtStart) {
      console.log("Down to first video");
      if (window.pictorialWebApi) {
        window.pictorialWebApi.setCanSlideDownToClose(true);
      }
      setShowFirstVideoMessage(true);
    }
  };

  const handlers = useSwipeable({
    onSwipedUp: () => handleSwipe("Up"),
    onSwipedDown: () => handleSwipe("Down"),
    swipeDuration: 500,
    trackMouse: false,
  });

  useEffect(() => {
    setIsAtStart(currentIndex === 0);
    setIsAtEnd(currentIndex === videos.length - 1);

    if (currentIndex === 0) {
      console.log("First Video");
      if (window.pictorialWebApi) {
        window.pictorialWebApi.setCanSlideDownToClose(true);
      }
      setShowFirstVideoMessage(true);

      // 设置2秒后自动隐藏提示
      const timer = setTimeout(() => {
        setShowFirstVideoMessage(false);
      }, 2000);

      // 清理定时器
      return () => clearTimeout(timer);
    } else {
      if (window.pictorialWebApi) {
        window.pictorialWebApi.setCanSlideDownToClose(false);
      }
      setShowFirstVideoMessage(false);
    }
  }, [currentIndex]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="video-container" {...handlers}>
      {videos.map((video, index) => {
        const offset = index - currentIndex;

        return (
          <motion.div
            key={index}
            className={`video-item ${index === currentIndex ? "active" : ""}`}
            initial={{ opacity: 0, y: "100%" }} // 初始位置从下方
            animate={{
              opacity: index === currentIndex ? 1 : 0,
              y: offset === 0 ? 0 : offset > 0 ? "100%" : "-100%", // 控制视频的 Y 位移
            }}
            exit={{
              opacity: 0,
              y: offset < 0 ? "100%" : "-100%", // 离开时控制滑动方向
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "black",
            }}
          >
            <video
              src={video}
              muted
              loop
              autoPlay
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </motion.div>
        );
      })}

      {showCatchUpMessage && (
        <div className="catch-up-message">All catch up!</div>
      )}

      {showFirstVideoMessage && (
        <div className="first-video-message">This is the first video!</div>
      )}
    </div>
  );
};

export default VideoSwipe;
