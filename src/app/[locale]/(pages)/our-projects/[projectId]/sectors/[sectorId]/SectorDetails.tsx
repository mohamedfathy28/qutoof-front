"use client";
import React, { useEffect, useState } from "react";
import ImageSlider from "./slider";
import Breadcrumb from "../../../../../_components/breadcrumb/breadcrumb";
import { FaStar } from "react-icons/fa";
import Button from "../../../../../_components/button/Button";
import img1 from "@/media/our blog img 1.png";
import img2 from "@/media/our clients img1.png";
import img3 from "@/media/our team img1.png";
import img4 from "@/media/sector img 1.png";
import Tabs from "../../../../../_components/tabs/Tabs";
import toast from "react-hot-toast";
import { useRouter } from "@/i18n/routing";
import Modal from "@/app/[locale]/_components/modal/Modal";
import PriceInput from "@/app/[locale]/_components/amountInput/AmountInput";
import BlogCard from "@/app/[locale]/_components/articleCard/BlogCard";
import { useTranslations } from "next-intl";

const images = [
	{
		src: img1,
		alt: "Palm trees in sunset",
	},
	{
		src: img2,
		alt: "Tropical palm trees",
	},
	{
		src: img3,
		alt: "Palm grove",
	},
	{
		src: img4,
		alt: "Palm trees landscape",
	},
];

interface Iprops {
	sectorId: number;
}

interface IMarket {
	id: number;
	number_of_shares: number;
	share_price: number;
	company_evaluation: number;
	status_id: number;
	status: string;
	type: string;
	type_flag: string;
	participants: number;
	total_price: number;
	sector: {
		id: 1;
		title: string;
		description: string;
		number_of_acres: number;
		available_shares: number;
		land_area: number;
		offered_by_company: number;
		pdf: string;
		company_rate: number;
		launch_start: string;
		construction_start: string;
		construction_end: string;
		production_start: string;
		media: string[];
		created_at: string;
	};
	user: {
		id: number;
		image: string;
		username: string;
		whatsapp_number: string;
		country_code: string;
		phone: string;
	};
	created_at: string;
}

interface IBlog {
	id: number;
	name: string;
	title: string;
	content: string;
	image: string;
	video: string;
	created_at: string;
}

