"use client"
import React, { useEffect, useState } from 'react'
import coverImg from '@/media/profile cover.png'
import UserImg from '@/media/our clients img1.png'
import Image from 'next/image'
import RenderProfileInfo from './ProfileInfo/ProfileInfo'
import RenderWalletAndInvestments from './WalletAndInvestments/WalletAndInvestments'
import RenderTransactionManagement from './TransactionManagement/TransactionManagement'
import { useUser } from '../_contexts/userContext'
import { useRouter } from "@/i18n/routing";
import { useTranslations } from 'next-intl'

// ================= Profile page ===================

const ProfilePage = () => {

    const [activeTab, setActiveTab] = useState("PrfileInfo");
    const { user } = useUser();

        const t = useTranslations("profile");
    

    const MainTabs = [
        {
            id: 'PrfileInfo',
            label: t("Profile_Information"),
            content: RenderProfileInfo
        },
        {
            id: 'WalletAndInvestments',
            label: t("Wallet_investments"),
            content: RenderWalletAndInvestments
        },
        {
            id: 'TransactionManagement',
            label: t("Transaction_Management"),
            content: RenderTransactionManagement
        }
    ];


    const router = useRouter();

    const currentUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem("userInfo") as string);


    useEffect(() => {

        const token = typeof window !== 'undefined' && localStorage.getItem('token');


        // If the user is not authenticated, redirect to the login page
        if (!token) {
            router.push('/auth/signin');
        }
    }, [router])



    return (
        <>
            <div className='relative mb-[100px] lg:mb-[250px] bg-white'>
                <Image src={coverImg} alt='profile cover' className='h-[120px] lg:h-[360px] w-full object-cover' />
                <div className="absolute z-10 bottom-0 left-[50%] translate-x-[-50%] translate-y-[60%] w-full flex items-end  gap-6 lg:gap-12 mx-auto max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                    <Image src={currentUser? currentUser.image : UserImg} alt='profile cover' width={100} height={100} className='h-[120px] w-[120px] lg:h-[280px] lg:w-[280px] object-cover rounded-[50%] border-[4px] border-white' />
                    <div className='flex flex-col justify-center gap-0 lg:gap-2 h-[70px] lg:h-[140px]'>
                        <span className='text-[#656565] text-[14px] lg:text-[20px] font-[400]'>{t("Welcome")},</span>
                        <h4 className='text-[#17181B] text-[20px] lg:text-[32px] font-[600]'>{user?.username}</h4>
                    </div>
                </div>
            </div>

            <div className='flex flex-col lg:flex-row bg-[#c8c8c854] pt-[2px] pb-16'>
                <div className="w-full lg:w-1/5 lg:pb-6 h-auto">
                    <div className='flex flex-row lg:flex-col justify-start gap-6 px-6 py-6 lg:py-16 bg-white rounded-ee-[16px] h-full'>
                        {MainTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-2 lg:px-4 py-3 w-full rounded-[8px] text-[12px] md:text-[16px] text-center lg:text-start font-[500] leading-[20px] lg:leading-[24px] transition-colors duration-200
                                ${activeTab === tab.id ? 'bg-[#009444] text-[#fff]' : ' text-[#656565] hover:text-[#009444]'} `} >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="w-full lg:w-4/5 lg:p-6">
                    {MainTabs.map((tab) => (
                        <div
                            key={tab.id}
                            className={`${activeTab === tab.id ? 'block' : 'hidden'}`}>
                            {tab.content()}
                        </div>
                    ))}
                </div>
            </div>

        </>

    )
}

export default ProfilePage