import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";

const VideoSwipe: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [showCatchUpMessage, setShowCatchUpMessage] = useState<boolean>(false); // 用于显示提示信息

  const videos: string[] = ["/video1.mp4", "/video2.mp4", "/video3.mp4"];

  const [isAtStart, setIsAtStart] = useState<boolean>(false);
  const [isAtEnd, setIsAtEnd] = useState<boolean>(false);

  // 滑动事件处理函数
  const handleSwipe = (direction: string) => {
    if (direction === "Up" && !isAtEnd) {
      // 滑动向上，切换到下一个视频
      setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
      setShowCatchUpMessage(false); // 重置提示
    } else if (direction === "Down" && !isAtStart) {
      // 滑动向下，切换到上一个视频
      setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
      setShowCatchUpMessage(false); // 重置提示
    } else if (direction === "Up" && isAtEnd) {
      // 已经到达最后一个视频时，不做任何操作，显示提示
      setShowCatchUpMessage(true);
    } else if (direction === "Down" && isAtStart) {
      // 已经到达第一个视频时，不做任何操作，显示提示
      setShowCatchUpMessage(true);
    }
  };

  // 使用 react-swipeable 处理滑动事件
  const handlers = useSwipeable({
    onSwipedUp: () => handleSwipe("Up"),
    onSwipedDown: () => handleSwipe("Down"),
    swipeDuration: 500,
    trackMouse: false,
  });

  useEffect(() => {
    setIsAtStart(currentIndex === 0);
    setIsAtEnd(currentIndex === videos.length - 1);
  }, [currentIndex]);

  useEffect(() => {
    setIsClient(true); // 客户端渲染完成
  }, []);

  if (!isClient) {
    return <div>Loading...</div>; // 客户端渲染前的加载状态
  }

  return (
    <div className="video-container" {...handlers}>
      {videos.map((video, index) => {
        // 当前视频在屏幕上的位置
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
              duration: 0.5, // 动画持续时间
              ease: "easeInOut", // 动画缓动
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
    </div>
  );
};

export default VideoSwipe;
