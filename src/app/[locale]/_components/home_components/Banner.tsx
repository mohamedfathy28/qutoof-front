'use client'
import React, { useEffect, useState } from 'react'
import Button from '../button/Button'
import { useRouter } from '@/i18n/routing'
import Image from 'next/image'

import BlogImg from '@/media/our blog img 1.png'
import { useTranslations } from 'next-intl'

interface BannerResponse {
    title: string,
    content : string,
    image : string
  }

const Banner = () => {

    const [data, setData] = useState<BannerResponse | null>(null);

    const router = useRouter()

    const t = useTranslations("HomePage");


    useEffect(() => {
        const fetchData = async () => {
          const direction = typeof window !== "undefined" && localStorage.getItem("direction");

          const myHeaders = new Headers();
          myHeaders.append("Accept-Language", direction=='ltr'? "en" : "ar");
          try {
            const response = await fetch('http://localhost/quttouf-backend/api/user/main-banners',{
              headers:myHeaders
            });
            const result = await response.json();
            console.log(result.data[0]);
            setData(result.data[0]);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []); // Empty dependency array ensures this runs only once after the component mounts
    
      if (data?.title == '' && data?.content == '' && data?.image == '') return null


  return (
    <div className="relative">
    <Image src={data ? data.image : ""} alt='hero img' width={100} height={100} className='h-[80vh] md:h-[100vh] w-full object-cover' />
    
    <div className='absolute top-0 left-0 w-full h-full z-10 bg-black/30'>
      <div className={' h-full flex flex-col gap-4 justify-center items-start mx-auto max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl'}>
        <h1 data-aos="fade-right" data-aos-duration="500" data-aos-delay="0" className='text-[#fff] text-[50px] md:text-[80px] font-[400] leading-[35px] md:leading-[65px] font-[Mansalva]' >{data?.title}</h1>
        <p data-aos="fade-right" data-aos-duration="500" data-aos-delay="300" className='rtl:text-right text-[22px] font-[400] leading-[25px] text-white mb-6'>{data?.content}</p>
        <Button onClick={()=>router.push("/market")} className='px-4' data-aos="fade-right" data-aos-duration="500" data-aos-delay="600" data-aos-offset="0">{t("DiscoverMore")}</Button>
      </div>

    </div>
  </div>
  )
}

export default Banner