import React from 'react';
import { SliderProvider, CurrentSlide, useReactSlider } from '../src';
import { render, fireEvent, waitFor } from '@testing-library/react';

const MyCustomComponent = () => {
  return <h1>This is custom component</h1>;
};

const slides: any = [
  {
    url: 'https://i.picsum.photos/id/0/5616/3744.jpg?hmac=3GAAioiQziMGEtLbfrdbcoenXoWAW-zlyEAMkfEdBzQ',
    component: MyCustomComponent,
  },
  'https://i.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68',
  'https://i.picsum.photos/id/1000/5626/3635.jpg?hmac=qWh065Fr_M8Oa3sNsdDL8ngWXv2Jb-EE49ZIn6c0P-g',
  'https://i.picsum.photos/id/1004/5616/3744.jpg?hmac=Or7EJnz-ky5bsKa9_frdDcDCR9VhCP8kMnbZV6-WOrY',
  'https://i.picsum.photos/id/101/2621/1747.jpg?hmac=cu15YGotS0gIYdBbR1he5NtBLZAAY6aIY5AbORRAngs',
];

const RenderWithHooks = () => {
  const { navigateLeft, navigateRight, navigateToIndex, slides } =
    useReactSlider();

  return (
    <div style={{ width: '300px', height: '200px' }}>
      <SliderProvider slides={slides}>
        <CurrentSlide />
        <button
          onClick={navigateLeft}
          style={{ position: 'absolute' }}
          data-testid="prev"
        >
          Prev
        </button>
        <button
          onClick={navigateRight}
          style={{ position: 'absolute', right: 0 }}
          data-testid="next"
        >
          Next
        </button>
        <button
          onClick={() => navigateToIndex(slides.length - 1)}
          style={{ position: 'absolute', top: '100px' }}
          data-testid="jump"
        >
          Jump to last slide
        </button>
      </SliderProvider>
    </div>
  );
};

describe('Test <SliderProvider />', () => {
  it('Should render the slider properly', () => {
    const { getByTestId } = render(
      <div style={{ width: '300px', height: '200px' }}>
        <SliderProvider slides={slides}>
          <CurrentSlide />
        </SliderProvider>
      </div>
    );

    const currentSlide = getByTestId('urs-current-slide');
    const firstSlide = slides[0];
    expect(currentSlide.style.backgroundImage).toContain(firstSlide.url);
  });

  it('Should render the custom component in current slide', () => {
    const { getByTestId } = render(
      <div style={{ width: '300px', height: '200px' }}>
        <SliderProvider slides={slides}>
          <CurrentSlide>
            {(slide: any) => {
              const Renderable = slide.component;

              return Renderable ? <Renderable /> : null;
            }}
          </CurrentSlide>
        </SliderProvider>
      </div>
    );

    const currentSlide = getByTestId('urs-current-slide');

    expect(currentSlide.textContent).toContain('This is custom component');
  });

  it('Should handle slide navigations', async () => {
    const { getByTestId } = render(<RenderWithHooks />);

    const prevBtn = getByTestId(/prev/);
    const nextBtn = getByTestId(/next/);
    const jumpBtn = getByTestId(/jump/);

    fireEvent.click(nextBtn);
    const currentSlide = getByTestId('urs-current-slide');
    waitFor(() =>
      expect(currentSlide.style.backgroundImage).toContain(slides[1].url)
    );

    fireEvent.click(prevBtn);
    const currentSlide2 = getByTestId('urs-current-slide');
    waitFor(() =>
      expect(currentSlide2.style.backgroundImage).toContain(slides[0].url)
    );

    fireEvent.click(jumpBtn);
    const currentSlide3 = getByTestId('urs-current-slide');
    waitFor(() =>
      expect(currentSlide3.style.backgroundImage).toContain(slides[4].url)
    );
  });
});
