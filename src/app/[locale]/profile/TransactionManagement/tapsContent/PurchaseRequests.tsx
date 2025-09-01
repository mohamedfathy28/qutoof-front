import Button from "../../../_components/button/Button";
import Image from "next/image";
import React, { useState } from "react";
import { IoLogoWhatsapp } from "react-icons/io";
import userImg from "@/media/our clients img1.png";
// Pagination removed in unified fetch version
import toast from "react-hot-toast";
import Spinner from "@/app/[locale]/_components/spinner/Spinner";
import { useTranslations } from "next-intl";

interface IRecord {
	id: number;
	number_of_shares: number;
	price: number | string;
	sector: {
		id: number;
		title: string;
		company_rate: number;
		description?: string;

	};
	created_at?: string;
	// user info might not be present in unified endpoint; optional
	user?: {
		id: number;
		image?: string;
		username?: string;
		whatsapp_number?: string;
		country_code?: string;
		phone?: string;
	}
}

interface Props {
	data: IRecord[];
	loading?: boolean;
}

const RenderPurchaseRequests: React.FC<Props> = ({ data, loading }) => {
	const [IsLoadingAccept, setIsLoadingAccept] = useState<boolean>(false);
	const [IsLoadingRefuse, setIsLoadingRefuse] = useState<boolean>(false);
	const t = useTranslations("profile.transaction_management");

	const handleRefuseOffer = async (id: number | undefined) => {
		setIsLoadingRefuse(true);
		const token =
			typeof window !== "undefined" && localStorage.getItem("token");
		const myHeaders = new Headers();
		myHeaders.append("accept", "application/json");
		myHeaders.append(
			"Authorization",
			`Bearer ${token ? JSON.parse(token) : ""}`
		);

		try {
			const response = await fetch(
				`https://quttouf.com/api/user/purchase-buying-requests/accept/${id}`,
				{
					method: "POST",
					headers: myHeaders,
				}
			);

			const result = await response.json();

			console.log(result);

			if (response.ok) {
				toast.success(result.message);
				setIsLoadingRefuse(false);
			} else {
				toast.error(result.message);
				setIsLoadingRefuse(false);
			}
		} catch (error) {
			console.error(error);
			setIsLoadingRefuse(false);
		}
	};

	const handleAcceptOffer = async (id: number | undefined) => {
		setIsLoadingAccept(true);
		const token =
			typeof window !== "undefined" && localStorage.getItem("token");

		const myHeaders = new Headers();
		myHeaders.append("accept", "application/json");
		myHeaders.append(
			"Authorization",
			`Bearer ${token ? JSON.parse(token) : ""}`
		);

		try {
			const response = await fetch(
				`https://quttouf.com/api/user/purchase-buying-requests/accept/${id}`,
				{
					method: "POST",
					headers: myHeaders,
				}
			);

			const result = await response.json();

			console.log(result);

			if (response.ok) {
				toast.success(result.message);
				setIsLoadingAccept(false);
			} else {
				toast.error(result.message);
				setIsLoadingAccept(false);
			}
		} catch (error) {
			console.error(error);
			setIsLoadingAccept(false);
		}
	};

	if (loading) return <Spinner />;

	return (
		<>
			<div className='flex flex-col lg:grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{data?.length !== 0 ? (
					data.map((ele) => (
						<div
							key={ele.id}
							className='px-4 py-6 lg:px-6 lg:py-8 rounded-[20px] bg-[#fff] w-full'
						>
							<p className='text-[14px] font-[500] text-black text-center mb-4'>
								{(ele.created_at || "").split(" ")[0]}
							</p>
							<h6 className='text-[26px] text-[#009444] text-center font-[600] mb-8'>
								{ele.sector.title}
							</h6>
							{ele.user && (
								<div className='flex items-center justify-between mb-8'>
									<div className='flex items-center gap-2'>
										<Image
											src={userImg}
											alt='user profile'
											className='w-12 h-12 rounded-[50%]'
										/>
										<p className='text-[#17181B] text-[18px] font-[500]'>
											{ele.user?.username || t("user")}
										</p>
									</div>
									<a
										href={`${(ele.user?.country_code || "") + (ele.user?.whatsapp_number || "")}`}
										className='flex items-center justify-center w-12 h-12 rounded-[50%] bg-[#E2F7E5]'
									>
										<IoLogoWhatsapp className='text-[24px] text-[#47C756]' />
									</a>
								</div>
							)}

							<ul className='flex flex-col gap-4 w-full mb-6'>
								<li className='flex justify-between items-center'>
									<span className='text-[16px] text-[#656565] font-[400]'>
										{ele.sector.description}
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
							<div className='grid grid-cols-2 gap-6'>
								<Button
									variant='destructive'
									className='w-full h-12'
									onClick={() => handleRefuseOffer(ele.id)}
									disabled={IsLoadingRefuse}
								>
									{IsLoadingRefuse ? t("Refusing") : t("Refuse")}
								</Button>
								<Button
									className='w-full h-12'
									onClick={() => handleAcceptOffer(ele.id)}
									disabled={IsLoadingAccept}
								>
									{IsLoadingAccept ? t("Accepting") : t("Accept")}
								</Button>
							</div>
						</div>
					))
				) : (
					<h3 className='col-span-3 text-[20px] text-center text-[#009444] font-[700]'>
						{t("no_records")}
					</h3>
				)}
			</div>
		</>
	);
};

export default RenderPurchaseRequests;
