"use client";
import React, { useEffect, useState } from "react";
import RenderListedForSale from "./tapsContent/ListedForSale";
import RenderCurrentlyOwned from "./tapsContent/CurrentlyOwned";
import RenderAwaitingApproval from "./tapsContent/AwaitingApproval";
import RenderSold from "./tapsContent/Sold";
import WaitingForApprovalSell from "./tapsContent/WaitingForApprovalSell";
import { useTranslations } from "next-intl";
import Spinner from "@/app/[locale]/_components/spinner/Spinner";

// New unified response types based on /api/user/transaction-management
interface ISector {
	id: number;
	title: string;
	description: string;
	number_of_acres: number;
	available_shares: number;
	land_area: number;
	offered_by_company: number;
	pdf: string;
	company_rate: number; // mapped to previous company_evaluation
	launch_start: string;
	construction_start: string;
	construction_end: string;
	production_start: string;
	media: Record<string, unknown> | string[]; // backend sometimes returns object
	created_at?: string;
}

interface IUnifiedRecordBase {
	id: number;
	number_of_shares: number;
	price: number | string;
	sector: ISector;
	created_at?: string;
	sector_id?: number; // sometimes provided separately
}

interface IWaitingForApprovalSellRecord extends IUnifiedRecordBase {
	asking_price?: number | string;
	status?: number;
	status_string?: string;
}

type IUnifiedRecord = IUnifiedRecordBase | IWaitingForApprovalSellRecord;

interface ITransactionManagementResponse {
	owned_shares: IUnifiedRecord[];
	listed_for_sale: IUnifiedRecord[];
	purchase_orders: IUnifiedRecord[];
	waiting_for_approval: IUnifiedRecord[];
	sold_shares: IUnifiedRecord[];
	waiting_for_approval_sell?: IUnifiedRecord[]; // new collection for sell waiting approval
}

const RenderTransactionManagement = () => {
	const [activeTab, setActiveTab] = useState("ListedForSale");
	const [data, setData] = useState<ITransactionManagementResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const t = useTranslations("profile.transaction_management");

	useEffect(() => {
		const fetchAll = async () => {
			try {
				const token = typeof window !== "undefined" && localStorage.getItem("token");
				const direction = typeof window !== "undefined" && localStorage.getItem("direction");

				const headers = new Headers();
				headers.append("accept", "application/json");
				if (token) headers.append("Authorization", `Bearer ${JSON.parse(token)}`);
				if (direction) headers.append("Accept-Language", direction === "ltr" ? "en" : "ar");

				const res = await fetch("https://quttouf.com/api/user/transaction-management", { headers });
				if (!res.ok) throw new Error(`Status ${res.status}`);
				const result = await res.json();
				setData(result as ITransactionManagementResponse);
			} catch (e: unknown) {
				if (e instanceof Error) {
					setError(e.message);
				} else {
					setError("Unknown error");
				}
			} finally {
				setLoading(false);
			}
		};
		fetchAll();
	}, []);

	const TransactionManagementTabs = [
		{
			id: "ListedForSale",
			label: t("Listed_for_Sale"),
			content: () => (
				<RenderListedForSale
					data={data?.listed_for_sale || []}
					loading={loading}
				/>
			),
		},
		// PurchaseRequests tab intentionally removed; restore if backend data needed.
		{
			id: "WaitingForApprovalSell",
			label: t("Waiting_For_Approval_Sell"),
			content: () => (
				<WaitingForApprovalSell
					data={(data?.waiting_for_approval_sell || []).map(r => ({
						...(r as IWaitingForApprovalSellRecord),
						sector_id: r.sector_id ?? r.sector.id,
					}))}
					loading={loading}
				/>
			),
		},
		{
			id: "CurrentlyOwned",
			label: t("Currently_Owned"),
			content: () => (
				<RenderCurrentlyOwned
					data={(data?.owned_shares || []).map(r => ({
						...r,
						sector_id: r.sector_id ?? r.sector.id,
					}))}
					loading={loading}
				/>
			),
		},
		{
			id: "AwaitingApproval",
			label: t("Purchase_Requests"),
			content: () => (
				<RenderAwaitingApproval
					data={data?.waiting_for_approval || []}
					loading={loading}
				/>
			),
		},
		{
			id: "Sold",
			label: t("Sold"),
			content: () => (
				<RenderSold
					data={data?.sold_shares || []}
					loading={loading}
				/>
			),
		},
	];

	if (loading) {
		return (
			<div className="w-full flex justify-center py-10">
				<Spinner />
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-full text-center text-red-600 py-8 text-sm">
				{t("Error")}: {error}
			</div>
		);
	}

	return (
		<>
			<div className='flex flex-row justify-center bg-white lg:rounded-[9px] h-full mb-6'>
				{TransactionManagementTabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`border-b-2 px-2 lg:px-5 py-3 lg:py-4 text-[10px] lg:text-[16px] text-center lg:text-start font-[600] leading-[18px] lgleading-[24px] transition-colors duration-200
                        ${activeTab === tab.id
								? "border-[#009444] text-[#009444]"
								: " border-[#fff] text-[#8E98A8] hover:text-[#009444]"
							}
                    `}
					>
						{tab.label}
					</button>
				))}
			</div>

			<div className='flex flex-row lg:flex-col lg:justify-start w-full gap-6 px-6 lg:px-0'>
				{TransactionManagementTabs.map((tab) => (
					<div
						key={tab.id}
						className={`${activeTab === tab.id ? "block w-full" : "hidden"
							}`}
					>
						{tab.content()}
					</div>
				))}
			</div>
		</>
	);
};

export default RenderTransactionManagement;
