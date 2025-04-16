'use client'
import React from 'react';
import { Link } from "@/i18n/routing";;
import Image from 'next/image';
import breadcrumbImg from "@/media/breadcrumb_bg.png"
import { useTranslations } from 'next-intl';

interface BreadcrumbItem {
    label: string | number | undefined;
    href: string;
}

interface BreadcrumbProps {
    items?: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
    items = []
}) => {

    const t = useTranslations("HomePage");


    return (
        <nav className="relative w-full h-[30vh] md:h-[50vh]">
            <Image src={breadcrumbImg} width={100} height={100} alt='breadcrumb img' className='object-cover h-full w-full' />
            <div className='absolute top-0 ltr:left-0 rtl:right-0 w-full h-full bg-[#1f1e1740] flex flex-col items-center justify-center gap-4'>
                <div className='flex items-center justify-center space-x-2'>
                    <Link
                        href="/"
                        className="flex items-center text-[#FFFFFFB2]"
                    >
                        {t("Home")}
                    </Link>

                    {items.map((item, index) => (
                        <React.Fragment key={index}>
                            <span className='text-[#FFFFFFB2]'>/</span>
                            {index === items.length - 1 ? (
                                <span className="font-medium text-[#FFFFFFB2]">{item.label}</span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="text-[#FFFFFFB2]"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </React.Fragment>
                    ))}
                </div>
                <h5 className='text-[28px] font-[600] leading-[30px] lg:text-[50px] lg:font-[800] lg:leading-[60px] text-[#fff]'>{items[items.length - 1].label}</h5>
            </div>
        </nav>
    );
};

export default Breadcrumb;