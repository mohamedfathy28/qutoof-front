import React, { useEffect, useState } from 'react'
import contactUs from '@/media/contactUs-img.png'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface AboutResponse {
    title: string,
    content : string,
    image: string,
  }

const About = () => {

    const [data, setData] = useState<AboutResponse | null>(null);

    const t = useTranslations("HomePage");


    useEffect(() => {
        const fetchData = async () => {

          const direction = typeof window !== "undefined" && localStorage.getItem("direction");

        const myHeaders = new Headers();
        myHeaders.append("Accept-Language", direction=='ltr'? "en" : "ar");

          try {
            const response = await fetch('https://quttouf.com/api/user/about',{
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

      if (data?.title == '' && data?.content == ''  ) return null


  return (
    <div className={'py-20 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl'}>
    <div className=''>
      <Image data-aos="zoom-out" data-aos-duration="500" data-aos-delay="0"    width={500}
             height={300}  src={(data?.image)??contactUs}  alt='contact us' />
    </div>
    <div className=' flex flex-col gap-8'>
      <h6 data-aos="fade-left" data-aos-duration="500" data-aos-delay="0" className='text-[#009444] font-bold text-[16px] ltr:pl-4 ltr:border-l-[3px] rtl:pr-4 rtl:border-r-[3px] border-[#E5EDD3]'>{t("AboutQuttouf")}</h6>
      <h2 data-aos="fade-left" data-aos-duration="500" data-aos-delay="0" className='text-[28px] md:text-[40px] text-[#252525] font-bold ltr:pl-4 rtl:pr-4'>{data?.title}</h2>
      <p data-aos="fade-left" data-aos-duration="500" data-aos-delay="0" className='text-[18px] text-[#656565] leading-[30px] ltr:pl-4 ltr:border-l-[3px] rtl:pr-4 rtl:border-r-[3px] border-[#E5EDD3]'>{data?.content}</p>
    </div>
  </div>
  )
}

export default About