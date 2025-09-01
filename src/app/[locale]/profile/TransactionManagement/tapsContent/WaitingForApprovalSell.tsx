"use client";
import React, { useEffect, useState } from "react";
import Spinner from "@/app/[locale]/_components/spinner/Spinner";
import { useTranslations } from "next-intl";
import Button from "../../../_components/button/Button";
import toast from "react-hot-toast";

interface IRecord {
    id: number;
    sector_id?: number;
    number_of_shares: number;
    price: number | string; // current price
    asking_price?: number | string; // user asking price
    status?: number;
    status_string?: string;
    created_at?: string;
    sector: {
        id: number;
        title: string;
        description?: string;
        company_rate: number; // company evaluation
    };
}

interface Props {
    data: IRecord[];
    loading?: boolean;
}

const WaitingForApprovalSell: React.FC<Props> = ({ data, loading }) => {
    const t = useTranslations("profile.transaction_management");
    const [records, setRecords] = useState<IRecord[]>(data || []);
    const [cancellingId, setCancellingId] = useState<number | null>(null);
    const [acceptingId, setAcceptingId] = useState<number | null>(null);

    useEffect(() => {
        setRecords(data || []);
    }, [data]);

    const handleCancel = async (id: number) => {
        try {
            setCancellingId(id);
            const token = typeof window !== "undefined" && localStorage.getItem("token");
            const headers = new Headers();
            headers.append("accept", "application/json");
            if (token) headers.append("Authorization", `Bearer ${JSON.parse(token)}`);

            const res = await fetch(`https://quttouf.com/api/user/sellshare/change/${id}`, {
                method: "POST",
                headers,
            });
            const result = await res.json();
            if (!res.ok) {
                toast.error(result.message || t("Error"));
            } else {
                toast.success(result.message || t("Done"));
                setRecords(prev => prev.filter(r => r.id !== id));
            }
        } catch (e) {
            console.error(e);
            toast.error(t("Error"));
        } finally {
            setCancellingId(null);
        }
    };

    // Accept handler (assumes backend endpoint follows similar pattern). Adjust URL if needed.
    const handleAccept = async (id: number) => {
        try {
            setAcceptingId(id);
            const token = typeof window !== "undefined" && localStorage.getItem("token");
            const headers = new Headers();
            headers.append("accept", "application/json");
            if (token) headers.append("Authorization", `Bearer ${JSON.parse(token)}`);

            const res = await fetch(`https://quttouf.com/api/user/sellshare/change/${id}/accept`, {
                method: "POST",
                headers,
            });
            const result = await res.json();
            if (!res.ok) {
                toast.error(result.message || t("Error"));
            } else {
                toast.success(result.message || t("Done"));
                // Remove or update the record; currently removing from waiting list
                setRecords(prev => prev.filter(r => r.id !== id));
            }
        } catch (e) {
            console.error(e);
            toast.error(t("Error"));
        } finally {
            setAcceptingId(null);
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className='flex flex-col lg:grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {records?.length ? (
                records.map(rec => (
                    <div key={rec.id} className='px-4 py-6 lg:px-6 lg:py-8 rounded-[20px] bg-white w-full'>
                        <p className='text-[14px] font-[500] text-black text-center mb-4'>
                            {(rec.created_at || "").split(" ")[0]}
                        </p>
                        <h6 className='text-[22px] lg:text-[26px] text-[#009444] text-center font-[600] mb-2'>
                            {rec.sector.title}
                        </h6>
                        {rec.sector.description && (
                            <p className='text-[12px] text-[#656565] text-center mb-6 leading-relaxed'>
                                {rec.sector.description}
                            </p>
                        )}
                        <ul className='flex flex-col gap-3 w-full mb-6'>
                            <li className='flex justify-between items-center'>
                                <span className='text-[14px] text-[#656565]'>{t("Number_Shares")}</span>
                                <span className='text-[14px] font-[600]'>{rec.number_of_shares}</span>
                            </li>
                            <li className='flex justify-between items-center'>
                                <span className='text-[14px] text-[#656565]'>{t("company_evaluation")}</span>
                                <span className='text-[14px] font-[600]'>{rec.sector.company_rate}</span>
                            </li>
                            <li className='flex justify-between items-center'>
                                <span className='text-[14px] text-[#656565]'>{t("asking_price")}</span>
                                <span className='text-[14px] font-[600]'>{rec.asking_price ?? rec.price}</span>
                            </li>
                            <li className='flex justify-between items-center'>
                                <span className='text-[14px] text-[#656565]'>{t("current_price")}</span>
                                <span className='text-[14px] font-[600]'>{rec.price}</span>
                            </li>
                            {rec.status_string && (
                                <li className='flex justify-between items-center'>
                                    <span className='text-[14px] text-[#656565]'>{t("status")}</span>
                                    <span className={`text-[12px] font-[500] px-2 py-1 rounded-[6px] ${rec.status === 2
                                        ? 'bg-[#FF860014] text-[#FF8600]'
                                        : rec.status === 1
                                            ? 'bg-[#E2F7E5] text-[#009444]'
                                            : 'bg-[#F1F1F1] text-[#656565]'
                                        }`}>{rec.status_string}</span>
                                </li>
                            )}
                        </ul>
                        <div className='w-full flex flex-col items-center gap-3'>
                            <span className='text-[12px] text-[#8E98A8]'>
                                {t("Waiting_For_Approval_Sell")}
                            </span>
                            {rec.status === 2 && (
                                <Button
                                    variant='destructive'
                                    className='w-32 h-10'
                                    disabled={cancellingId === rec.id}
                                    onClick={() => handleCancel(rec.id)}
                                >
                                    {cancellingId === rec.id ? t("Cancelling") : t("Cancel")}
                                </Button>
                            )}
                            {rec.status === 1 && (
                                <div className='flex gap-3'>
                                    <Button
                                        variant='default'
                                        className='w-28 h-10'
                                        disabled={acceptingId === rec.id}
                                        onClick={() => handleAccept(rec.id)}
                                    >
                                        {acceptingId === rec.id ? t("Loading") : t("Accept")}
                                    </Button>
                                    <Button
                                        variant='destructive'
                                        className='w-28 h-10'
                                        disabled={cancellingId === rec.id}
                                        onClick={() => handleCancel(rec.id)}
                                    >
                                        {cancellingId === rec.id ? t("Cancelling") : t("Cancel")}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <h3 className='col-span-3 text-[20px] text-center text-[#009444] font-[700]'>
                    {t("no_records")}
                </h3>
            )}
        </div>
    );
};

export default WaitingForApprovalSell;