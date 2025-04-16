'use client'
import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../_components/breadcrumb/breadcrumb'
import Tabs from '../../_components/tabs/Tabs'
import ProductCard from '../../_components/productCard/ProductCard'
import Pagination from '../../_components/pagination/Pagination'
import { useRouter } from "@/i18n/routing";
import Spinner from '../../_components/spinner/Spinner'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'


interface IProject {
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

const RenderAllProducts = () => {

  const [data, setData] = useState<IProject[]>([]);
  const [totalPages, setTotalPages] = useState<number>();
  const [CurrentPage, setCurrentPage] = useState<number>(1)
  const [isLoading, setisLoading] = useState<boolean>(true)


  const router = useRouter();
  const t = useTranslations("HomePage");

  useEffect(() => {


    const fetchData = async () => {
      const direction = typeof window !== "undefined" && localStorage.getItem("direction");

      const PerPage = 6;

      const myHeaders = new Headers();
      myHeaders.append("Accept-Language", direction == 'ltr' ? "en" : "ar");
      try {
        const response = await fetch(`https://quttouf.com//api/user/market?per_page=${PerPage}&page=${CurrentPage}`, {
          headers: myHeaders
        });
        const result = await response.json();
        setData(result.data);
        setTotalPages(result?.pages)
        setCurrentPage(result?.current_page)
        setisLoading(false);

      } catch (error) {
        console.error('Error fetching data:', error);
        setisLoading(false);
        if (error instanceof Error) {
          toast.error(error.message); 
        } else {
          toast.error('An unexpected error occurred');
        }
      }
    };

    fetchData();
  }, [CurrentPage, router]); // Empty dependency array ensures this runs only once after the component mounts

  if (isLoading) return <Spinner />

  return (
    <>
      <div data-aos="fade-up" data-aos-duration="500" data-aos-delay="0" className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>

        {data?.length !== 0 ? data?.map(ProductInfo => <ProductCard key={ProductInfo.id} ProductInfo={ProductInfo} />) : <h3 className='col-span-3 text-[20px] text-center text-[#009444] font-[700]'>{t("NoRecords")}</h3>}

      </div>
      {data?.length !== 0 ? <Pagination currentPage={CurrentPage} totalPages={totalPages ? totalPages : 1} onPageChange={(t) => setCurrentPage(t)} /> : ''}

    </>
  )
}

const RenderFromCustomers = () => {

  const [data, setData] = useState<IProject[]>([]);
  const [totalPages, setTotalPages] = useState<number>();
  const [CurrentPage, setCurrentPage] = useState<number>(1)
  const [isLoading, setisLoading] = useState<boolean>(true)


  const router = useRouter();

  const t = useTranslations("HomePage");


  useEffect(() => {


    const fetchData = async () => {

      const PerPage = 6;

      const direction = typeof window !== "undefined" && localStorage.getItem("direction");

      const myHeaders = new Headers();
      myHeaders.append("Accept-Language", direction == 'ltr' ? "en" : "ar");
      try {
        const response = await fetch(`https://quttouf.com//api/user/market?filter[type_id]=2&per_page=${PerPage}&page=${CurrentPage}`, {
          headers: myHeaders
        });
        const result = await response.json();
        setData(result.data);
        setTotalPages(result?.pages)
        setCurrentPage(result?.current_page)
        setisLoading(false);


      } catch (error) {
        console.error('Error fetching data:', error);
        setisLoading(false);
           if (error instanceof Error) {
          toast.error(error.message); 
        } else {
          toast.error('An unexpected error occurred');
        }

      }
    };

    fetchData();
  }, [CurrentPage, router]); // Empty dependency array ensures this runs only once after the component mounts

  if (isLoading) return <Spinner />

  return (
    <>
      <div data-aos="fade-up" data-aos-duration="500" data-aos-delay="0" className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>

        {data?.length !== 0 ? data?.map(ProductInfo => <ProductCard key={ProductInfo.id} ProductInfo={ProductInfo} />) : <h3 className='col-span-3 text-[20px] text-center text-[#009444] font-[700]'>{t("NoRecords")}</h3>}

      </div>
      {data?.length !== 0 ? <Pagination currentPage={CurrentPage} totalPages={totalPages ? totalPages : 1} onPageChange={(t) => setCurrentPage(t)} /> : ''}

    </>
  )
}

const RenderFromCompany = () => {

  const [data, setData] = useState<IProject[]>([]);
  const [totalPages, setTotalPages] = useState<number>();
  const [CurrentPage, setCurrentPage] = useState<number>(1)
  const [isLoading, setisLoading] = useState<boolean>(true)


  const router = useRouter();
  const t = useTranslations("HomePage");


  useEffect(() => {


    const fetchData = async () => {
      const direction = typeof window !== "undefined" && localStorage.getItem("direction");
      const PerPage = 6;
      const myHeaders = new Headers();
      myHeaders.append("Accept-Language", direction == 'ltr' ? "en" : "ar");
      try {
        const response = await fetch(`https://quttouf.com//api/user/market?filter[type_id]=1&per_page=${PerPage}&page=${CurrentPage}`, {
          headers: myHeaders
        });
        const result = await response.json();
        setData(result.data);
        setTotalPages(result?.pages)
        setCurrentPage(result?.current_page)
        setisLoading(false);


      } catch (error) {
        console.error('Error fetching data:', error);
           if (error instanceof Error) {
          toast.error(error.message); 
        } else {
          toast.error('An unexpected error occurred');
        }
        setisLoading(false);
      }
    };

    fetchData();
  }, [CurrentPage, router]); // Empty dependency array ensures this runs only once after the component mounts

  if (isLoading) return <Spinner />

  return (
    <>
      <div data-aos="fade-up" data-aos-duration="500" data-aos-delay="0" className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>

        {data?.length !== 0 ? data?.map(ProductInfo => <ProductCard key={ProductInfo.id} ProductInfo={ProductInfo} />) : <h3 className='col-span-3 text-[20px] text-center text-[#009444] font-[700]'>{t("NoRecords")}</h3>}

      </div>
      {data?.length !== 0 ? <Pagination currentPage={CurrentPage} totalPages={totalPages ? totalPages : 1} onPageChange={(t) => setCurrentPage(t)} /> : ''}


    </>
  )
}

const MarketPage = () => {

  const t = useTranslations("HomePage");


  const tabs = [
    {
      id: 'tab1',
      label: t("All"),
      content: RenderAllProducts
    },
    {
      id: 'tab3',
      label: t("fromCustomers"),
      content: RenderFromCustomers
    },
    {
      id: 'tab4',
      label: t("fromCompany"),
      content: RenderFromCompany
    }
  ];



  return (
    <>
      <Breadcrumb
        items={[
          { label: t("market"), href: '/market' },
        ]}
      />

      <div className="mx-auto max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl my-20 md:my-32">
        <Tabs
          tabs={tabs}
          defaultTab="tab1"
          className="w-full"
        />

      </div>


    </>
  )
}

export default MarketPage