'use client'
import React from 'react';
import Slider from 'react-slick';
import Image, { StaticImageData } from 'next/image';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ImageSliderProps {
  images: {
    src: string | StaticImageData;
    alt: string;
  }[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  // Settings for the main slider
  const mainSettings = {
    dots: false,
    infinite: true,
    fade: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    asNavFor: undefined // This will be linked to nav slider
  };

  // Settings for the navigation slider
  const navSettings = {
    dots: false,
    infinite: true,
    speed: 200,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    centerMode: false,
    focusOnSelect: true,
    asNavFor: undefined, // This will be linked to main slider
    // responsive: [
    //   {
    //     breakpoint: 768,
    //     settings: {
    //       slidesToShow: 3,
    //     }
    //   },
    //   {
    //     breakpoint: 480,
    //     settings: {
    //       slidesToShow: 3,
    //     }
    //   }
    // ]
  };

  // Create refs for the sliders
  const [mainSlider, setMainSlider] = React.useState<Slider | null>(null);
  const [navSlider, setNavSlider] = React.useState<Slider | null>(null);

  return (
    <div className="w-full SectorImgsPreview">
      {/* Main Slider */}
      <div className="mb-2">
        <Slider
          {...mainSettings}
          ref={(slider) => setMainSlider(slider)}
          asNavFor={navSlider || undefined}
        >
          {images.map((image, index) => (
            <div key={index} className="relative h-[400px] lg:h-[600px]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover rounded-[4px]"
                priority={index === 0}
            />
            </div>
          ))}
        </Slider>
      </div>

      {/* Navigation Slider */}
      <div className="">
        <Slider
          {...navSettings}
          ref={(slider) => setNavSlider(slider)}
          asNavFor={mainSlider || undefined}
        >
          {images.map((image, index) => (
            <div key={index} className="px-1">
              <div className="relative h-24">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover rounded-[4px]"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ImageSlider;