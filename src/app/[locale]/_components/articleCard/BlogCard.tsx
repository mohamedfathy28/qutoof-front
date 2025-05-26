"use client";
import Image from "next/image";
import React from "react";
import blogImg from "@/media/our blog img 2.png";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
interface IBlogCardProps {
	blogInfo?: {
		id?: number;
		name?: string;
		title?: string;
		content?: string;
		image?: string;
		created_at?: string;
	};
}

const BlogCard = ({ blogInfo }: IBlogCardProps) => {
	const t = useTranslations("HomePage");

	let day, month, year;

	// Safely parse the date only if `created_at` is valid
	if (blogInfo?.created_at) {
		const date = new Date(blogInfo.created_at);
		if (!isNaN(date.getTime())) {
			// Check if date is valid
			day = date.getDate();
			month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
				date
			); // Jan, Feb, etc.
			year = date.getFullYear();
		}
	}

	return (
		<>
			<div className='w-full overflow-hidden'>
				<div className='relative h-52 mb-8'>
					<Link href={`/news-articles/${blogInfo?.id}`}>
						<Image
							src={blogInfo?.image ? blogInfo.image : blogImg}
							alt='user'
							width={100}
							height={100}
							className='rounded-[8px] w-full h-full object-cover'
						/>
					</Link>
					<div className='absolute bottom-0 left-0 w-20 h-14 bg-[#F7C35F] text-[#04000B] text-[36px] flex items-center justify-center font-bold'>
						{day}
					</div>
					<div className='absolute top-[100%] left-0 w-20 h-8 bg-[#49A760] text-[#fff] text-[14px] flex items-center justify-center'>
						{month}, {year}
					</div>
				</div>
				<div className='py-3'>
					<Link href={`/news-articles/${blogInfo?.id}`}>
						<h2 className='text-[24px] font-[500] mb-3 text-gray-800'>
							{blogInfo?.title}
						</h2>
					</Link>
					<p className='text-[#525252] text-[16px]  mb-4 line-clamp-3'>
						{blogInfo?.content}
					</p>
					<Link
						href={`/news-articles/${blogInfo?.id}`}
						className='flex items-start w-fit gap-2 hover:gap-4 transition-all duration-300 leading-[14px] text-[14px] text-[#009444]'
					>
						{t("ContinueReading")}{" "}
						<svg
							className='rtl:rotate-180'
							width='13'
							height='15'
							viewBox='0 0 13 13'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M5.19531 1.37341L5.82422 0.771851C5.95182 0.644246 6.10677 0.580444 6.28906 0.580444C6.47135 0.580444 6.6263 0.644246 6.75391 0.771851L12.0586 6.07654C12.1862 6.20414 12.25 6.35909 12.25 6.54138C12.25 6.72367 12.1862 6.87862 12.0586 7.00623L6.75391 12.3109C6.6263 12.4385 6.47135 12.5023 6.28906 12.5023C6.10677 12.5023 5.95182 12.4385 5.82422 12.3109L5.19531 11.7094C5.06771 11.5817 5.00391 11.4268 5.00391 11.2445C5.02214 11.0622 5.09505 10.9073 5.22266 10.7797L8.50391 7.63513H0.65625C0.473958 7.63513 0.31901 7.57133 0.191406 7.44373C0.0638021 7.31612 0 7.16117 0 6.97888V6.10388C0 5.92159 0.0638021 5.76664 0.191406 5.63904C0.31901 5.51143 0.473958 5.44763 0.65625 5.44763H8.50391L5.22266 2.3031C5.09505 2.1755 5.02214 2.02055 5.00391 1.83826C5.00391 1.65597 5.06771 1.50102 5.19531 1.37341Z'
								fill='#009444'
							/>
						</svg>
					</Link>
				</div>
			</div>
		</>
	);
};

export default BlogCard;
