import Image from 'next/image';
import React from 'react'
import bgImg from '@/media/auth_bg.png'
import logo from '@/media/logo.png'
import { useTranslations } from 'next-intl';

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


        const t = useTranslations("auth");
    

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2  gap-8 p-6 md:p-8 '>
            <div className='w-full min-h-[90vh] lg:w-[65%] mx-auto flex flex-col justify-center'>
                {children}
            </div>
            <div className='relative ahidden lg:block h-[90vh]'>
                <Image src={bgImg} alt='welcome img' className='w-full h-full object-cover rounded-[16px]' />
                <div className='absolute top-0 left-0 w-full h-full z-[2] flex flex-col justify-center items-center gap-12'>
                    <Image src={logo} alt='welcome img'/>
                    <div className='w-3/5 text-center space-y-3'>
                        <h2 className='text-white text-[24px] font-[600]'>{t("Welcome_to_Quttouf")}</h2>
                        <p className='text-white text-[16px] font-[400]'>{t("breef")}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
