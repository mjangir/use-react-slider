# use-react-slider
Build custom slideshows with react hooks without the tears 😭!

`use-react-slider` is headless library to build the customized sliders using react hooks. The most fundamental concept of this library is to provide logic, state, processing and APIs for UI elements but not to provide **markups, styles or prebuilt implementations**. You build the markups, `use-react-slider` will take care of under the hood state management and events.

## How To Install

Install the package from npm or yarn registry.

### Install From Yarn

```bash
yarn add use-react-slider
```

### Install From NPM

```bash
npm install use-react-slider --save
```

## How To Use?

Import `SliderProvider` and `CurrentSlide` components, provide necessary props to the Provider and render the `CurrentSlide` as its children. That will render a slideshow playing in autoplay mode with 2 seconds of delay.

```
import {SliderProvider, CurrentSlide} from 'use-react-slider';

const slides = [
    'image1.jpg',
    'image2.jpg'
];

<SliderProvider slides={slides}>
    <CurrentSlide />
</SliderProvider>
```

## useReactSlider

`useReactSlider` lets you control the behaviour of the slider component with your custom markups. It provides the following functions and properties:

| Function/Property      | Usage |
| ----------------- | ----------- |
| navigateLeft      | Navigate to previous slide       |
| navigateRight     | Navigate to next slide        |
| navigateToIndex   | Jump to a particular slide index (starting from 0)        |
| handleSlideClick  | Click handler for a slide        |
| slides            | Original slides array        |

## useReactSlider Example

```
import {SliderProvider, CurrentSlide, useReactSlider} from 'use-react-slider';

const slides = [
    'image1.jpg',
    'image2.jpg'
];

function CustomSliderBody() {
    const { navigateLeft, navigateRight, navigateToIndex, slides } = useReactSlider();

    return (
        <>
            <CurrentSlide />
            <button onClick={navigateLeft}>Previous</button>
            <button onClick={navigateRight}>Next</button>
            <button onClick={() => navigateToIndex(slides.length - 1)}>Jump to last slide</button>
        </>
    );
}

<SliderProvider slides={slides}>
    <CurrentSlide />
</SliderProvider>
```

## Render custom react component over the image

```
import {SliderProvider, CurrentSlide} from 'use-react-slider';

const slides = [
    {
        url: 'image1.jpg',
        component: MyCustomComponent
    },
    'image2.jpg'
];


const MyCustomComponent = () => (
  <div style={{ color: 'white' }}>
    <h1>This is my custom component</h1>
  </div>
);

const renderComponent = (slide) => {
    const Renderable = slide.component;
    return Renderable ? <Renderable /> : null
}


function CustomSliderBody() {
    const { navigateLeft, navigateRight, navigateToIndex, slides } = useReactSlider();

    return (
        <>
            <CurrentSlide>
                {renderComponent}
            </CurrentSlide>
            <button onClick={navigateLeft}>Previous</button>
            <button onClick={navigateRight}>Next</button>
            <button onClick={() => navigateToIndex(slides.length - 1)}>Jump to last slide</button>
        </>
    );
}

<SliderProvider slides={slides}>
    <CurrentSlide />
</SliderProvider>
```

## SliderProvider props

### slides (default: [])

`slides` is an array of strings (image urls) or objects containing the slide info. By default, the slider will try to use the whole slide element as image url if it is a string. If `getImageUrlFromSlide` has been provided, the slider will try to get the image url by passing the slide object as params to it. If the getter function is also not provided, the slider will look for `url` property on the object. Getting the image url still undefined will sliently render an empty slide.


### startIndex (default: 0)

The default slide we want to render on component mount. The index starts from 0.


### autoPlay (default: true)

Run the slider in autoplay mode with a delay provided in `autoPlayDelay` prop.


### autoPlayDelay (default: 2s)

Provide the delay in seconds between 2 slides when running the slider in `autoPlay` mode. The default value is 2 seconds.

### duration (default: 0.5s)

Provide the duration in seconds a slide should take to complete the sliding animation. The default value is half a second.

### onSlideClick

Provide an `onClick` handler to call on click of the current slide. The `slide` object will be passed as params in this function.

### getImageUrlFromSlide

This function is useful if the slides is an array of slide objects. When rendering the slide image, the slider will pass the slide object in it and it must return the correct image url.

## Maintainers

[Manish Jangir](https://github.com/mjangir)