import React from "react";
import { UseSlideIndexParam, UseSlideIndexValue } from "./Slider.types";

const useSlideIndex = ({
  slideCount,
  startIndex,
  autoPlay,
  autoPlayDelay,
}: UseSlideIndexParam): UseSlideIndexValue => {
  const [slideIdx, setSlideIdx] = React.useState(
    startIndex < slideCount ? startIndex : 0
  );

  const isRightDirectionRef = React.useRef(true);
  const previousSlideIdxRef = React.useRef(slideIdx);
  const autoPlayTimerRef = React.useRef<any>(null);

  const getNextLoopingIdx = React.useCallback(
    (idx: number) => {
      if (idx >= slideCount) {
        return 0;
      } else if (idx < 0) {
        return slideCount - 1;
      }

      return idx;
    },
    [slideCount]
  );

  const updateSlideIdx = React.useCallback(
    (idx: number) => {
      isRightDirectionRef.current = idx > slideIdx;
      previousSlideIdxRef.current = slideIdx;
      setSlideIdx(getNextLoopingIdx(idx));
    },
    [getNextLoopingIdx, slideIdx]
  );

  const setAutoPlayTimeout = React.useCallback(
    (idx: number) => {
      if (!autoPlay || autoPlayTimerRef.current) {
        return;
      }
      autoPlayTimerRef.current = setTimeout(() => {
        updateSlideIdx(idx);
      }, autoPlayDelay * 1000);
    },
    [autoPlay, autoPlayDelay, updateSlideIdx]
  );

  const removeAutoPlayTimeout = () => {
    if (autoPlayTimerRef.current !== null) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  };

  React.useEffect(() => {
    removeAutoPlayTimeout();
    setAutoPlayTimeout(slideIdx + 1);
    return removeAutoPlayTimeout;
  }, [slideIdx, setAutoPlayTimeout]);

  return {
    slideIdx,
    updateSlideIdx,
    getNextLoopingIdx,
    isRightDirection: isRightDirectionRef.current,
    previousSlideIdx: previousSlideIdxRef.current,
  };
};

export { useSlideIndex };
