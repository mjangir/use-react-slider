import React from 'react';
import {
  SliderProviderProps,
  SliderContextValue,
  SlideObject,
} from './Slider.types';
import { useSlideIndex } from './useSlideIndex';
import { getSlideStyle } from './utils';
import ImageSliderPreLoader from './ImageSliderPreLoader';

const defaultContextValue = {
  currentSlideStyle: {},
  nextSlideStyle: {},
  navigateLeft: () => {},
  navigateRight: () => {},
  navigateToIndex: () => {},
  handleSlideEnd: () => {},
  handleSlideClick: () => {},
  slides: [],
  currentSlide: null,
  nextSlide: null,
};

const SliderContext =
  React.createContext<SliderContextValue>(defaultContextValue);

const SliderProvider: React.FC<SliderProviderProps> = ({
  children,
  slides,
  startIndex = 0,
  autoPlay = true,
  autoPlayDelay = 2,
  duration = 0.5,
  onSlideClick,
  getImageUrlFromSlide,
}) => {
  const slideCount = slides.length;
  const {
    slideIdx,
    updateSlideIdx,
    isRightDirection,
    getNextLoopingIdx,
    previousSlideIdx,
  } = useSlideIndex({
    slideCount,
    startIndex,
    autoPlay,
    autoPlayDelay: autoPlayDelay + duration,
  });

  const getSlideImageUrl = (idx: number): string => {
    const slide = slides[idx] as SlideObject;

    if (typeof slide === 'string') {
      return slide;
    }

    if (getImageUrlFromSlide) {
      return getImageUrlFromSlide(slides[idx]);
    }

    return slide?.url;
  };

  const [currentSlideStyle, setCurrentSlideStyle] = React.useState(
    getSlideStyle(getSlideImageUrl(startIndex), duration, 0)
  );
  const [nextSlideStyle, setNextSlideStyle] = React.useState(
    getSlideStyle(getSlideImageUrl(startIndex + 1), duration, 1)
  );

  const isSlidingRef = React.useRef(false);

  const navigateLeft = React.useCallback(() => {
    if (isSlidingRef.current) {
      return;
    }
    updateSlideIdx(slideIdx - 1);
  }, [updateSlideIdx, slideIdx]);

  const navigateRight = React.useCallback(() => {
    if (isSlidingRef.current) {
      return;
    }
    updateSlideIdx(slideIdx + 1);
  }, [updateSlideIdx, slideIdx]);

  const navigateToIndex = React.useCallback(
    (idx: number) => {
      if (idx === slideIdx || isSlidingRef.current) {
        return;
      }

      updateSlideIdx(idx);
    },
    [slideIdx, updateSlideIdx]
  );

  const handleSlideClick = React.useCallback(
    (event: React.SyntheticEvent) => {
      onSlideClick?.(slideIdx, event);
    },
    [slideIdx, onSlideClick]
  );

  React.useEffect(() => {
    if (slideIdx === previousSlideIdx) {
      return;
    }

    const currentUrl: string = getSlideImageUrl(
      getNextLoopingIdx(isRightDirection ? slideIdx - 1 : slideIdx + 1)
    );
    const nextUrl: string = getSlideImageUrl(slideIdx);
    const currentOffsetX: 1 | -1 = isRightDirection ? -1 : 1;
    const nextReadyOffsetX: 1 | -1 = isRightDirection ? 1 : -1;

    setNextSlideStyle(getSlideStyle(nextUrl, 0, nextReadyOffsetX));
    setTimeout(() => {
      isSlidingRef.current = true;
      setCurrentSlideStyle(getSlideStyle(currentUrl, duration, currentOffsetX));
      setNextSlideStyle(getSlideStyle(nextUrl, duration, 0));
    }, 50);
  }, [
    slideIdx,
    previousSlideIdx,
    getNextLoopingIdx,
    isRightDirection,
    slides,
    duration,
  ]);

  const handleSlideEnd = React.useCallback(() => {
    isSlidingRef.current = false;
    ImageSliderPreLoader.load(getSlideImageUrl(slideIdx + 2));
    setCurrentSlideStyle(getSlideStyle(getSlideImageUrl(slideIdx), 0, 0));
  }, [slideIdx, slides]);

  const finalContextValue = {
    currentSlideStyle,
    nextSlideStyle,
    navigateLeft,
    navigateRight,
    navigateToIndex,
    handleSlideEnd,
    handleSlideClick,
    slides,
    currentSlide: slides[previousSlideIdx],
    nextSlide: slides[slideIdx],
  };

  return (
    <SliderContext.Provider value={finalContextValue}>
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </div>
    </SliderContext.Provider>
  );
};

const useSlider = () => {
  const context = React.useContext(SliderContext);

  if (context === undefined) {
    throw new Error('useSlider must be used inside of SliderContext');
  }

  return context;
};

const useReactSlider = () => {
  const context = React.useContext(SliderContext);

  if (context === undefined) {
    throw new Error('useSlider must be used inside of SliderContext');
  }

  const {
    navigateLeft,
    navigateRight,
    navigateToIndex,
    handleSlideClick,
    slides,
  } = context;

  return {
    navigateLeft,
    navigateRight,
    navigateToIndex,
    handleSlideClick,
    slides,
  };
};

export { SliderProvider, useSlider, useReactSlider };
