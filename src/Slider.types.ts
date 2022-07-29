import React from 'react';

export type SlideObject = { [key: string]: any } | string;

export type SlidesArray = SlideObject[];

export interface SliderProviderProps {
  children: React.ReactNode | React.ReactNode[];
  slides: SlidesArray;
  startIndex?: number;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  duration?: number;
  onSlideClick?: (slideIdx: number, event: React.SyntheticEvent) => void;
  getImageUrlFromSlide?: (slide: SlideObject) => string;
}

export interface SliderContextValue {
  currentSlideStyle: React.CSSProperties;
  nextSlideStyle: React.CSSProperties;
  navigateLeft: () => void;
  navigateRight: () => void;
  navigateToIndex: (idx: number) => void;
  handleSlideEnd: () => void;
  handleSlideClick: (event: React.SyntheticEvent) => void;
  slides: SlidesArray;
  currentSlide: SlideObject | null;
  nextSlide: SlideObject | null;
}

export interface UseSlideIndexParam {
  slideCount: number;
  startIndex: number;
  autoPlay: boolean;
  autoPlayDelay: number;
}

export interface UseSlideIndexValue {
  slideIdx: number;
  updateSlideIdx: (idx: number) => void;
  getNextLoopingIdx: (idx: number) => number;
  isRightDirection: boolean;
  previousSlideIdx: number;
}

export type URLObject = {
  url: string;
};