const SectorDetails = ({ sectorId }: Iprops) => {
	const [data, setData] = useState<IMarket>();
	const [RelatedBlogs, setRelatedBlogs] = useState<IBlog[]>([]);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [OfferValue, setOfferValue] = useState<number | null>(null);
	const [NumberOfShares, setNumberOfShares] = useState<number | null>(null);
	const [IsLoading, setIsLoading] = useState<boolean>(false);

	const router = useRouter();

	const handleOpenModal = () => {
		const token =
			typeof window !== "undefined" && localStorage.getItem("token");

		// If the user is not authenticated, redirect to the login page
		if (!token) {
			router.push("/auth/signin");
		} else {
			setIsOpen(true);
		}
	};

	const handleAskingPrice = (value: number): void => {
		console.log("Price value:", value);
		setOfferValue(value);
	};

	const handleNumberOfShares = (value: number): void => {
		console.log("Price value:", value);
		setNumberOfShares(value);
	};

	const handleSendOffer = async () => {
		setIsLoading(true);

		const token =
			typeof window !== "undefined" && localStorage.getItem("token");

		const myHeaders = new Headers();
		myHeaders.append("accept", "application/json");
		myHeaders.append(
			"Authorization",
			`Bearer ${token ? JSON.parse(token) : ""}`
		);

		const formData = new FormData();
		if (data?.id) formData.append("market_of_sector_id", data.id.toString());
		if (OfferValue !== null)
			formData.append("asking_price", OfferValue.toString());
		if (NumberOfShares !== null)
			formData.append("number_of_shares", NumberOfShares.toString());

		try {
			const response = await fetch(
				"https://quttouf.com/api/user/sectors/buy-shares",
				{
					method: "POST",
					headers: myHeaders,
					body: formData,
				}
			);

			const result = await response.json();

			console.log(result);

			if (response.ok) {
				toast.success(result.message);
				setIsOpen(false);
				setIsLoading(false);
			} else {
				toast.error(result.message);
				setIsLoading(false);
				setIsOpen(false);
			}
		} catch (error) {
			console.error(error);
			setIsOpen(false);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					`https://quttouf.com/api/user/market/${sectorId}`
				);
				const result = await response.json();
				setData(result.data);
				console.log(result.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		const fetchRelatedBlogs = async () => {
			const token =
				typeof window !== "undefined" && localStorage.getItem("token");
			const direction =
				typeof window !== "undefined" && localStorage.getItem("direction");

			const myHeaders = new Headers();
			myHeaders.append("accept", "application/json");
			myHeaders.append(
				"Authorization",
				`Bearer ${token ? JSON.parse(token) : ""}`
			);
			myHeaders.append("Accept-Language", direction == "ltr" ? "en" : "ar");

			try {
				const response = await fetch(
					`https://quttouf.com/api/user/blogs?sector_id=${sectorId}`,
					{
						headers: myHeaders,
					}
				);
				const result = await response.json();
				setRelatedBlogs(result.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
		fetchRelatedBlogs();
	}, [sectorId]); // Empty dependency array ensures this runs only once after the component mounts

	const handleDownload = (pdfLink: string) => {
		const link = document.createElement("a"); // Create a temporary link element
		link.href = pdfLink; // Path to the PDF in the public folder
		link.download = pdfLink; // Name of the downloaded file
		link.target = "_blank";
		link.click(); // Trigger the click event
	};

	const t = useTranslations("SectorDetails");

	return (
		<>
			<Breadcrumb
				items={[
					{ label: t("Sectors"), href: "/sectors" },
					{ label: data?.sector.title, href: `/sectors/${sectorId}` },
				]}
			/>
			<div className='mx-auto max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl py-20 md:py-32'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12'>
					<ImageSlider images={images} />
					<div>
						<h3 className='text-[#121212] text-[28px] font-[500] mb-2'>
							{data?.sector.title}
						</h3>
						<span className='flex items-center gap-2 text-[24px] pb-6 mb-6 border-b border-[#F1F1F1]'>
							<FaStar className='text-yellow-500' />
							{data?.sector.company_rate}
						</span>
						<p className='text-[#444444] text-[14px] font-[400] leading-[28px] mb-8'>
							{data?.sector.description}
						</p>
						<ul className='grid grid-cols-1 lg:grid-cols-2 gap-4 pb-6 mb-6 border-b border-[#F1F1F1]'>
							<li className='flex items-center gap-3'>
								<span className='w-14 h-14 rounded-[50%] bg-[#E6F4EC] flex items-center justify-center'>
									<svg
										width='28'
										height='28'
										viewBox='0 0 28 28'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
									>
										<path
											d='M24.5 26.5417H3.5C3.02167 26.5417 2.625 26.1451 2.625 25.6667C2.625 25.1884 3.02167 24.7917 3.5 24.7917H24.5C24.9783 24.7917 25.375 25.1884 25.375 25.6667C25.375 26.1451 24.9783 26.5417 24.5 26.5417Z'
											fill='#009444'
										/>
										<path
											d='M24.5 3.20825H3.5C3.02167 3.20825 2.625 2.81159 2.625 2.33325C2.625 1.85492 3.02167 1.45825 3.5 1.45825H24.5C24.9783 1.45825 25.375 1.85492 25.375 2.33325C25.375 2.81159 24.9783 3.20825 24.5 3.20825Z'
											fill='#009444'
										/>
										<path
											d='M16.6833 17.9199L14.8749 19.7282V7.81655L16.6833 9.62489C16.8583 9.79989 17.0799 9.88155 17.3016 9.88155C17.5233 9.88155 17.7449 9.79989 17.9199 9.62489C18.2583 9.28655 18.2583 8.72655 17.9199 8.38822L14.6183 5.08655C14.2916 4.75989 13.7083 4.75989 13.3816 5.08655L10.0799 8.38822C9.74159 8.72655 9.74159 9.28655 10.0799 9.62489C10.4183 9.96322 10.9783 9.96322 11.3166 9.62489L13.1249 7.81655V19.7282L11.3166 17.9199C10.9783 17.5816 10.4183 17.5816 10.0799 17.9199C9.74159 18.2582 9.74159 18.8182 10.0799 19.1566L13.3816 22.4582C13.5449 22.6216 13.7666 22.7149 13.9999 22.7149C14.2333 22.7149 14.4549 22.6216 14.6183 22.4582L17.9199 19.1566C18.2583 18.8182 18.2583 18.2582 17.9199 17.9199C17.5816 17.5816 17.0216 17.5816 16.6833 17.9199Z'
											fill='#009444'
										/>
									</svg>
								</span>
								<div className='flex flex-col'>
									<span className='text-[#656565] text-[14px] font-[400]'>
										{t("LandArea")}
									</span>
									<p className='text-[#000] text-[18px] font-[500]'>
										{data?.sector.land_area} m
									</p>
								</div>
							</li>
							<li className='flex items-center gap-3'>
								<span className='w-14 h-14 rounded-[50%] bg-[#E6F4EC] flex items-center justify-center'>
									<svg
										width='28'
										height='28'
										viewBox='0 0 28 28'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
									>
										<path
											d='M18.889 2.33325H9.11232C4.86565 2.33325 2.33398 4.86492 2.33398 9.11159V18.8766C2.33398 23.1349 4.86565 25.6666 9.11232 25.6666H18.8773C23.124 25.6666 25.6556 23.1349 25.6556 18.8883V9.11159C25.6673 4.86492 23.1357 2.33325 18.889 2.33325ZM19.694 13.4516C19.694 13.9066 19.3323 14.2683 18.8773 14.2683C18.4223 14.2683 18.0606 13.9066 18.0606 13.4516V13.2416L14.8873 16.4149C14.7123 16.5899 14.479 16.6716 14.234 16.6483C13.989 16.6249 13.7673 16.4966 13.639 16.2866L12.449 14.5133L9.67232 17.2899C9.50898 17.4533 9.31065 17.5233 9.10065 17.5233C8.89065 17.5233 8.68065 17.4416 8.52898 17.2899C8.21398 16.9749 8.21398 16.4616 8.52898 16.1349L12.0057 12.6583C12.1807 12.4833 12.414 12.4016 12.659 12.4249C12.904 12.4483 13.1257 12.5766 13.254 12.7866L14.444 14.5599L16.9057 12.0983H16.6957C16.2407 12.0983 15.879 11.7366 15.879 11.2816C15.879 10.8266 16.2407 10.4649 16.6957 10.4649H18.8657C18.9706 10.4649 19.0757 10.4883 19.1807 10.5233C19.379 10.6049 19.5423 10.7683 19.624 10.9666C19.6707 11.0716 19.6823 11.1766 19.6823 11.2816V13.4516H19.694Z'
											fill='#009444'
										/>
									</svg>
								</span>
								<div className='flex flex-col'>
									<span className='text-[#656565] text-[14px] font-[400]'>
										{t("NumberOfCompanyShares")}
									</span>
									<p className='text-[#000] text-[18px] font-[500]'>
										{data?.number_of_shares}
									</p>
								</div>
							</li>
							<li className='flex items-center gap-3'>
								<span className='w-14 h-14 rounded-[50%] bg-[#E6F4EC] flex items-center justify-center'>
									<svg
										width='28'
										height='28'
										viewBox='0 0 28 28'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
									>
										<path
											d='M17.9544 6.07825L19.5994 9.36825C19.821 9.82325 20.416 10.2549 20.9177 10.3482L23.8927 10.8382C25.7944 11.1532 26.2377 12.5299 24.8727 13.9066L22.551 16.2282C22.166 16.6132 21.9444 17.3716 22.0727 17.9199L22.7377 20.7899C23.2627 23.0532 22.0494 23.9399 20.0544 22.7499L17.266 21.0933C16.7644 20.7899 15.9244 20.7899 15.4227 21.0933L12.6344 22.7499C10.6394 23.9283 9.42603 23.0532 9.95103 20.7899L10.616 17.9199C10.721 17.3599 10.4994 16.6016 10.1144 16.2166L7.7927 13.8949C6.4277 12.5299 6.87103 11.1532 8.7727 10.8266L11.7477 10.3366C12.2494 10.2549 12.8444 9.81158 13.066 9.35658L14.711 6.06658C15.6094 4.29325 17.056 4.29325 17.9544 6.07825Z'
											fill='#009444'
										/>
										<path
											d='M9.33398 6.70825H2.33398C1.85565 6.70825 1.45898 6.31159 1.45898 5.83325C1.45898 5.35492 1.85565 4.95825 2.33398 4.95825H9.33398C9.81232 4.95825 10.209 5.35492 10.209 5.83325C10.209 6.31159 9.81232 6.70825 9.33398 6.70825Z'
											fill='#009444'
										/>
										<path
											d='M5.83398 23.0417H2.33398C1.85565 23.0417 1.45898 22.6451 1.45898 22.1667C1.45898 21.6884 1.85565 21.2917 2.33398 21.2917H5.83398C6.31232 21.2917 6.70898 21.6884 6.70898 22.1667C6.70898 22.6451 6.31232 23.0417 5.83398 23.0417Z'
											fill='#009444'
										/>
										<path
											d='M3.50065 14.875H2.33398C1.85565 14.875 1.45898 14.4783 1.45898 14C1.45898 13.5217 1.85565 13.125 2.33398 13.125H3.50065C3.97898 13.125 4.37565 13.5217 4.37565 14C4.37565 14.4783 3.97898 14.875 3.50065 14.875Z'
											fill='#009444'
										/>
									</svg>
								</span>
								<div className='flex flex-col'>
									<span className='text-[#656565] text-[14px] font-[400]'>
										{t("OfferedByTheCompany")}
									</span>
									<p className='text-[#000] text-[18px] font-[500]'>
										{data?.sector.offered_by_company}
									</p>
								</div>
							</li>
							<li className='flex items-center gap-3'>
								<span className='w-14 h-14 rounded-[50%] bg-[#E6F4EC] flex items-center justify-center'>
									<svg
										width='28'
										height='28'
										viewBox='0 0 28 28'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
									>
										<path
											d='M11.959 11.7017C11.959 12.3317 12.134 12.4251 12.5307 12.5651L13.1257 12.7751V10.7917H12.7757C12.3323 10.7917 11.959 11.2001 11.959 11.7017Z'
											fill='#009444'
										/>
										<path
											d='M14.875 17.2084H15.225C15.68 17.2084 16.0417 16.8001 16.0417 16.2984C16.0417 15.6684 15.8667 15.5751 15.47 15.4351L14.875 15.2251V17.2084Z'
											fill='#009444'
										/>
										<path
											d='M22.844 6.39325L20.4523 8.78492C20.2773 8.95992 20.0557 9.04158 19.834 9.04158C19.6123 9.04158 19.3906 8.95992 19.2157 8.78492C18.8773 8.44659 18.8773 7.88658 19.2157 7.54825L21.6073 5.15659C19.554 3.40659 16.9057 2.33325 14.0007 2.33325C7.56065 2.33325 2.33398 7.55992 2.33398 13.9999C2.33398 20.4399 7.56065 25.6666 14.0007 25.6666C20.4407 25.6666 25.6673 20.4399 25.6673 13.9999C25.6673 11.0949 24.594 8.44659 22.844 6.39325ZM16.0423 13.7899C16.789 14.0583 17.7923 14.5949 17.7923 16.3099C17.7923 17.7683 16.6373 18.9699 15.2257 18.9699H14.8757V19.2616C14.8757 19.7399 14.479 20.1366 14.0007 20.1366C13.5223 20.1366 13.1257 19.7399 13.1257 19.2616V18.9699H13.0323C11.4807 18.9699 10.209 17.6633 10.209 16.0533C10.209 15.5633 10.6057 15.1666 11.084 15.1666C11.5623 15.1666 11.959 15.5633 11.959 16.0416C11.959 16.6833 12.4373 17.2083 13.0323 17.2083H13.1257V14.6183L11.959 14.2099C11.2123 13.9416 10.209 13.4049 10.209 11.6899C10.209 10.2316 11.364 9.02992 12.7757 9.02992H13.1257V8.74992C13.1257 8.27158 13.5223 7.87492 14.0007 7.87492C14.479 7.87492 14.8757 8.27158 14.8757 8.74992V9.04158H14.969C16.5207 9.04158 17.7923 10.3483 17.7923 11.9583C17.7923 12.4366 17.3957 12.8333 16.9173 12.8333C16.439 12.8333 16.0423 12.4366 16.0423 11.9583C16.0423 11.3166 15.564 10.7916 14.969 10.7916H14.8757V13.3816L16.0423 13.7899Z'
											fill='#009444'
										/>
										<path
											d='M26.4717 1.99492C26.3783 1.78492 26.215 1.60992 25.9933 1.51659C25.8883 1.48159 25.7833 1.45825 25.6667 1.45825H21C20.5217 1.45825 20.125 1.85492 20.125 2.33325C20.125 2.81159 20.5217 3.20825 21 3.20825H23.555L21.6067 5.15659C22.05 5.54159 22.4583 5.94992 22.8433 6.39325L24.7917 4.44492V6.99992C24.7917 7.47825 25.1883 7.87492 25.6667 7.87492C26.145 7.87492 26.5417 7.47825 26.5417 6.99992V2.33325C26.5417 2.21659 26.5183 2.11159 26.4717 1.99492Z'
											fill='#009444'
										/>
									</svg>
								</span>
								<div className='flex flex-col'>
									<span className='text-[#656565] text-[14px] font-[400]'>
										{t("SharePrice")}
									</span>
									<p className='text-[#000] text-[18px] font-[500]'>
										{data?.share_price} {t("currency")}
									</p>
								</div>
							</li>
							<li className='flex items-center gap-3'>
								<span className='w-14 h-14 rounded-[50%] bg-[#E6F4EC] flex items-center justify-center'>
									<svg
										width='28'
										height='28'
										viewBox='0 0 28 28'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
									>
										<path
											d='M14.875 18.5733H15.6333C16.3917 18.5733 17.0217 17.8966 17.0217 17.08C17.0217 16.065 16.66 15.8666 16.065 15.6566L14.8867 15.2483V18.5733H14.875Z'
											fill='#009444'
										/>
										<path
											d='M13.9657 2.21657C7.52573 2.23991 2.31073 7.47824 2.33406 13.9182C2.3574 20.3582 7.59573 25.5732 14.0357 25.5499C20.4757 25.5266 25.6907 20.2882 25.6674 13.8482C25.6441 7.40824 20.4057 2.20491 13.9657 2.21657ZM16.6374 13.9999C17.5474 14.3149 18.7724 14.9916 18.7724 17.0799C18.7724 18.8766 17.3607 20.3232 15.6341 20.3232H14.8757V20.9999C14.8757 21.4782 14.4791 21.8749 14.0007 21.8749C13.5224 21.8749 13.1257 21.4782 13.1257 20.9999V20.3232H12.7057C10.7924 20.3232 9.24073 18.7132 9.24073 16.7299C9.24073 16.2516 9.6374 15.8549 10.1157 15.8549C10.5941 15.8549 10.9907 16.2516 10.9907 16.7299C10.9907 17.7449 11.7607 18.5732 12.7057 18.5732H13.1257V14.6299L11.3641 13.9999C10.4541 13.6849 9.22906 13.0082 9.22906 10.9199C9.22906 9.12324 10.6407 7.67657 12.3674 7.67657H13.1257V6.99991C13.1257 6.52157 13.5224 6.12491 14.0007 6.12491C14.4791 6.12491 14.8757 6.52157 14.8757 6.99991V7.67657H15.2957C17.2091 7.67657 18.7607 9.28657 18.7607 11.2699C18.7607 11.7482 18.3641 12.1449 17.8857 12.1449C17.4074 12.1449 17.0107 11.7482 17.0107 11.2699C17.0107 10.2549 16.2407 9.42657 15.2957 9.42657H14.8757V13.3699L16.6374 13.9999Z'
											fill='#009444'
										/>
										<path
											d='M10.9902 10.9318C10.9902 11.9468 11.3519 12.1451 11.9469 12.3551L13.1252 12.7634V9.42676H12.3669C11.6086 9.42676 10.9902 10.1034 10.9902 10.9318Z'
											fill='#009444'
										/>
									</svg>
								</span>
								<div className='flex flex-col'>
									<span className='text-[#656565] text-[14px] font-[400]'>
										{t("TotalPrice")}
									</span>
									<p className='text-[#000] text-[18px] font-[500]'>
										{data?.total_price} {t("currency")}
									</p>
								</div>
							</li>
						</ul>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<button
								className='space-x-6 text-[#16151C] h-14 w-full border border-[#DBDBDB] hover:bg-[#dbdbdb99] duration-300 hover:text-[#16151C] flex items-center justify-center rounded-[8px]'
								onClick={() =>
									handleDownload(data ? data?.sector?.pdf : "")
								}
							>
								<svg
									width='32'
									height='32'
									viewBox='0 0 32 32'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
									className='ltr:mr-2 rtl:ml-2'
								>
									<path
										d='M24.0999 2.07227L29.6639 7.87227V29.9283H8.87891V30.0003H29.7349V7.94527L24.0999 2.07227Z'
										fill='#909090'
									/>
									<path
										d='M24.0316 2H8.80859V29.928H29.6646V7.873L24.0316 2Z'
										fill='#F4F4F4'
									/>
									<path
										d='M8.65562 3.5H2.26562V10.327H22.3656V3.5H8.65562Z'
										fill='#7A7B7C'
									/>
									<path
										d='M22.4715 10.2109H2.39453V3.37891H22.4715V10.2109Z'
										fill='#DD2025'
									/>
									<path
										d='M9.05309 4.53465H7.74609V9.33465H8.77409V7.71565L9.00109 7.72865C9.22174 7.72561 9.44036 7.68608 9.64809 7.61165C9.83072 7.54964 9.99856 7.45057 10.1411 7.32065C10.2873 7.19809 10.4021 7.04246 10.4761 6.86665C10.5773 6.57537 10.6132 6.26536 10.5811 5.95865C10.5754 5.7395 10.537 5.52244 10.4671 5.31465C10.4041 5.16446 10.3105 5.02907 10.1922 4.91714C10.0739 4.80521 9.93354 4.71922 9.78009 4.66465C9.64781 4.61566 9.51071 4.5808 9.37109 4.56065C9.26563 4.54348 9.15895 4.53478 9.05209 4.53465M8.86309 6.82865H8.77409V5.34865H8.96709C9.05227 5.34251 9.13775 5.35559 9.21719 5.38691C9.29664 5.41824 9.36803 5.46702 9.42609 5.52965C9.54641 5.69067 9.61069 5.88665 9.60909 6.08765C9.60909 6.33365 9.60909 6.55665 9.38709 6.71365C9.2272 6.80172 9.04513 6.84234 8.86309 6.82865ZM12.5341 4.52165C12.4231 4.52165 12.3151 4.52965 12.2391 4.53265L12.0011 4.53865H11.2211V9.33865H12.1391C12.4899 9.34767 12.8391 9.28823 13.1671 9.16365C13.4312 9.05935 13.665 8.89054 13.8471 8.67265C14.0255 8.4538 14.153 8.19793 14.2201 7.92365C14.299 7.61358 14.3373 7.29458 14.3341 6.97465C14.3537 6.59681 14.3244 6.21802 14.2471 5.84765C14.1731 5.57534 14.036 5.32425 13.8471 5.11465C13.6989 4.94516 13.5166 4.80886 13.3121 4.71465C13.1369 4.63345 12.9526 4.57369 12.7631 4.53665C12.6877 4.5243 12.6114 4.51861 12.5351 4.51965M12.3531 8.45665H12.2531V5.39265H12.2661C12.4723 5.36881 12.6809 5.40602 12.8661 5.49965C13.0018 5.60798 13.1123 5.74445 13.1901 5.89965C13.274 6.06299 13.3224 6.24226 13.3321 6.42565C13.3411 6.64565 13.3321 6.82565 13.3321 6.97465C13.3358 7.14628 13.3248 7.31791 13.2991 7.48765C13.2676 7.66172 13.2107 7.83019 13.1301 7.98765C13.039 8.1345 12.9147 8.25783 12.7671 8.34765C12.6438 8.42766 12.4976 8.4649 12.3511 8.45365M17.4311 4.53865H15.0011V9.33865H16.0291V7.43465H17.3291V6.54265H16.0291V5.43065H17.4291V4.53865'
										fill='#464648'
									/>
									<path
										d='M21.7807 20.2555C21.7807 20.2555 24.9687 19.6775 24.9687 20.7665C24.9687 21.8555 22.9937 21.4125 21.7807 20.2555ZM19.4237 20.3385C18.9171 20.4501 18.4235 20.614 17.9507 20.8275L18.3507 19.9275C18.7507 19.0275 19.1657 17.8005 19.1657 17.8005C19.6418 18.6046 20.1972 19.359 20.8237 20.0525C20.3521 20.1228 19.8847 20.2189 19.4237 20.3405V20.3385ZM18.1617 13.8385C18.1617 12.8895 18.4687 12.6305 18.7077 12.6305C18.9467 12.6305 19.2157 12.7455 19.2247 13.5695C19.1467 14.398 18.9732 15.2148 18.7077 16.0035C18.3427 15.3418 18.1543 14.5972 18.1607 13.8415L18.1617 13.8385ZM13.5127 24.3545C12.5347 23.7695 15.5637 21.9685 16.1127 21.9105C16.1097 21.9115 14.5367 24.9665 13.5127 24.3545ZM25.8997 20.8955C25.8897 20.7955 25.7997 19.6885 23.8297 19.7355C23.0085 19.7211 22.1877 19.779 21.3767 19.9085C20.5906 19.1172 19.9139 18.2243 19.3647 17.2535C19.7105 16.2528 19.92 15.2101 19.9877 14.1535C19.9587 12.9535 19.6717 12.2655 18.7517 12.2755C17.8317 12.2855 17.6977 13.0905 17.8187 14.2885C17.9371 15.0936 18.1607 15.8796 18.4837 16.6265C18.4837 16.6265 18.0587 17.9495 17.4967 19.2655C16.9347 20.5815 16.5507 21.2715 16.5507 21.2715C15.5733 21.5893 14.6532 22.062 13.8257 22.6715C13.0017 23.4385 12.6667 24.0275 13.1007 24.6165C13.4747 25.1245 14.7837 25.2395 15.9537 23.7065C16.5743 22.9139 17.1422 22.0815 17.6537 21.2145C17.6537 21.2145 19.4377 20.7255 19.9927 20.5915C20.5477 20.4575 21.2187 20.3515 21.2187 20.3515C21.2187 20.3515 22.8477 21.9905 24.4187 21.9325C25.9897 21.8745 25.9137 20.9935 25.9037 20.8975'
										fill='#DD2025'
									/>
									<path
										d='M23.9531 2.07617V7.94917H29.5861L23.9531 2.07617Z'
										fill='#909090'
									/>
									<path
										d='M24.0312 2V7.873H29.6642L24.0312 2Z'
										fill='#F4F4F4'
									/>
									<path
										d='M8.97497 4.45653H7.66797V9.25653H8.69997V7.63853L8.92797 7.65153C9.14861 7.64849 9.36723 7.60895 9.57497 7.53453C9.75759 7.47252 9.92543 7.37345 10.068 7.24353C10.213 7.12063 10.3268 6.96502 10.4 6.78953C10.5012 6.49824 10.5371 6.18823 10.505 5.88153C10.4993 5.66238 10.4608 5.44531 10.391 5.23753C10.328 5.08734 10.2344 4.95194 10.1161 4.84002C9.99778 4.72809 9.85741 4.64209 9.70397 4.58753C9.57108 4.53806 9.4333 4.50286 9.29297 4.48253C9.1875 4.46535 9.08083 4.45666 8.97397 4.45653M8.78497 6.75053H8.69597V5.27053H8.88997C8.97515 5.26438 9.06062 5.27746 9.14007 5.30879C9.21952 5.34012 9.29091 5.3889 9.34897 5.45153C9.46929 5.61254 9.53356 5.80853 9.53197 6.00953C9.53197 6.25553 9.53197 6.47853 9.30997 6.63553C9.15008 6.7236 8.968 6.76321 8.78597 6.74953M12.456 4.44353C12.345 4.44353 12.237 4.45153 12.161 4.45453L11.926 4.46053H11.146V9.26053H12.064C12.4148 9.26955 12.7639 9.21011 13.092 9.08553C13.3561 8.98122 13.5899 8.81242 13.772 8.59453C13.9504 8.37568 14.0778 8.11981 14.145 7.84553C14.2238 7.53545 14.2622 7.21646 14.259 6.89653C14.2785 6.51868 14.2493 6.13989 14.172 5.76953C14.0979 5.49722 13.9609 5.24613 13.772 5.03653C13.6238 4.86704 13.4415 4.73073 13.237 4.63653C13.0618 4.55533 12.8775 4.49556 12.688 4.45853C12.6126 4.44618 12.5363 4.44049 12.46 4.44153M12.278 8.37853H12.178V5.31453H12.191C12.3971 5.29069 12.6058 5.32789 12.791 5.42153C12.9266 5.52985 13.0372 5.66633 13.115 5.82153C13.1989 5.98486 13.2473 6.16413 13.257 6.34753C13.266 6.56753 13.257 6.74753 13.257 6.89653C13.2607 7.06816 13.2496 7.23979 13.224 7.40953C13.1925 7.58359 13.1356 7.75207 13.055 7.90953C12.9639 8.05637 12.8396 8.1797 12.692 8.26953C12.5687 8.34953 12.4225 8.38678 12.276 8.37553M17.353 4.46053H14.923V9.26053H15.951V7.35653H17.251V6.46453H15.951V5.35253H17.351V4.46053'
										fill='white'
									/>
								</svg>
								Project details. pdf{" "}
								<svg
									width='24'
									height='22'
									viewBox='0 0 24 22'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										d='M15.26 19.8627H8.73998C3.82998 19.8627 1.72998 18.0469 1.72998 13.8015V13.6891C1.72998 9.85003 3.47998 7.99969 7.39998 7.67977C7.79998 7.65383 8.17998 7.91322 8.21998 8.26773C8.25998 8.62223 7.95998 8.94215 7.53998 8.97674C4.39998 9.22749 3.22998 10.5072 3.22998 13.6977V13.8101C3.22998 17.3292 4.66998 18.5743 8.73998 18.5743H15.26C19.33 18.5743 20.77 17.3292 20.77 13.8101V13.6977C20.77 10.4899 19.58 9.21019 16.38 8.97674C15.97 8.94215 15.66 8.63088 15.7 8.27637C15.74 7.92187 16.09 7.65383 16.51 7.68841C20.49 7.98239 22.27 9.84139 22.27 13.7064V13.8188C22.27 18.0469 20.17 19.8627 15.26 19.8627Z'
										fill='#16151C'
									/>
									<path
										d='M12 14.1387C11.59 14.1387 11.25 13.8447 11.25 13.4902V2.35356C11.25 1.99906 11.59 1.70508 12 1.70508C12.41 1.70508 12.75 1.99906 12.75 2.35356V13.4902C12.75 13.8534 12.41 14.1387 12 14.1387Z'
										fill='#16151C'
									/>
									<path
										d='M11.9998 15.1072C11.8098 15.1072 11.6198 15.0466 11.4698 14.9169L8.11984 12.0204C7.82984 11.7696 7.82984 11.3546 8.11984 11.1038C8.40984 10.8531 8.88984 10.8531 9.17984 11.1038L11.9998 13.5421L14.8198 11.1038C15.1098 10.8531 15.5898 10.8531 15.8798 11.1038C16.1698 11.3546 16.1698 11.7696 15.8798 12.0204L12.5298 14.9169C12.3798 15.0466 12.1898 15.1072 11.9998 15.1072Z'
										fill='#16151C'
									/>
								</svg>
							</button>
							<Button className='px-4' onClick={handleOpenModal}>
								{t("BuyNow")}
							</Button>
						</div>
					</div>
				</div>

				<Tabs
					tabs={[
						{
							id: "tab1",
							label: "Project schedule",
							content: () => {
								return (
									<ul className='list-disc w-full lg:w-2/3'>
										<li className='flex items-center justify-between pb-3 mb-3 border-b border-[#F1F1F1] text-[#656565]'>
											Launch Start :{" "}
											<span className='text-[#121212] text-[16px] font-[400]'>
												{data?.sector.launch_start}
											</span>
										</li>
										<li className='flex items-center justify-between pb-3 mb-3 border-b border-[#F1F1F1] text-[#656565]'>
											Construction Start :{" "}
											<span className='text-[#121212] text-[16px] font-[400]'>
												{data?.sector.construction_start}
											</span>
										</li>
										<li className='flex items-center justify-between pb-3 mb-3 border-b border-[#F1F1F1] text-[#656565]'>
											Construction End Date :{" "}
											<span className='text-[#121212] text-[16px] font-[400]'>
												{data?.sector.construction_end}
											</span>
										</li>
										<li className='flex items-center justify-between text-[#656565]'>
											Production Start Date :{" "}
											<span className='text-[#121212] text-[16px] font-[400]'>
												{data?.sector.production_start}
											</span>
										</li>
									</ul>
								);
							},
						},
					]}
					defaultTab='tab1'
					className='w-full lg:w-1/2 flex flex-col justify-start items-start mb-16'
				/>

				<div className='text-center mb-10'>
					<h2
						data-aos='fade-zoom-in'
						data-aos-duration='500'
						data-aos-delay='0'
						className='text-[26px] md:text-[40px] text-[#252525] font-[500]'
					>
						Related Blogs
					</h2>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					{RelatedBlogs?.map((BlogInfo) => (
						<BlogCard key={BlogInfo.id} blogInfo={BlogInfo} />
					))}
				</div>
			</div>

			<Modal
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
				}}
				title='Submitting an offer'
			>
				<ul className='space-y-2 list-disc mx-5 lg:mx-8 mb-8'>
					<li className='text-[14px] lg:text-[18px] text-[#525252] font-[400]'>
						You must be a member of the Qutoof community.{" "}
					</li>
					<li className='text-[14px] lg:text-[18px] text-[#525252] font-[400]'>
						A 1% fee is deducted from the total amount as a purchase fee.{" "}
					</li>
					<li className='text-[14px] lg:text-[18px] text-[#525252] font-[400]'>
						Approval from the seller and then the company is required, the
						company&apos;s approval process takes two business days.{" "}
					</li>
				</ul>

				<div className='mx-auto w-full lg:w-1/2 p-4 bg-gradient-to-b from-[#F4F8ED00] to-[#F4F8ED] rounded-[8px] border border-[#E5EDD3] mb-8 space-y-4'>
					<PriceInput
						maxValue={100000000}
						minValue={0}
						onChange={handleAskingPrice}
						initialValue={""}
						placeholder='Enter amount'
						label='I present an offer'
						currency={t("currency")}
					/>
					<PriceInput
						maxValue={100000000}
						minValue={0}
						onChange={handleNumberOfShares}
						initialValue={""}
						placeholder='Enter amount'
						label='Number of shares'
					/>
				</div>
				<ul className='space-y-2 list-disc mx-5 lg:mx-8 mb-6'>
					<li className='text-[14px] lg:text-[18px] text-[#525252] font-[400]'>
						You must have 20% of the required amount in your wallet, or
						deposit the amount into your wallet.
					</li>
					<li className='text-[14px] lg:text-[18px] text-[#525252] font-[400]'>
						You have a grace period of 5 days to deposit the remaining
						80%, either into your wallet or by transferring it to the
						offer owner, along with a copy of the transfer receipt.
					</li>
					<li className='text-[14px] lg:text-[18px] text-[#525252] font-[400]'>
						If there is a delay, we reserve the right to deduct 10% as
						compensation for the landowner, from which 2% will be deducted
						as fees.{" "}
					</li>
					<li className='text-[14px] lg:text-[18px] text-[#525252] font-[400]'>
						You must contact the company as soon as possible or request to
						send the contracts by mail.
					</li>
					<li className='text-[14px] lg:text-[18px] text-[#525252] font-[400]'>
						Contracts will be issued in the name shown on the ID, and for
						heirs in the event of death, they have the right to request
						the contracts and transfer ownership via official legal
						documentation.
					</li>
				</ul>

				<div className='w-full flex justify-end items-center gap-2 lg:gap-4 lg:px-2 pt-6 border-t border-[#F1F1F1]'>
					<Button
						variant='secondary'
						onClick={() => {
							setIsOpen(false);
						}}
					>
						{t("Cancel")}
					</Button>
					<Button onClick={handleSendOffer} disabled={IsLoading}>
						{IsLoading ? t("SendingOffer") : t("SendOffer")}
					</Button>
				</div>
			</Modal>
		</>
	);
};

export default SectorDetails;
