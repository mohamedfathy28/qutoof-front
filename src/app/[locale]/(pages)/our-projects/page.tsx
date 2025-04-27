"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../../_components/breadcrumb/breadcrumb";
import Pagination from "../../_components/pagination/Pagination";
import ProjectCard from "../../_components/projectCard/ProjectCard";
import Spinner from "../../_components/spinner/Spinner";
import { useTranslations } from "next-intl";

interface IProject {
	id: number;
	title: string;
	description: string;
	image: string;
	pdf: string;
	sectors_count: number;
	total_area: number;
	created_at: string;
}

const OurProjectsPage = () => {
	const [data, setData] = useState<IProject[]>([]);
	const [totalPages, setTotalPages] = useState<number>();
	const [CurrentPage, setCurrentPage] = useState<number>(1);
	const [isLoading, setisLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchData = async () => {
			const direction =
				typeof window !== "undefined" && localStorage.getItem("direction");
			const PerPage = 6;
			const myHeaders = new Headers();
			myHeaders.append("Accept-Language", direction == "ltr" ? "en" : "ar");
			try {
				const response = await fetch(
					`https://quttouf.com/api/user/projects?per_page=${PerPage}&page=${CurrentPage}`,
					{
						headers: myHeaders,
					}
				);
				const result = await response.json();
				setData(result.data);
				setTotalPages(result?.pages);
				setCurrentPage(result?.current_page);
				setisLoading(false);
			} catch (error) {
				console.error("Error fetching data:", error);
				setisLoading(false);
			}
		};

		fetchData();
	}, [CurrentPage]); // Empty dependency array ensures this runs only once after the component mounts

	const t = useTranslations("HomePage");

	return (
		<>
			<Breadcrumb
				items={[{ label: t("ourProjects"), href: "/our-projects" }]}
			/>

			<div className='mx-auto max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl my-20 md:my-32'>
				<div className='text-center mb-10'>
					<h6
						data-aos='fade-up'
						data-aos-duration='500'
						data-aos-delay='0'
						className='text-[#009444] font-bold text-[16px]'
					>
						{t("ourProjects")}
					</h6>
					<h2
						data-aos='fade-zoom-in'
						data-aos-duration='500'
						data-aos-delay='0'
						className='text-[26px] md:text-[40px] text-[#252525] font-[500]'
					>
						{t("CheckOurLatestProjects")}
					</h2>
				</div>

				{isLoading ? (
					<Spinner />
				) : (
					<>
						<div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8'>
							{data?.length !== 0 ? (
								data.map((ProjectInfo) => (
									<ProjectCard
										key={ProjectInfo.id}
										ProjectInfo={ProjectInfo}
									/>
								))
							) : (
								<h3 className='col-span-3 text-[20px] text-center text-[#009444] font-[700]'>
									{t("NoRecords")}
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
					</>
				)}
			</div>
		</>
	);
};

export default OurProjectsPage;
