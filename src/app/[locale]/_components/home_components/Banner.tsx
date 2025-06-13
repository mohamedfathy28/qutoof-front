"use client";
import React, { useEffect, useState } from "react";
import Button from "../button/Button";
import { useRouter } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface BannerItem {
	title: string;
	content: string;
	image: string;
}

const Banner = () => {
	const [data, setData] = useState<BannerItem[]>([]); // Updated to handle a list
	const router = useRouter();
	const t = useTranslations("HomePage");

	useEffect(() => {
		const fetchData = async () => {
			const direction =
				typeof window !== "undefined" && localStorage.getItem("direction");

			const myHeaders = new Headers();
			myHeaders.append("Accept-Language", direction == "ltr" ? "en" : "ar");
			try {
				const response = await fetch(
					"https://quttouf.com/api/user/main-banners",
					{
						headers: myHeaders,
					}
				);
				const result = await response.json();
				setData(result.data); // Assuming result.data is a list
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	if (!data || data.length === 0) return null; // Handle empty list

	return (
		<div className='relative'>
			{data.map((item, index) => (
				<div key={index} className='relative'>
					<div className='relative h-[85vh] md:h-[85vh] w-full'>
						<Image
							src={item.image || ""}
							alt={`hero img ${index}`}
							fill
							className='object-cover'
						/>
					</div>
					<div className='absolute top-0 left-0 w-full h-full z-10 bg-black/30'>
						<div
							className={
								" h-full flex flex-col gap-4 justify-center items-start mx-auto max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl"
							}
						>
							<h1
								data-aos='fade-right'
								data-aos-duration='500'
								data-aos-delay='0'
								className='text-[#fff] text-[50px] md:text-[80px] font-[400] leading-[35px] md:leading-[65px] font-[Mansalva]'
							>
								{item.title || t("welcome")}
							</h1>
							<p
								data-aos='fade-right'
								data-aos-duration='500'
								data-aos-delay='300'
								className='rtl:text-right text-[22px] font-[400] leading-[25px] text-white mb-6'
							>
								{item.content || t("Discover")}
							</p>
							<Button
								onClick={() => router.push("/market")}
								className='px-4'
								data-aos='fade-right'
								data-aos-duration='500'
								data-aos-delay='600'
								data-aos-offset='0'
							>
								{t("DiscoverMore")}
							</Button>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default Banner;
