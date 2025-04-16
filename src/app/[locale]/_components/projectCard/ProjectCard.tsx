import React from 'react'
import { Link } from "@/i18n/routing";;
import Button from '../button/Button';
import Image from 'next/image';
import ProjecIimg from '@/media/our values img1.png'
import { useTranslations } from 'next-intl';

interface IProjectCardProps {
   ProjectInfo : {
    id: number,
    title: string,
    description: string,
    image: string,
    pdf:string,
    sectors_count: number,
    total_area: number,
    created_at: string
  }
}

const ProjectCard = ({ProjectInfo}:IProjectCardProps) => {

  const handleDownload = (pdfLink:string) => {
    const link = document.createElement('a'); // Create a temporary link element
    link.href = pdfLink; // Path to the PDF in the public folder
    link.download = pdfLink; // Name of the downloaded file
    link.target="_blank"
    link.click(); // Trigger the click event
  };

  const t = useTranslations("SectorDetails");


  return (
    <>
      <div className="w-full  overflow-hidden">
        <Image src={ProjectInfo? ProjectInfo.image : ProjecIimg} width={100} height={100} alt="Card image" className="w-full h-auto rounded-lg object-cover mb-2 lg:mb-4" />
        <div className="py-2">
          <h2 className="text-[24px] lg:text-[28px] font-[500] mb-2 lg:mb-3 text-[#121212]">{ProjectInfo.title}</h2>
          <p className="text-[#525252] text-[16px] lg:text-[20px] mb-4 line-clamp-2 h-[65px]" >{ProjectInfo.description}</p>
          <ul className='grid grid-cols-2 mb-8'>
            <li className='flex flex-col lg:flex-row items-center gap-2'>
              <span className='text-[#656565] text-[12px] lg:text-[16px]'>number of acres:</span>
              <span className='text-[#121212] text-[12px] lg:text-[16px] font-[500]'>{ProjectInfo.total_area} Acre</span>
            </li>
            <li className='flex flex-col lg:flex-row items-center gap-2'>
              <span className='text-[#656565] text-[12px] lg:text-[16px]'>number of Sectors:</span>
              <span className='text-[#121212] text-[12px] lg:text-[16px] font-[500]'>{ProjectInfo.sectors_count}</span>
            </li>
          </ul>
          <div className='flex items-center justify-between'>
            <Link href={`/our-projects/${ProjectInfo.id}/sectors`} className='flex items-start w-fit gap-2 hover:gap-4 transition-all duration-300 leading-[27px] text-[14px] lg:text-[18px] text-[#009444]'>
            {t("ShowSectors")} <svg className='rtl:rotate-180' width="13" height="28" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.19531 1.37341L5.82422 0.771851C5.95182 0.644246 6.10677 0.580444 6.28906 0.580444C6.47135 0.580444 6.6263 0.644246 6.75391 0.771851L12.0586 6.07654C12.1862 6.20414 12.25 6.35909 12.25 6.54138C12.25 6.72367 12.1862 6.87862 12.0586 7.00623L6.75391 12.3109C6.6263 12.4385 6.47135 12.5023 6.28906 12.5023C6.10677 12.5023 5.95182 12.4385 5.82422 12.3109L5.19531 11.7094C5.06771 11.5817 5.00391 11.4268 5.00391 11.2445C5.02214 11.0622 5.09505 10.9073 5.22266 10.7797L8.50391 7.63513H0.65625C0.473958 7.63513 0.31901 7.57133 0.191406 7.44373C0.0638021 7.31612 0 7.16117 0 6.97888V6.10388C0 5.92159 0.0638021 5.76664 0.191406 5.63904C0.31901 5.51143 0.473958 5.44763 0.65625 5.44763H8.50391L5.22266 2.3031C5.09505 2.1755 5.02214 2.02055 5.00391 1.83826C5.00391 1.65597 5.06771 1.50102 5.19531 1.37341Z" fill="#009444" />
              </svg>
            </Link>
            <Button className='flex gap-2' onClick={()=>handleDownload(ProjectInfo.pdf)}>{t("Download")}
              <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.26 19.8627H8.73998C3.82998 19.8627 1.72998 18.0469 1.72998 13.8015V13.6891C1.72998 9.85003 3.47998 7.99969 7.39998 7.67977C7.79998 7.65383 8.17998 7.91322 8.21998 8.26773C8.25998 8.62223 7.95998 8.94215 7.53998 8.97674C4.39998 9.22749 3.22998 10.5072 3.22998 13.6977V13.8101C3.22998 17.3292 4.66998 18.5743 8.73998 18.5743H15.26C19.33 18.5743 20.77 17.3292 20.77 13.8101V13.6977C20.77 10.4899 19.58 9.21019 16.38 8.97674C15.97 8.94215 15.66 8.63088 15.7 8.27637C15.74 7.92187 16.09 7.65383 16.51 7.68841C20.49 7.98239 22.27 9.84139 22.27 13.7064V13.8188C22.27 18.0469 20.17 19.8627 15.26 19.8627Z" fill="white" />
                <path d="M12 14.1387C11.59 14.1387 11.25 13.8447 11.25 13.4902V2.35356C11.25 1.99906 11.59 1.70508 12 1.70508C12.41 1.70508 12.75 1.99906 12.75 2.35356V13.4902C12.75 13.8534 12.41 14.1387 12 14.1387Z" fill="white" />
                <path d="M11.9998 15.1072C11.8098 15.1072 11.6198 15.0466 11.4698 14.9169L8.11984 12.0204C7.82984 11.7696 7.82984 11.3546 8.11984 11.1038C8.40984 10.8531 8.88984 10.8531 9.17984 11.1038L11.9998 13.5421L14.8198 11.1038C15.1098 10.8531 15.5898 10.8531 15.8798 11.1038C16.1698 11.3546 16.1698 11.7696 15.8798 12.0204L12.5298 14.9169C12.3798 15.0466 12.1898 15.1072 11.9998 15.1072Z" fill="white" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProjectCard