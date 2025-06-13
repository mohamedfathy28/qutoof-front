"use client";
import React, { useEffect, useState } from "react";
import Button from "../button/Button";
import { useRouter } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface BannerResponse {
	title: string;
	content: string;
	image: string;
}

const Banner = () => {
	const [data, setData] = useState<BannerResponse[]>([]);
	const [currentSlide, setCurrentSlide] = useState(0);
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
				if (result.data && result.data.length > 0) {
					setData(result.data);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	// Auto-rotate slides
	useEffect(() => {
		if (data.length <= 1) return;

		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % data.length);
		}, 5000); // Change slide every 5 seconds

		return () => clearInterval(interval);
	}, [data.length]);

	if (data.length === 0) return null;

	const currentItem = data[currentSlide];

	return (
		<div className="relative">
			{/* Slider container */}
			<div className="relative h-[85vh] md:h-[85vh] w-full overflow-hidden">
				{data.map((item, index) => (
					<div
						key={index}
						className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
							}`}
					>
						<Image
							src={item.image}
							alt={`hero img ${index + 1}`}
							fill
							className="object-cover"
							priority={index === 0} // Only prioritize first image
						/>
					</div>
				))}
			</div>

			{/* Overlay content */}
			<div className="absolute top-0 left-0 w-full h-full z-10 bg-black/30">
				<div
					className={
						"h-full flex flex-col gap-4 justify-center items-start mx-auto max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl"
					}
				>
					<h1
						data-aos="fade-right"
						data-aos-duration="500"
						data-aos-delay="0"
						className="text-[#fff] text-[50px] md:text-[80px] font-[400] leading-[35px] md:leading-[65px] font-[Mansalva]"
					>
						{currentItem?.title || t("welcome")}
					</h1>
					<p
						data-aos="fade-right"
						data-aos-duration="500"
						data-aos-delay="300"
						className="rtl:text-right text-[22px] font-[400] leading-[25px] text-white mb-6"
					>
						{currentItem?.content || t("Discover")}
					</p>
					<Button
						onClick={() => router.push("/market")}
						className="px-4"
						data-aos="fade-right"
						data-aos-duration="500"
						data-aos-delay="600"
						data-aos-offset="0"
					>
						{t("DiscoverMore")}
					</Button>
				</div>
			</div>

			{/* Navigation dots */}
			{data.length > 1 && (
				<div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-2">
					{data.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentSlide(index)}
							className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-gray-400"
								}`}
							aria-label={`Go to slide ${index + 1}`}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default Banner;