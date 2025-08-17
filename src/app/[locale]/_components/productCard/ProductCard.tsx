"use client";
import React, { useState } from "react";
import Button from "../button/Button";
import userImg from "@/media/user img.png";
import Image from "next/image";
import Modal from "../modal/Modal";
import PriceInput from "../amountInput/AmountInput";
import { useRouter } from "@/i18n/routing";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

interface AppProps {
	defaultPrice?: number;
	ProductInfo: {
		id: number;
		number_of_shares: number;
		share_price: number;
		company_evaluation: number;
		shares: number;
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
	};
}

const ProductCard = ({ ProductInfo }: AppProps) => {
	const [IsLoading, setIsLoading] = useState<boolean>(false);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [OfferValue, setOfferValue] = useState<number | null>(null);

	const handleSendOffer = async (
		sectorid: number | undefined,
		numberOfShares: number
	) => {
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
		if (sectorid) formData.append("market_of_sector_id", sectorid.toString());
		if (OfferValue !== null)
			formData.append("asking_price", OfferValue.toString());
		if (numberOfShares !== null)
			formData.append("number_of_shares", numberOfShares.toString());

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
				setIsLoading(false);
				setIsOpen(false);
			} else {
				toast.error(result.message);
				setIsLoading(false);
			}
		} catch (error) {
			console.error(error);
			setIsLoading(false);
		}
	};


	const router = useRouter();

	const t = useTranslations("HomePage");

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

	return (
		<>
			<div className='relative px-6 pb-6 pt-10 rounded-[20px] bg-gradient-to-t from-[#F4F8ED] to-[#F4F8ED00] w-full mt-16'>
				<div className='bg-[#F4F8ED] rounded-[50%] w-24 h-24 flex items-center justify-center absolute top-[-3rem] left-2'>
					<Image
						src={
							ProductInfo.sector.media[0]
								? ProductInfo.sector.media[0]
								: userImg
						}
						alt='user'
						width={50}
						height={50}
					/>
				</div>
				<p className='text-[14px] font-[500] text-black text-center mb-4'>
									// @ts-expect-error
				</p>
				<h6 className='text-[26px] text-[#009444] text-center font-[600] mb-8'>
					{ProductInfo.sector.title}
				</h6>
				<ul className='flex flex-col gap-4 w-full mb-8'>
					<li className='flex justify-between items-center'>
						<span className='text-[16px] text-[#656565] font-[400]'>
							{t("AskingPrice")}
						</span>
						<span className='text-[16px] text-[#000] font-[600]'>
							{ProductInfo.total_price}
						</span>
					</li>
					{/* <li className='flex justify-between items-center'>
						<span className='text-[16px] text-[#656565] font-[400]'>
							{t("CompanyEvaluation")}
									// @ts-expect-error PriceInput may accept value prop; if not, adjust implementation
						<span className='text-[16px] text-[#000] font-[600]'>
							{ProductInfo.company_evaluation}
						</span>
					</li> */}
					<li className='flex justify-between items-center'>
						<span className='text-[16px] text-[#656565] font-[400]'>
							{t("shares")}
						</span>
						<span className='text-[16px] text-[#000] font-[600]'>
							{ProductInfo.shares}
						</span>
					</li>
				</ul>
				<div className='grid grid-cols-2 gap-6'>
					<Button
						variant='outline'
						className='w-full'
						onClick={() =>
							router.push(
								`/our-projects/${ProductInfo.id}/sectors/${ProductInfo.sector.id}`
							)
						}
					>
						{t("ShowDetails")}
					</Button>
					<Button className='w-full' onClick={handleOpenModal}>
						{t("BuyNow")}
					</Button>
				</div>
			</div>

			<Modal
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
				}}
				title={t("OfferModal.title")}
			>
				<ul className='space-y-2 list-disc mx-8 mb-8'>
					<li className='text-[18px] text-[#525252] font-[400]'>
						{t("OfferModal.rule1")}
					</li>
					<li className='text-[18px] text-[#525252] font-[400]'>
						{t("OfferModal.rule2")}
					</li>
					<li className='text-[18px] text-[#525252] font-[400]'>
						{t("OfferModal.rule3")}
					</li>
				</ul>

				<div className='mx-auto w-full lg:w-1/2 p-4 bg-gradient-to-b from-[#F4F8ED00] to-[#F4F8ED] rounded-[8px] border border-[#E5EDD3] mb-8'>
					<p className='text-center text-[14px] text-[#000] font-[500] mb-2'>
						{ProductInfo.created_at.split(" ")[0]}
					</p>
					<h6 className='text-center text-[26px] text-[#009444] font-[600] mb-6'>
						{ProductInfo.sector.description}
					</h6>
					<ul className='w-full space-y-2 mb-8'>
						<li className='flex items-center justify-between'>
							<span className='text-[16px] text-[#656565] font-[400]'>
								{t("sector")}
							</span>
							<span className='text-[16px] text-[#000000] font-[400]'>
								{ProductInfo.sector.title}
							</span>
						</li>
						<li className='flex items-center justify-between'>
							<span className='text-[16px] text-[#656565] font-[400]'>
								{t("shares")}
							</span>
							<span className='text-[16px] text-[#000000] font-[400]'>
								{ProductInfo.shares}
							</span>
						</li>
						<li className='flex items-center justify-between'>
							<span className='text-[16px] text-[#656565] font-[400]'>
								{t("price")}
							</span>
							<span className='text-[16px] text-[#000000] font-[400]'>
								{ProductInfo.total_price}
							</span>
						</li>
					</ul>
					{/* This input will set the number_of_shares sent in handleSendOffer */}
					<PriceInput
						maxValue={100000000}
						minValue={0}
						onChange={(val: number) => {
							// mutate prop object so the latest value is used when calling handleSendOffer(ProductInfo.id, ProductInfo.number_of_shares)
							// @ts-ignore
							ProductInfo.number_of_shares = val;
						}}
						placeholder={t("OfferModal.numberSharesPlaceholder")}
						label={t("OfferModal.numberSharesLabel")}
						currency={t("OfferModal.sharesCurrency")}
					/>
					<div className='mt-4'>
						<PriceInput
							maxValue={100000000}
							minValue={0}
							onChange={(val: number) => {
								setOfferValue(val);
							}}
							placeholder={t("OfferModal.pricePlaceholder")}
							label={t("OfferModal.priceLabel")}
							// default to product total price
							// @ts-ignore PriceInput may accept value prop; if not, adjust implementation
							value={ProductInfo.total_price}
							currency={t("OfferModal.egCurrency")}
						/>
					</div>
				</div>
				<ul className='space-y-2 list-disc mx-8 mb-6'>
					<li className='text-[18px] text-[#525252] font-[400]'>{t("OfferModal.rule4")}</li>
					<li className='text-[18px] text-[#525252] font-[400]'>{t("OfferModal.rule5")}</li>
					<li className='text-[18px] text-[#525252] font-[400]'>{t("OfferModal.rule6")}</li>
					<li className='text-[18px] text-[#525252] font-[400]'>{t("OfferModal.rule7")}</li>
					<li className='text-[18px] text-[#525252] font-[400]'>{t("OfferModal.rule8")}</li>
				</ul>

				<div className='w-full flex justify-end items-center gap-4 px-2 pt-6 border-t border-[#F1F1F1]'>
					<Button
						variant='secondary'
						onClick={() => {
							setIsOpen(false);
						}}
					>
						{t("OfferModal.cancel")}
					</Button>
					<Button
						onClick={() =>
							handleSendOffer(
								ProductInfo.id,
								ProductInfo.number_of_shares
							)
						}
						disabled={IsLoading}
					>
						{IsLoading ? t("OfferModal.sending") : t("OfferModal.send")}
					</Button>
				</div>
			</Modal>
		</>
	);
};

export default ProductCard;
