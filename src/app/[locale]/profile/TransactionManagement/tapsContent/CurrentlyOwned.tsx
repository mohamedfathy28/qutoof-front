import Spinner from "@/app/[locale]/_components/spinner/Spinner";
import PriceInput from "../../../_components/amountInput/AmountInput";
import Button from "../../../_components/button/Button";
import Modal from "../../../_components/modal/Modal";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

interface IRecord {
	id: number; // record id (kept for key rendering)
	sector_id: number; // backend sector identifier we now use for selling
	number_of_shares: number;
	price: number | string;
	sector: {
		id: number; // may duplicate sector_id
		title: string;
		company_rate: number;
		description?: string;
	};
	created_at?: string;
}

interface Props {
	data: IRecord[];
	loading?: boolean;
}

const RenderCurrentlyOwned: React.FC<Props> = ({ data, loading }) => {
	const [IsSelling, setIsSelling] = useState<boolean>(false);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [OfferValue, setOfferValue] = useState<number | null>(null);
	const [NumberOfShares, setNumberOfShares] = useState<number | null>(null);
	const [CurrentSectorId, setCurrentSectorId] = useState<number | undefined>(); // will store sector_id

	const t = useTranslations("profile.transaction_management");

	const handleSell = async (sectorId: number | undefined) => {
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

		const formData = new FormData();
		// Use new field name sector_id instead of market_of_sector_id
		if (sectorId) formData.append("market_of_sector_id", sectorId.toString());
		if (OfferValue !== null)
			formData.append("asking_price", OfferValue.toString());
		if (NumberOfShares !== null)
			formData.append("number_of_shares", NumberOfShares.toString());

		try {
			const response = await fetch(
				"https://quttouf.com/api/user/sectors/sell-shares",
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
				setIsSelling(false);
				// Optionally trigger a refetch via an event or callback prop
			} else {
				toast.error(result.message);
				setIsSelling(false);
			}
		} catch (error) {
			console.error(error);
			setIsSelling(false);
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

	if (loading) return <Spinner />;

	return (
		<>
			<div className='flex flex-col lg:grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{data?.length !== 0 ? (
					data?.map((ele) => (
						<div
							key={ele.id}
							className='px-4 py-6 lg:px-6 lg:py-8  rounded-[20px] bg-[#fff] w-full'
						>
							<p className='text-[14px] font-[500] text-black text-center mb-4'>
								{(ele.created_at || "").split(" ")[0]}
							</p>
							<h6 className='text-[26px] text-[#009444] text-center font-[600] mb-8'>
								{ele.sector.title}
							</h6>
							<ul className='flex flex-col gap-4 w-full mb-8'>
								<li className='flex justify-between items-center'>
									<span className='text-[16px] text-[#656565] font-[400]'>
										{ele.sector.description}
									</span>

								</li>
								<li className='flex justify-between items-center'>
									<span className='text-[16px] text-[#656565] font-[400]'>
										{t("Number_Shares")}
									</span>
									<span className='text-[16px] text-[#000] font-[600]'>
										{ele.number_of_shares}
									</span>
								</li>
								<li className='flex justify-between items-center'>
									<span className='text-[16px] text-[#656565] font-[400]'>
										{t("asking_price")}
									</span>
									<span className='text-[16px] text-[#000] font-[600]'>
										{ele.price}
									</span>
								</li>
								<li className='flex justify-between items-center'>
									<span className='text-[16px] text-[#656565] font-[400]'>
										{t("company_evaluation")}
									</span>
									<span className='text-[16px] text-[#000] font-[600]'>
										{ele.sector.company_rate}
									</span>
								</li>
							</ul>
							<div className='w-full flex justify-center'>
								<Button
									className='w-28 h-12'
									onClick={() => {
										setIsOpen(true);
										setCurrentSectorId(ele?.sector_id);
									}}
								>
									{t("Sell")}
								</Button>
							</div>
						</div>
					))
				) : (
					<h3 className='col-span-3 text-[20px] text-center text-[#009444] font-[700]'>
						{t("no_records")}
					</h3>
				)}

				{/* Pagination removed */}
			</div>

			<Modal
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
				}}
				title={t("Offer Submission Details")}
				className='max-w-lg p-8'
			>
				<div className='space-y-6 pb-8 mb-8 border-b border-[#F1F1F1]'>
					<div className='space-y-1'>
						<label className='block text-sm font-medium text-[#32363D]'>
							{t("Number_Shares")}
						</label>
						<input
							type='number'
							min={0}
							max={data.find(r => r.sector_id === CurrentSectorId)?.number_of_shares ?? 0}
							value={NumberOfShares ?? ""}
							onChange={e => {
								const raw = e.target.value;
								const max = data.find(r => r.sector_id === CurrentSectorId)?.number_of_shares ?? 0;
								const parsed = raw === "" ? null : Math.min(Math.max(0, parseInt(raw, 10)), max);
								setNumberOfShares(parsed);
								if (parsed !== null) handleNumberOfShares(parsed);
							}}
							placeholder={`${t("Enter_amount")} (≤ ${data.find(r => r.sector_id === CurrentSectorId)?.number_of_shares ?? 0
								})`}
							className='w-full h-12 rounded-lg border border-[#E4E6EA] px-3 outline-none focus:ring-2 focus:ring-[#009444]'
						/>
						<p className='text-xs text-[#656565]'>
							{t("Max")}: {data.find(r => r.sector_id === CurrentSectorId)?.number_of_shares ?? 0}
						</p>
					</div>
					<div className='space-y-1'>
						<PriceInput
							maxValue={100000000}
							minValue={0}
							onChange={handleAskingPrice}
							initialValue={""}
							placeholder={t("Enter_amount")}
							label={t("Asking_Price")}
							currency='EGP'
						/>
					</div>
				</div>

				<div className='w-full flex justify-end gap-4'>
					<Button
						variant='ghost'
						className='w-28 h-12 border border-[#E4E6EA] rounded-[8px] text-[#32363D]'
						onClick={() => {
							setIsOpen(false);
						}}
					>
						Cancel
					</Button>
					<Button
						className='w-28 h-12'
						onClick={() => {
							handleSell(CurrentSectorId);
						}}
					>
						{IsSelling ? t("Loading") : t("Confirm")}
					</Button>
				</div>
			</Modal>
		</>
	);
};

export default RenderCurrentlyOwned;
