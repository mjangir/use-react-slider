import React from 'react';
import { URLObject, SlidesArray } from './Slider.types';

const getSlideStyle = (
  image: string,
  duration: number,
  idx: number
): React.CSSProperties => {
  return {
    display: 'block',
    position: 'absolute',
    margin: '0',
    padding: '0',
    border: '0',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    transition: `${duration}s`,
    transform: `translate3d(${idx * 100}%, 0px, 0px)`,
    ...(image
      ? { backgroundImage: `url(${image})`, backgroundSize: '100% 100%' }
      : {}),
  } as React.CSSProperties;
};

const getSlideImageUrl = (images: SlidesArray, index: number) => {
  return (images as URLObject[])[index]?.url || (images as string[])[index];
};

export { getSlideStyle, getSlideImageUrl };
