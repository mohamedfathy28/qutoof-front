"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { MdOutlinePlayCircleOutline } from "react-icons/md";
import Modal from "../modal/Modal";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player/lazy"), {
	ssr: false,
});

interface IClient {
	id?: number;
	name?: string;
	title?: string;
	content?: string;
	image?: string;
	created_at: string;
}

const Our_client = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [currentVideo, setCurrentVideo] = useState<string>("");

	const handleOpenModal = (data: IClient) => {
		setIsOpen(true);
		setCurrentVideo(data.image || "");
	};

	const sliderRef1 = useRef<Slider | null>(null);
	const next1 = () => {
		sliderRef1.current?.slickNext();
	};
	const previous1 = () => {
		sliderRef1.current?.slickPrev();
	};

	const settings1 = {
		dots: false,
		infinite: true,
		arrows: false,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		centerPadding: "50px",
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 1,
				},
			},
		],
	};

	const [data, setData] = useState<IClient[] | undefined>([]);

	const t = useTranslations("HomePage");

	useEffect(() => {
		const fetchData = async () => {
			const direction =
				typeof window !== "undefined" && localStorage.getItem("direction");

			const myHeaders = new Headers();
			myHeaders.append("Accept-Language", direction == "ltr" ? "en" : "ar");

			try {
				const response = await fetch(
					"https://quttouf.com/api/user/clients",
					{
						headers: myHeaders,
					}
				);
				const result = await response.json();
				setData(result.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []); // Empty dependency array ensures this runs only once after the component mounts

	if (data?.length == 0) return null;

	return (
		<>
			<div className='mx-auto max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mb-20 md:mb-32'>
				<div className='text-center mb-12'>
					<h6
						data-aos='fade-up'
						data-aos-duration='500'
						data-aos-delay='0'
						className='text-[#009444] font-bold text-[16px]'
					>
						{t("OurClients")}
					</h6>
					<h2
						data-aos='fade-zoom-in'
						data-aos-duration='500'
						data-aos-delay='0'
						className='text-[26px] md:text-[40px] text-[#252525] font-[500] max-w-[550px] mx-auto'
					>
						&quot;{t("ExploreInvest")}&quot;
					</h2>
				</div>

				<div className=''>
					<Slider ref={sliderRef1} {...settings1}>
						{data &&
							data.map((data) => (
								<div
									className='relative rounded-[8px] overflow-hidden h-[380px]'
									key={data.id}
								>
									<Image
										src={
											data.image
												? data.image
												: "https://quttouf.com/dashboard/blank.jpg"
										}
										width={100}
										height={100}
										alt='our clients'
										className='w-full h-auto'
									/>
									<div className='absolute z-8 top-0 left-0 w-full h-full bg-gradient-to-t from-[#000000] to-[#D9D9D900] p-8 flex flex-col justify-end items-start'>
										<button
											className='text-black w-70 h-70 mx-auto mb-20'
											onClick={() => handleOpenModal(data)}
										>
											<MdOutlinePlayCircleOutline className='text-[60px] text-[#fff]' />
										</button>
										<h5 className='text-[22px] text-[#fff] font-[800]'>
											{data ? data.title : ""}
										</h5>
										<span className='text-[18px] text-[#CFCFCF] font-[600]'>
											{t("Client")}
										</span>
									</div>
								</div>
							))}
					</Slider>

					<div
						className='w-full flex justify-center items-center gap-2 py-6'
						dir='ltr'
					>
						<div
							className={`w-10 h-10  flex justify-center items-center border-2 border-[#536728] cursor-pointer`}
							onClick={previous1}
						>
							<svg
								width='9'
								height='16'
								viewBox='0 0 9 16'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M7.5 2L1.5 8L7.5 14'
									stroke={"#536728"}
									strokeWidth='3'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
						</div>
						<div
							className={`w-10 h-10 flex justify-center items-center border-2 border-[#536728] cursor-pointer`}
							onClick={next1}
						>
							<svg
								width='9'
								height='16'
								viewBox='0 0 9 16'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M1.5 14L7.5 8L1.5 2'
									stroke={"#536728"}
									strokeWidth='3'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>

			<Modal
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
				}}
			>
				<ReactPlayer
					url={currentVideo}
					width='100%'
					height='100%'
					progressInterval={1000}
					config={{
						file: {
							attributes: {
								class: "w-full h-full object-cover",
							},
						},
					}}
					controls={true}
					playing={true}
				/>
			</Modal>
		</>
	);
};

export default Our_client;
