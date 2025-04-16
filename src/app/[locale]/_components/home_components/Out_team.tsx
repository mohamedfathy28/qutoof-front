"use client"
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import Slider from 'react-slick';
import ourTeamImg from '@/media/our team img1.png'
import { useTranslations } from 'next-intl';

interface ITeam {
  id?: number,
  name?: string,
  title?: string,
  content?: string,
  image?: string,
  created_at: string
}


const Out_team = () => {

  const [currentSlide, setCurrentSlide] = useState<number>(1); // Starts at 1 (first slide)
  const [totalSlides, setTotalSlides] = useState<number>(0); // Total slides count

  const sliderRef2 = useRef<Slider | null>(null);
  const next2 = () => {
    sliderRef2.current?.slickNext();
  };
  const previous2 = () => {
    sliderRef2.current?.slickPrev();
  };

  const [data, setData] = useState<ITeam[] | undefined>([]);

      const t = useTranslations("HomePage");
  

  useEffect(() => {
      const fetchData = async () => {

        const direction = typeof window !== "undefined" && localStorage.getItem("direction");

          const myHeaders = new Headers();
          myHeaders.append("Accept-Language", direction=='ltr'? "en" : "ar");
          try {
              const response = await fetch('https://quttouf.com/api/user/teams',{
                headers:myHeaders
              });
              const result = await response.json();
              setData(result.data);
              console.log(result.data[0]);
              setTotalSlides(result.data.length); // Set total slides count
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };

      fetchData();
  }, []); // Empty dependency array ensures this runs only once after the component mounts


  const settings2 = {
    dots: false,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false,
    afterChange: (index: number) => {
      setCurrentSlide(index + 1)
    }, // Update current slide number
  };

  if (data?.length == 0) return null

  return (
    <div className='py-16 mb-20 md:mb-32 bg-[#F7FAF1]'>
      <div className="relative mx-auto max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
        <div className='text-center mb-12'>
          <h6 data-aos="fade-up" data-aos-duration="500" data-aos-delay="0" className='text-[#009444] font-bold text-[16px]'>{t("OurTeam")}</h6>
          <h2 data-aos="fade-zoom-in" data-aos-duration="500" data-aos-delay="0" className='text-[26px] md:text-[40px] text-[#252525] font-[500]'>&quot;{t("ExploreInvest")}&quot;</h2>
        </div>

        <Slider ref={sliderRef2} {...settings2} className='ourteam-slider'>
          {data && data.map(data => <div key={data.id}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Image src={data.image ? data.image : ourTeamImg} alt='our team' width={100} height={100}  className='w-full h-auto rounded-[8px]' />
              <div className='flex flex-col justify-between'>
                <div>
                  <p className='text-[20px] md:text-[24px] font-[400] text-[#363636] mb-8 line-clamp-[9]'>{data?.content}</p>
                  <h6 className='text-[32px] font-[500] text-[#252525] mb-4'>{data?.name  }</h6>
                  <span className='text-[#656565] text-[20px] font-[400]'>{data?.title }</span>
                </div>

                <div className='flex items-center justify-between'>
                  <span>{currentSlide} /  {totalSlides}</span>
                  {/* <span>{data ? (new Date(data.created_at as string).getMonth() + 1).toString().padStart(2, '0') : ""} / {data ? new Date(data.created_at as string).getFullYear():""}</span> */}
                </div>
              </div>
            </div>
          </div>)}
        </Slider>

        <div className='flex gap-2 absolute bottom-0 right-0'>
          <span className='rtl:rotate-180 w-12 h-12 bg-[#E5EDD3]  flex justify-center items-center' onClick={previous2}>
            <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 2L1.5 8L7.5 14" stroke="#949494" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className='rtl:rotate-180 w-12 h-12 bg-[#E5EDD3] flex justify-center items-center' onClick={next2}>
            <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 14L7.5 8L1.5 2" stroke="#536728" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Out_team