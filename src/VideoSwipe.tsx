import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";

const VideoSwipe: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isClient, setIsClient] = useState<boolean>(false); 

  const videos: string[] = ["/video1.mp4", "/video2.mp4", "/video3.mp4"];

  // 是否已经滑动到第一个或最后一个视频
  const [isAtStart, setIsAtStart] = useState<boolean>(false);
  const [isAtEnd, setIsAtEnd] = useState<boolean>(false);

  // 滑动事件处理函数
  const handleSwipe = (direction: string) => {
    if (direction === "Up" && !isAtEnd) {
      // 向上滑动，切换到下一个视频
      setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
    } else if (direction === "Down" && !isAtStart) {
      // 向下滑动，切换到上一个视频
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + videos.length) % videos.length
      );
    }
  };

  // 使用 react-swipeable 处理滑动事件
  const handlers = useSwipeable({
    onSwipedUp: () => handleSwipe("Up"),
    onSwipedDown: () => handleSwipe("Down"),
    swipeDuration: 500,
    trackMouse: false,
  });

  // 监听当前视频的索引，更新是否达到边界状态
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
      {/* 黑色背景显示 */}
      {isAtStart && (
        <div className="black-background"></div> // 当到达第一个视频时显示背景
      )}

      {videos.map((video, index) => (
        <motion.div
          key={index}
          className={`video-item ${index === currentIndex ? "active" : ""}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentIndex ? 1 : 0 }}
          transition={{ duration: 0.5 }}
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
            autoPlay={index === currentIndex}
            muted
            loop
            style={{
              width: "100%",
              height: "100%",
              //   objectFit: "cover",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default VideoSwipe;
