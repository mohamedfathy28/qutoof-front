import Spinner from "@/app/[locale]/_components/spinner/Spinner";
import PriceInput from "../../../_components/amountInput/AmountInput";
import Button from "../../../_components/button/Button";
import Modal from "../../../_components/modal/Modal";
import Pagination from "../../../_components/pagination/Pagination";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

interface IProject {
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
		id: number;
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

const RenderCurrentlyOwned = () => {
	const [isLoading, setisLoading] = useState<boolean>(true);
	const [IsSelling, setIsSelling] = useState<boolean>(false);
	const [data, setData] = useState<IProject[]>([]);
	const [totalPages, setTotalPages] = useState<number>();
	const [CurrentPage, setCurrentPage] = useState<number>(1);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [OfferValue, setOfferValue] = useState<number | null>(null);
	const [NumberOfShares, setNumberOfShares] = useState<number | null>(null);
	const [CurrentSectorId, setCurrentSectorId] = useState<number | undefined>();

	const t = useTranslations("profile.transaction_management");

	const handleSell = async (sectorid: number | undefined) => {
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
		if (sectorid) formData.append("market_of_sector_id", sectorid.toString());
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
				fetchData();
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

	const fetchData = async () => {
		const token =
			typeof window !== "undefined" && localStorage.getItem("token");
		const PerPage = 6;
		const myHeaders = new Headers();
		myHeaders.append("accept", "application/json");
		myHeaders.append(
			"Authorization",
			`Bearer ${token ? JSON.parse(token) : ""}`
		);

		try {
			const response = await fetch(
				`https://quttouf.com/api/user/sectors/currently-owned?per_page=${PerPage}&page=${CurrentPage}`,
				{
					headers: myHeaders,
				}
			);
			const result = await response.json();
			setData(result.data);
			console.log(result.data, "result");
			setTotalPages(result?.pages);
			setCurrentPage(result?.current_page);
			setisLoading(false);
		} catch (error) {
			console.error("Error fetching data:", error);
			setisLoading(false);
		}
	};
	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [CurrentPage]); // Empty dependency array ensures this runs only once after the component mounts

	if (isLoading) return <Spinner />;

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
								{ele.created_at.split(" ")[0]}
							</p>
							<h6 className='text-[26px] text-[#009444] text-center font-[600] mb-8'>
								{ele.sector.title}
							</h6>
							<ul className='flex flex-col gap-4 w-full mb-8'>
								<li className='flex justify-between items-center'>
									<span className='text-[16px] text-[#656565] font-[400]'>
										{t("sector")}
									</span>
									<span className='text-[16px] text-[#000] font-[600]'>
										{ele.sector.id}
									</span>
								</li>
								<li className='flex justify-between items-center'>
									<span className='text-[16px] text-[#656565] font-[400]'>
										{t("asking_price")}
									</span>
									<span className='text-[16px] text-[#000] font-[600]'>
										{ele.total_price}
									</span>
								</li>
								<li className='flex justify-between items-center'>
									<span className='text-[16px] text-[#656565] font-[400]'>
										{t("company_evaluation")}
									</span>
									<span className='text-[16px] text-[#000] font-[600]'>
										{ele.company_evaluation}
									</span>
								</li>
							</ul>
							<div className='w-full flex justify-center'>
								<Button
									className='w-28 h-12'
									onClick={() => {
										setIsOpen(true);
										setCurrentSectorId(ele?.id);
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

				<div className='col-span-3'>
					{data?.length !== 0 ? (
						<Pagination
							currentPage={CurrentPage}
							totalPages={totalPages ? totalPages : 1}
							onPageChange={(t) => setCurrentPage(t)}
						/>
					) : (
						""
					)}
				</div>
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
						<PriceInput
							maxValue={100000000}
							minValue={0}
							onChange={handleNumberOfShares}
							initialValue={""}
							placeholder={t("Enter_amount")}
							label={t("Number_Shares")}
							currency='EGP'
						/>
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
