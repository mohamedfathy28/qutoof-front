import React from 'react'
import styles from './footer.module.css'
import logo from '@/media/logo.png'
import Image from 'next/image'
import { Link } from "@/i18n/routing";
import twitterIcon from '@/media/twitterIcon.png'
import instagramIcon from '@/media/instgramIcon.png'
import { useConfigrationsContext } from '../../_contexts/MainConfigContext';
import { useTranslations } from 'next-intl';


const Footer = () => {

  const { Configrations } = useConfigrationsContext();
    
  const t = useTranslations("HomePage");


    return (
        <footer className={'bg-[#00431F] ' + styles.footer}>
            <div className='py-12 flex flex-nowrap flex-col md:flex-row gap-8 mx-auto max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl'>
                <div className="w-full md:w-1/2 flex flex-col gap-8">
                    <Link href={"/"}>
                        <Image src={logo} alt='logo' />
                    </Link>
                    <p className='w-full md:w-3/4 text-justify'>{t("companyPreef")}</p>
                </div>

                <div className='w-full md:w-1/2 flex items-start gap-4'>
                    {/* Second element - Quarter width on desktop */}
                    <div className="w-1/2 md:w-1/4  ">
                        <h6>{t("company")}</h6>
                        <ul>
                            <li><Link href="/market">{t("market")}</Link></li>
                            <li><Link href="/our-projects">{t("ourProjects")}</Link></li>
                            <li><Link href="/news-articles">{t("Blogs")}</Link></li>
                            <li><Link href="/partners">{t("Partners")}</Link></li>
                        </ul>
                    </div>

                    {/* Third element - Quarter width on desktop */}
                    <div className="w-1/2 md:w-1/4 ">
                        <h6>{t("Help")}</h6>
                        <ul>
                            <li><Link href="/contact-us">{t("contactUs")}</Link></li>
                        </ul>
                    </div>
                </div>

            </div>

            <div className='border-t-[1px] border-[#DBDBDB99] py-8 flex flex-col md:flex-row justify-between items-center gap-4 mx-auto max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl'>
                <p className='text-[#DBDBDB99]'>{t("copyRight")}</p>
                <div className='flex items-center gap-4'>
                    <Link href={Configrations? Configrations.twitter : "https://x.com/"} className='rounded-[50%] bg-[#dbdbdb4f] p-2 w-8 h-8 flex justify-center items-center'>
                        <Image src={twitterIcon} alt='twitter' />
                    </Link>
                    <Link href={Configrations? Configrations.instagram : "https://www.instagram.com/"} className='rounded-[50%] bg-[#dbdbdb4f] p-2 w-8 h-8 flex justify-center items-center'>
                        <Image src={instagramIcon} alt='instagram' />
                    </Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer