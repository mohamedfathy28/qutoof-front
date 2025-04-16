"use client"
import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../../_components/breadcrumb/breadcrumb'
import panner from '@/media/plog-details-img.png'
import Image from 'next/image'
import BlogCard from '../../../_components/articleCard/BlogCard'
import { useTranslations } from 'next-intl'


interface IProps {
    blogId:number
}

interface IBlog {
    id: number,
    name: string,
    title: string,
    content: string,
    image: string,
    video: string,
    created_at: string
}

const BlogDetails = ({blogId}:IProps) => {


      const [data, setData] = useState<IBlog>();
      const [Blogs, setBlogs] = useState<IBlog[]>();

        const t = useTranslations("HomePage");
      
    
      useEffect(() => {
    
    
        const fetchData = async () => {

          const direction = typeof window !== "undefined" && localStorage.getItem("direction");

          const myHeaders = new Headers();
          myHeaders.append("Accept-Language", direction=='ltr'? "en" : "ar");
          try {
            const response = await fetch(`https://quttouf.com//api/user/blogs/${blogId}`,{
              headers:myHeaders
            });
            const result = await response.json();
            setData(result.data);
    
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };

        const fetchBlogs = async () => {
          const direction = typeof window !== "undefined" && localStorage.getItem("direction");

          const myHeaders = new Headers();
          myHeaders.append("Accept-Language", direction=='ltr'? "en" : "ar");
          try {
            const response = await fetch('https://quttouf.com//api/user/blogs',{
              headers:myHeaders
            });
            const result = await response.json();
            setBlogs(result.data);
    
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
        fetchBlogs();
      },[blogId]); // Empty dependency array ensures this runs only once after the component mounts
    

      let day, month, year;

      // Safely parse the date only if `created_at` is valid
      if (data?.created_at) {
        const date = new Date(data.created_at);
        if (!isNaN(date.getTime())) { // Check if date is valid
          day = date.getDate();
          month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date); // Jan, Feb, etc.
          year = date.getFullYear();
        }
      }

  return (
    <>
        <Breadcrumb
        items={[
          { label: t("OurBlog"), href: '/news-articles' },
          { label: data?.title , href: `/news-articles/${data?.id}` },
        ]}
      />

      <div className="mx-auto max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl my-20 md:my-32 space-y-20 lg:space-y-32">
        <div className='grid grid-cols-3 gap-8 lg:gap-16'>
          <div className='col-span-3 lg:col-span-2'>
            <div className='w-full relative'>
            <Image src={data?.image ? data?.image : panner} alt='user' width={100} height={100} className='w-full h-auto' />
            <span className='absolute bottom-6 left-6 px-6 py-3 rounded-[10px] text-white bg-[#009444] text-[14px] font-[600]'>{day} {month} {year}</span>
            </div>
            {/*<div className='flex items-center gap-6 my-3'>*/}
            {/*  <div className='flex items-center gap-1'>*/}
            {/*    <svg width="15" height="16" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
            {/*      <path d="M6.295 0.704922C7.16649 0.704922 7.98297 0.869912 8.74447 1.19989C9.50596 1.52987 10.1723 1.98042 10.7434 2.55154C11.3145 3.12266 11.765 3.78896 12.095 4.55046C12.425 5.31195 12.59 6.12844 12.59 6.99992C12.59 7.87141 12.425 8.6879 12.095 9.44939C11.765 10.2109 11.3145 10.8772 10.7434 11.4483C10.1723 12.0194 9.50596 12.47 8.74447 12.8C7.98297 13.1299 7.16649 13.2949 6.295 13.2949C5.42351 13.2949 4.60703 13.1299 3.84553 12.8C3.08404 12.47 2.41774 12.0194 1.84662 11.4483C1.2755 10.8772 0.82495 10.2109 0.49497 9.44939C0.16499 8.6879 0 7.87141 0 6.99992C0 6.12844 0.16499 5.31195 0.49497 4.55046C0.82495 3.78896 1.2755 3.12266 1.84662 2.55154C2.41774 1.98042 3.08404 1.52987 3.84553 1.19989C4.60703 0.869912 5.42351 0.704922 6.295 0.704922ZM6.295 3.1417C5.67735 3.1417 5.15065 3.35957 4.7149 3.79531C4.27916 4.23105 4.06129 4.75775 4.06129 5.37541C4.06129 5.99306 4.27916 6.51976 4.7149 6.9555C5.15065 7.39124 5.67735 7.60912 6.295 7.60912C6.91265 7.60912 7.43935 7.39124 7.8751 6.9555C8.31084 6.51976 8.52871 5.99306 8.52871 5.37541C8.52871 4.75775 8.31084 4.23105 7.8751 3.79531C7.43935 3.35957 6.91265 3.1417 6.295 3.1417ZM6.295 11.8735C6.66728 11.8735 7.02688 11.8312 7.37378 11.7466C7.72914 11.6704 8.06335 11.5562 8.37641 11.4039C8.68947 11.2516 8.98561 11.0697 9.26482 10.8581C9.54403 10.6466 9.79363 10.4097 10.0136 10.1474C9.77671 9.69899 9.43615 9.33305 8.99195 9.0496C8.54775 8.76616 8.05489 8.62444 7.51339 8.62444C7.47954 8.62444 7.44781 8.62655 7.4182 8.63078C7.38859 8.63501 7.36109 8.64136 7.33571 8.64982C7.16649 8.70059 6.99515 8.74289 6.8217 8.77674C6.64825 8.81058 6.47268 8.8275 6.295 8.8275C6.11732 8.8275 5.94175 8.81058 5.7683 8.77674C5.59485 8.74289 5.42351 8.70059 5.25429 8.64982C5.22891 8.64136 5.20141 8.63501 5.1718 8.63078C5.14219 8.62655 5.11046 8.62444 5.07661 8.62444C4.53511 8.62444 4.04225 8.76616 3.59805 9.0496C3.15385 9.33305 2.81329 9.69899 2.57638 10.1474C2.79637 10.4097 3.04597 10.6466 3.32518 10.8581C3.6044 11.0697 3.90053 11.2516 4.21359 11.4039C4.52665 11.5562 4.86086 11.6704 5.21622 11.7466C5.56312 11.8312 5.92272 11.8735 6.295 11.8735Z" fill="#EEC044" />*/}
            {/*    </svg>*/}
            {/*    <span className='text-[14px] text-[#878680] font-[500]'>{t("by")} {data?.name}</span>*/}
            {/*  </div>*/}
            {/*  /!*<div className='flex items-center gap-1'>*!/*/}
            {/*  /!*  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">*!/*/}
            {/*  /!*    <path d="M11.5415 4.37445C11.5415 4.93324 11.4018 5.46239 11.1224 5.96191C10.8515 6.45296 10.4769 6.88263 9.99853 7.25092C9.52017 7.61921 8.95927 7.90919 8.31582 8.12085C7.67237 8.33251 6.98659 8.43834 6.25848 8.43834C5.74203 8.43834 5.24462 8.38331 4.76627 8.27325C4.28792 8.16318 3.84131 8.00655 3.42646 7.80336C3.15553 7.96422 2.82957 8.11027 2.44858 8.2415C2.06759 8.37273 1.64427 8.43834 1.17862 8.43834C1.13629 8.43834 1.09819 8.42776 1.06432 8.40659C1.03046 8.38543 1.00506 8.35368 0.988124 8.31135C0.971191 8.27748 0.966958 8.23938 0.975425 8.19705C0.983891 8.15472 1.00082 8.12085 1.02622 8.09545C1.03469 8.09545 1.14687 7.95999 1.36276 7.68906C1.57866 7.41814 1.77127 7.09218 1.9406 6.71119C1.63581 6.381 1.39875 6.01694 1.22942 5.61902C1.06009 5.2211 0.975425 4.80624 0.975425 4.37445C0.975425 3.81567 1.11512 3.28652 1.39451 2.787C1.66544 2.29594 2.04008 1.86627 2.51843 1.49798C2.99679 1.12969 3.55769 0.839716 4.20114 0.628055C4.84459 0.416394 5.53037 0.310564 6.25848 0.310564C6.98659 0.310564 7.67237 0.416394 8.31582 0.628055C8.95927 0.839716 9.52017 1.12969 9.99853 1.49798C10.4769 1.86627 10.8515 2.29594 11.1224 2.787C11.4018 3.28652 11.5415 3.81567 11.5415 4.37445ZM14.6403 9.9623C14.8096 10.3433 15.0022 10.6692 15.2181 10.9402C15.434 11.2111 15.5462 11.3466 15.5546 11.3466C15.58 11.3804 15.597 11.4164 15.6054 11.4545C15.6139 11.4926 15.6097 11.5286 15.5927 11.5625C15.5758 11.6048 15.5504 11.6365 15.5165 11.6577C15.4827 11.6789 15.4446 11.6895 15.4022 11.6895C14.9366 11.6895 14.5133 11.6238 14.1323 11.4926C13.7513 11.3614 13.4253 11.2153 13.1544 11.0545C12.7395 11.2577 12.295 11.4143 11.8209 11.5244C11.3468 11.6344 10.8473 11.6895 10.3224 11.6895C9.77205 11.6895 9.24713 11.6302 8.74761 11.5117C8.24809 11.3847 7.78667 11.2111 7.36335 10.991C6.94003 10.7708 6.5675 10.5084 6.24578 10.2036C5.91559 9.8988 5.65313 9.56438 5.4584 9.20032C5.5854 9.21725 5.71663 9.22995 5.85209 9.23842C5.98755 9.24689 6.12302 9.25112 6.25848 9.25112C7.09666 9.25112 7.88827 9.12412 8.63331 8.87013C9.36989 8.61614 10.0133 8.2669 10.5637 7.82241C11.114 7.37792 11.55 6.85935 11.8717 6.2667C12.1935 5.67405 12.3543 5.0433 12.3543 4.37445C12.3543 4.28979 12.3522 4.20512 12.348 4.12046C12.3437 4.0358 12.3331 3.95113 12.3162 3.86647C12.7988 4.01886 13.2433 4.21782 13.6497 4.46335C14.0476 4.71734 14.3926 5.00732 14.6847 5.33328C14.9768 5.65923 15.2033 6.01694 15.3641 6.4064C15.525 6.79585 15.6054 7.20224 15.6054 7.62556C15.6054 8.05735 15.5208 8.47221 15.3514 8.87013C15.1821 9.26805 14.945 9.63211 14.6403 9.9623Z" fill="#EEC044" />*!/*/}
            {/*  /!*  </svg>*!/*/}
            {/*  /!*  /!*<span className='text-[14px] text-[#878680] font-[500]'>0 {t("comment")}</span>*!/*!/*/}
            {/*  /!*</div>*!/*/}
            {/*</div>*/}
            <h2 className='text-[30px] text-[#1F1E17] font-[700] mb-4'>{data?.title}</h2>
            <p className='text-[16px] font-[500] leading-[30px] text-[#656565] mb-6'>{data?.content}</p>
          </div>
          {/*<div className='col-span-3 lg:col-span-1 space-y-8'>*/}
          {/*  <div className='bg-[#EAF8F0] rounded-[10px] p-8'>*/}
          {/*    <h6 className='text-[22px] text-[#1F1E17] font-[700] mb-4 leading-[30px]'>Categories</h6>*/}
          {/*    <ul className='space-y-6'>*/}
          {/*      <li>*/}
          {/*        <Link href={""} className='text-[16px] text-[#42423F] font-[500]'>Agriculture</Link>*/}
          {/*      </li>*/}
          {/*      <li>*/}
          {/*        <Link href={""} className='text-[16px] text-[#42423F] font-[500]'>Farm</Link>*/}
          {/*      </li>*/}
          {/*      <li>*/}
          {/*        <Link href={""} className='text-[16px] text-[#42423F] font-[500]'>Farming</Link>*/}
          {/*      </li>*/}
          {/*      <li>*/}
          {/*        <Link href={""} className='text-[16px] text-[#42423F] font-[500]'>Fresh Vegetables</Link>*/}
          {/*      </li>*/}
          {/*      <li>*/}
          {/*        <Link href={""} className='text-[16px] text-[#42423F] font-[500]'>Harvest</Link>*/}
          {/*      </li>*/}
          {/*      <li>*/}
          {/*        <Link href={""} className='text-[16px] text-[#42423F] font-[500]'>Organic Food</Link>*/}
          {/*      </li>*/}
          {/*    </ul>*/}
          {/*  </div>*/}
          {/*  <div className='bg-[#EAF8F0] rounded-[10px] p-8'>*/}
          {/*    <h6 className='text-[22px] text-[#1F1E17] font-[700] mb-4 leading-[30px]'>Tags</h6>*/}
          {/*    <ul className='space-y-6'>*/}
          {/*      <li>*/}
          {/*        <Link href={""} className='text-[16px] text-[#42423F] font-[500]'>Agriculture</Link>*/}
          {/*      </li>*/}
          {/*      <li>*/}
          {/*        <Link href={""} className='text-[16px] text-[#42423F] font-[500]'>Farm</Link>*/}
          {/*      </li>*/}
          {/*      <li>*/}
          {/*        <Link href={""} className='text-[16px] text-[#42423F] font-[500]'>Farming</Link>*/}
          {/*      </li>*/}
          {/*      <li>*/}
          {/*        <Link href={""} className='text-[16px] text-[#42423F] font-[500]'>Fresh Vegetables</Link>*/}
          {/*      </li>*/}
          {/*      <li>*/}
          {/*        <Link href={""} className='text-[16px] text-[#42423F] font-[500]'>Harvest</Link>*/}
          {/*      </li>*/}
          {/*      <li>*/}
          {/*        <Link href={""} className='text-[16px] text-[#42423F] font-[500]'>Organic Food</Link>*/}
          {/*      </li>*/}
          {/*    </ul>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>


        <div>
          <div className='text-center mb-10'>
            <h6 data-aos="fade-up" data-aos-duration="500" data-aos-delay="0" className='text-[#009444] font-bold text-[16px]'>{t("OurBlog")}</h6>
            <h2 data-aos="fade-zoom-in" data-aos-duration="500" data-aos-delay="0" className='text-[26px] md:text-[40px] text-[#252525] font-[500]'>{t("SimilarArticles")}</h2>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8'>

          {Blogs && Blogs.slice(0, 3).map((blogInfo: IBlog) => <BlogCard key={blogInfo.id} blogInfo={blogInfo} /> )}

          </div>
        </div>
      </div>
    </>
  )
}

export default BlogDetails