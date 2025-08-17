"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../../_components/breadcrumb/breadcrumb";
import Pagination from "../../../../_components/pagination/Pagination";
import SectorCard from "../../../../_components/sectorCard/SectorCard";
import { useTranslations } from "next-intl";

// New simplified sector data shape from API
export interface ISectorItem {
	id: number;
	title: string;
	description: string;
	number_of_acres: number;
	available_shares: number;
	land_area: number;
	offered_by_company: number;
	media: Record<string, string> | string[];
	AllowToSell: boolean;
	share_price?: number;
}

const ShowSectors = ({ projectId }: { projectId: number }) => {
	const [data, setData] = useState<ISectorItem[]>([]);
	const [totalPages, setTotalPages] = useState<number>();
	const [CurrentPage, setCurrentPage] = useState<number>(1);
	const PerPage = 6; // UI page size

	useEffect(() => {
		const fetchData = async () => {
			const direction =
				typeof window !== "undefined" && localStorage.getItem("direction");
			const myHeaders = new Headers();
			myHeaders.append("Accept-Language", direction == "ltr" ? "en" : "ar");
			try {
				const response = await fetch(
					`https://quttouf.com/api/user/projects/data/${projectId}?per_page=${PerPage}&page=${CurrentPage}`,
					{ headers: myHeaders }
				);
				const result = await response.json();
				setData(result.data || []);
				setTotalPages(result?.pages || 1);
				setCurrentPage(result?.current_page || 1);
			} catch (error) {
				console.error("Error fetching sectors:", error);
			}
		};

		fetchData();
	}, [CurrentPage, projectId]);

	const t = useTranslations("SectorDetails");
	const t_home = useTranslations("HomePage");

	return (
		<>
			<Breadcrumb
				items={[{ label: t("ourSectors"), href: "/our-projects" }]}
			/>

			<div className='mx-auto max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl my-20 md:my-32'>
				<div className='text-center mb-10'>
					<h6
						data-aos='fade-up'
						data-aos-duration='500'
						data-aos-delay='0'
						className='text-[#009444] font-bold text-[16px]'
					>
						{t("ourSectors")}
					</h6>
					<h2
						data-aos='fade-zoom-in'
						data-aos-duration='500'
						data-aos-delay='0'
						className='text-[26px] md:text-[40px] text-[#252525] font-[500]'
					>
						{t("CheckOurLatestSectors")}
					</h2>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					{data &&
						data.map((SectorInfo) => (
							<SectorCard key={SectorInfo.id} SectorInfo={SectorInfo} />
						))}

					{data?.length === 0 && (
						<h3 className='col-span-2 text-[20px] text-center text-[#009444] font-[700]'>
							{t_home("NoRecords")}
						</h3>
					)}
				</div>
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
		</>
	);
};

export default ShowSectors;
