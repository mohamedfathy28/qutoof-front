"use client";
import Spinner from "@/app/[locale]/_components/spinner/Spinner";
import React from "react";
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
}

interface Props {
	data: IRecord[];
	loading?: boolean;
}

const RenderListedForSale: React.FC<Props> = ({ data, loading }) => {
	const t = useTranslations("profile.transaction_management");

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
							<ul className='flex flex-col gap-4 w-full'>
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
						</div>
					))
				) : (
					<h3 className='col-span-3 text-[20px] text-center text-[#009444] font-[700]'>
						{t("no_records")}
					</h3>
				)}

				{/* Pagination removed for unified fetch; implement client-side if needed */}
			</div>
		</>
	);
};

export default RenderListedForSale;
