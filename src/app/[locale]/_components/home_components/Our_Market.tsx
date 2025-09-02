"use client";
import { useRouter } from "@/i18n/routing";
import React, { useEffect, useMemo, useState } from "react";
import Button from "../button/Button";
import ProductCard from "../productCard/ProductCard";
import { useTranslations } from "next-intl";
import Tabs from "../tabs/Tabs";
import Pagination from "../pagination/Pagination";
import Spinner from "../spinner/Spinner";

// Unified project interface aligned with market page expectations
interface IProject {
	id: number;
	number_of_shares?: number;
	share_price?: number;
	price?: string | number;
	company_evaluation?: number;
	status_id?: number;
	status?: string;
	type?: string;
	type_flag?: string;
	participants?: number;
	total_price?: number;
	sector: {
		id: number;
		title?: string;
		description?: string;
		number_of_acres?: number;
		available_shares?: number;
		land_area?: number;
		offered_by_company?: number;
		pdf?: string;
		company_rate?: number;
		launch_start?: string;
		construction_start?: string;
		construction_end?: string;
		production_start?: string;
		media: string[];
		created_at?: string;
	};
	user: {
		id: number;
		image?: string;
		username?: string;
		whatsapp_number?: string;
		country_code?: string;
		phone?: string;
	};
	created_at: string;
}

// API raw types (subset)
interface ApiSector {
	id?: number; media?: string[] | Record<string, string>; title?: string; description?: string; number_of_acres?: number; available_shares?: number; land_area?: number; offered_by_company?: number; pdf?: string; company_rate?: number; launch_start?: string; construction_start?: string; construction_end?: string; production_start?: string; created_at?: string;
}
interface ApiUser { id?: number; image?: string; username?: string; whatsapp_number?: string; country_code?: string; phone?: string; }
interface ApiProject { id: number; number_of_shares?: number; share_price?: number; price?: string | number; company_evaluation?: number; status_id?: number; status?: string; type?: string; type_flag?: string; participants?: number; total_price?: number; sector?: ApiSector; user?: ApiUser; date?: string; created_at?: string; }

const PerPage = 6; // show 6 items like market page

