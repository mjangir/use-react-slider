import React from 'react';
import { useSlider } from './Slider';
import { SlideObject } from './Slider.types';

type RenderProps = (currentSlide: SlideObject | null) => React.ReactNode;

interface SlideProps {
  children?: React.ReactNode | RenderProps;
}

const PreviousSlide: React.FC<SlideProps> = ({ children }) => {
  const { currentSlideStyle, handleSlideEnd, currentSlide } = useSlider();
  return (
    <div
      style={currentSlideStyle}
      onTransitionEnd={handleSlideEnd}
      data-testid="urs-current-slide"
    >
      {typeof children === 'function' ? children(currentSlide) : children}
    </div>
  );
};

const NextSlide: React.FC<SlideProps> = ({ children }) => {
  const { nextSlideStyle, slides, nextSlide } = useSlider();

  if (slides.length > 1) {
    return (
      <div style={nextSlideStyle} data-testid="urs-next-slide">
        {typeof children === 'function' ? children(nextSlide) : children}
      </div>
    );
  }

  return null;
};

const CurrentSlide: React.FC<SlideProps> = ({ children }) => {
  return (
    <>
      <PreviousSlide>
        {(slide: SlideObject | null) =>
          typeof children === 'function' ? children(slide) : children
        }
      </PreviousSlide>
      <NextSlide>
        {(slide: SlideObject | null) =>
          typeof children === 'function' ? children(slide) : children
        }
      </NextSlide>
    </>
  );
};

export { PreviousSlide, NextSlide, CurrentSlide };
