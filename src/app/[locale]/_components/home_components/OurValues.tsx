"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import ourValuesimg1 from '@/media/our values img1.png'
import ourValuesimg2 from '@/media/our values img2.png'
import ourValuesimg3 from '@/media/our values img3.png'
import { useTranslations } from 'next-intl'


interface IValue {
    id: number,
    name: string,
    title: string,
    content: string,
    image: string,
    created_at: string
}

const OurValues = () => {

    const [data, setData] = useState<IValue[] | undefined>();

    const t = useTranslations("HomePage");


    useEffect(() => {
        const fetchData = async () => {

          const direction = typeof window !== "undefined" && localStorage.getItem("direction");

          const myHeaders = new Headers();
          myHeaders.append("Accept-Language", direction=='ltr'? "en" : "ar");
            try {
                const response = await fetch('http://localhost/quttouf-backend/api/user/values',{
                  headers:myHeaders
                });
                const result = await response.json();
                setData(result.data);
                console.log(result.data[0]);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures this runs only once after the component mounts



  return (
    <div className="mx-auto max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mb-20 md:mb-32">
    <div className='text-center mb-12'>
      <h6 data-aos="fade-up" data-aos-duration="500" data-aos-delay="0" className='text-[#009444] font-bold text-[16px]'>{t("OurValues")}</h6>
      <h2 data-aos="fade-zoom-in" data-aos-duration="500" data-aos-delay="0" className='text-[26px] md:text-[40px] text-[#252525] font-[500]'>{t("EmpoweringTrust")}</h2>
    </div>

    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
      <div data-aos="fade-right" data-aos-duration="500" data-aos-delay="0" className={'rounded-[20px] flex flex-col items-center justify-center gap-8 p-12 bg-gradient-to-b from-[#47c58232] to-[#00944400]'}>
        <Image src={ourValuesimg1} width={60} height={60} alt='our values' />
        <h5 className='text-center text-[22px] text-[#0A200C] font-[400]'>{data? data[0]?.title : ""}</h5>
        <p className='text-[#363636] text-[14px] text-justify'>{data? data[0]?.content : ""}</p>
      </div>
      <div data-aos="fade-up" data-aos-duration="500" data-aos-delay="0" className={'bg-[#009444] rounded-[20px] flex flex-col items-center justify-center gap-8 p-12'}>
      <Image src={ourValuesimg2} width={60} height={60} alt='our values' />
      <h5 className='text-center text-[22px] text-[#fff] font-[400]'>{data? data[1]?.title : ""}</h5>
        <p className='text-[#fff] text-[14px] text-justify'>{data? data[1]?.content : ""}</p>
      </div>
      <div data-aos="fade-left" data-aos-duration="500" data-aos-delay="0" className={'rounded-[20px] flex flex-col items-center justify-center gap-8 p-12 bg-gradient-to-b from-[#47c58232] to-[#00944400]'}>
      <Image src={ourValuesimg3} width={60} height={60} alt='our values' />
      <h5 className='text-center text-[22px] text-[#0A200C] font-[400]'>{data? data[2]?.title : ""}</h5>
        <p className='text-[#363636] text-[14px] text-justify'>{data? data[2]?.content : ""}</p>
      </div>
    </div>
  </div>
  )
}

export default OurValues