const OurMarket: React.FC = () => {
	const t = useTranslations("HomePage");
	const router = useRouter();

	const [allData, setAllData] = useState<IProject[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	// Fetch data (mirrors logic from market page)
	useEffect(() => {
		const fetchAll = async () => {
			const direction = typeof window !== 'undefined' && localStorage.getItem('direction');
			const myHeaders = new Headers();
			myHeaders.append('Accept-Language', direction == 'ltr' ? 'en' : 'ar');
			setIsLoading(true);
			try {
				const baseUrl = 'http://localhost/quttouf-backend/api/user/new-market';
				const params = new URLSearchParams({ per_page: String(PerPage), page: String(currentPage) });
				const response = await fetch(`${baseUrl}?${params.toString()}`, { headers: myHeaders });
				const result = await response.json();

				const adapted: IProject[] = Array.isArray(result.data)
					? result.data.map((item: ApiProject) => {
						const rawPrice = item.price ?? 0;
						const numericPrice = typeof rawPrice === 'string' ? parseFloat(rawPrice) : rawPrice;
						let mediaArray: string[] = [];
						if (Array.isArray(item?.sector?.media)) mediaArray = item.sector!.media as string[];
						else if (item?.sector?.media && typeof item.sector!.media === 'object') mediaArray = Object.values(item.sector!.media as Record<string, string>).filter((v) => typeof v === 'string');
						return {
							id: item.id,
							number_of_shares: item.number_of_shares ?? 0,
							share_price: numericPrice,
							price: rawPrice,
							company_evaluation: item.company_evaluation ?? 0,
							status_id: item.status_id,
							status: item.status,
							type: item.type,
							type_flag: item.type_flag,
							participants: item.participants ?? 0,
							total_price: numericPrice,
							sector: {
								id: item?.sector?.id ?? 0,
								title: item?.sector?.title,
								description: item?.sector?.description,
								number_of_acres: item?.sector?.number_of_acres,
								available_shares: item?.sector?.available_shares,
								land_area: item?.sector?.land_area,
								offered_by_company: item?.sector?.offered_by_company,
								pdf: item?.sector?.pdf,
								company_rate: item?.sector?.company_rate,
								launch_start: item?.sector?.launch_start,
								construction_start: item?.sector?.construction_start,
								construction_end: item?.sector?.construction_end,
								production_start: item?.sector?.production_start,
								media: mediaArray,
								created_at: item?.sector?.created_at,
							},
							user: {
								id: item?.user?.id ?? 0,
								image: item?.user?.image || '',
								username: item?.user?.username,
								whatsapp_number: item?.user?.whatsapp_number || '',
								country_code: item?.user?.country_code || '',
								phone: item?.user?.phone || '',
							},
							created_at: item.date || item.created_at || new Date().toISOString(),
						};
					})
					: [];
				setAllData(adapted);
				setTotalPages(result?.pages || 1);
			} catch (error) {
				console.error('Error fetching market data (home section):', error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchAll();
	}, [currentPage]);

	// Derived datasets
	const companyData = useMemo(() => allData.filter(p => p?.user?.id === 1), [allData]);
	const customersData = useMemo(() => allData.filter(p => p?.user?.id !== 1), [allData]);

	const ProductsTab = ({ data }: { data: IProject[] }) => {
		if (isLoading) return <Spinner />;
		return (
			<>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
					{data?.length !== 0 ? (
						data.map((ProductInfo) => (
							<ProductCard
								key={ProductInfo.id}
								ProductInfo={{
									...ProductInfo,
									number_of_shares: ProductInfo.number_of_shares ?? 0,
									share_price: ProductInfo.share_price ?? 0,
									company_evaluation: ProductInfo.company_evaluation ?? 0,
									shares: ProductInfo.number_of_shares ?? 0, // ensure compatibility
									status_id: ProductInfo.status_id ?? 0,
									status: ProductInfo.status ?? '',
									type: ProductInfo.type ?? '',
									type_flag: ProductInfo.type_flag ?? '',
									participants: ProductInfo.participants ?? 0,
									total_price: ProductInfo.total_price ?? 0,
									sector: {
										id: ProductInfo.sector?.id ?? 1,
										title: ProductInfo.sector?.title || '',
										description: ProductInfo.sector?.description || '',
										number_of_acres: ProductInfo.sector?.number_of_acres || 0,
										available_shares: ProductInfo.sector?.available_shares || 0,
										land_area: ProductInfo.sector?.land_area || 0,
										offered_by_company: ProductInfo.sector?.offered_by_company || 0,
										pdf: ProductInfo.sector?.pdf || '',
										company_rate: ProductInfo.sector?.company_rate || 0,
										launch_start: ProductInfo.sector?.launch_start || '',
										construction_start: ProductInfo.sector?.construction_start || '',
										construction_end: ProductInfo.sector?.construction_end || '',
										production_start: ProductInfo.sector?.production_start || '',
										media: ProductInfo.sector?.media || [],
										created_at: ProductInfo.sector?.created_at || new Date().toISOString(),
									},
									user: {
										id: ProductInfo.user?.id ?? 0,
										image: ProductInfo.user?.image || '',
										username: ProductInfo.user?.username || '',
										whatsapp_number: ProductInfo.user?.whatsapp_number || '',
										country_code: ProductInfo.user?.country_code || '',
										phone: ProductInfo.user?.phone || ''
									},
									created_at: ProductInfo.created_at
								}}
							/>
						))
					) : (
						<h3 className='col-span-3 text-[20px] text-center text-[#009444] font-[700]'>
							{t('NoRecords')}
						</h3>
					)}
				</div>
				{data?.length !== 0 && (
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages || 1}
						onPageChange={setCurrentPage}
					/>
				)}
			</>
		);
	};

	const tabs = useMemo(() => ([
		{ id: 'tab1', label: t('All'), content: () => <ProductsTab data={allData} /> },
		{ id: 'tab2', label: t('fromCompany'), content: () => <ProductsTab data={companyData} /> },
		{ id: 'tab3', label: t('fromCustomers'), content: () => <ProductsTab data={customersData} /> },
	]), [allData, companyData, customersData, t, isLoading, currentPage, totalPages]);

	// Hide section entirely if nothing after loading
	if (!isLoading && allData.length === 0) return null;

	return (
		<div className='mx-auto max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mb-20 md:mb-32 flex flex-col items-center'>
			<div className='text-center mb-12'>
				<h6 data-aos='fade-up' data-aos-duration='500' data-aos-delay='0' className='text-[#009444] font-bold text-[16px]'>
					{t('OurMarket')}
				</h6>
				<h2 data-aos='fade-zoom-in' data-aos-duration='500' data-aos-delay='0' className='text-[26px] md:text-[40px] text-[#252525] font-[500] max-w-[550px]'>
					&quot;{t('ExploreInvest')}&quot;
				</h2>
			</div>
			<div className='w-full mb-6'>
				<Tabs tabs={tabs} defaultTab='tab1' className='w-full' />
			</div>
			<Button className='px-8 mx-auto' onClick={() => router.push('/market')} size='lg'>
				{t('ViewAll')}
			</Button>
		</div>
	);
};

export default OurMarket;
