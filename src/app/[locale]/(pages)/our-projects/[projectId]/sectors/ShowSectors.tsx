'use client'
import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../../../_components/breadcrumb/breadcrumb'
import Pagination from '../../../../_components/pagination/Pagination'
import SectorCard from '../../../../_components/sectorCard/SectorCard'
import { useTranslations } from 'next-intl'


interface ISector {
  id: number,
  number_of_shares: number,
  share_price: number,
  company_evaluation: number,
  status_id: number,
  status: string,
  type: string,
  type_flag: string,
  participants: number,
  total_price: number,
  sector: {
    id: 1,
    title: string,
    description: string,
    number_of_acres: number,
    available_shares: number,
    land_area: number,
    offered_by_company: number,
    pdf: string,
    company_rate: number,
    launch_start: string,
    construction_start: string,
    construction_end: string,
    production_start: string,
    media: string[],
    created_at: string
  },
  user: {
    id: number,
    image: string,
    username: string,
    whatsapp_number: string,
    country_code: string,
    phone: string
  },
  created_at: string,
}

const ShowSectors = ({ projectId }: { projectId: number }) => {

  const [data, setData] = useState<ISector[]>();
  const [totalPages, setTotalPages] = useState<number>();
  const [CurrentPage, setCurrentPage] = useState<number>(1)


  useEffect(() => {
    const fetchData = async () => {
      const direction = typeof window !== "undefined" && localStorage.getItem("direction");
      const PerPage = 6;
          const myHeaders = new Headers();
          myHeaders.append("Accept-Language", direction=='ltr'? "en" : "ar");
      try {
        const response = await fetch(`http://localhost/quttouf-backend/api/user/market?filter[project_id]=${projectId}&per_page=${PerPage}&page=${CurrentPage}`,{
          headers:myHeaders
        });
        const result = await response.json();
        setData(result.data);
        setTotalPages(result?.pages)
        setCurrentPage(result?.current_page)

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [CurrentPage, projectId]); // Empty dependency array ensures this runs only once after the component mounts

  const t = useTranslations("SectorDetails");


  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Our Projects', href: '/our-projects' },
        ]}
      />


      <div className="mx-auto max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl my-20 md:my-32">
        <div className='text-center mb-10'>
          <h6 data-aos="fade-up" data-aos-duration="500" data-aos-delay="0" className='text-[#009444] font-bold text-[16px]'>{t("ourProjects")}</h6>
          <h2 data-aos="fade-zoom-in" data-aos-duration="500" data-aos-delay="0" className='text-[26px] md:text-[40px] text-[#252525] font-[500]'>{t("CheckOurLatestProjects")}</h2>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          {data && data.map(SectorInfo => <SectorCard key={SectorInfo.id} SectorInfo={SectorInfo} />)}
        </div>
        {data?.length !== 0 ? <Pagination currentPage={CurrentPage} totalPages={totalPages ? totalPages : 1} onPageChange={(t) => setCurrentPage(t)} />:''}

      </div>


    </>
  )
}

export default ShowSectors