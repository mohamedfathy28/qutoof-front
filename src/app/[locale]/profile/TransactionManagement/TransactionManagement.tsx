import React, { useState } from 'react'
import RenderListedForSale from './tapsContent/ListedForSale';
import RenderPurchaseRequests from './tapsContent/PurchaseRequests';
import RenderCurrentlyOwned from './tapsContent/CurrentlyOwned';
import RenderAwaitingApproval from './tapsContent/AwaitingApproval';
import RenderSold from './tapsContent/Sold';
import { useTranslations } from 'next-intl';

const RenderTransactionManagement = () => {

    const [activeTab, setActiveTab] = useState("ListedForSale");

    const t = useTranslations("profile.transaction_management");


    const TransactionManagementTabs = [
        {
            id: 'ListedForSale',
            label: t("Listed_for_Sale"),
            content: RenderListedForSale
        },
        {
            id: 'PurchaseRequests',
            label: t("Purchase_Requests"),
            content: RenderPurchaseRequests
        },
        {
            id: 'CurrentlyOwned',
            label: t("Currently_Owned"),
            content: RenderCurrentlyOwned
        },
        {
            id: 'AwaitingApproval',
            label: t("Awaiting_Approval"),
            content: RenderAwaitingApproval
        },
        {
            id: 'Sold',
            label: t("Sold"),
            content: RenderSold
        }
    ];

    return (
        <>
            <div className='flex flex-row justify-center bg-white lg:rounded-[9px] h-full mb-6'>
                {TransactionManagementTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`border-b-2 px-2 lg:px-5 py-3 lg:py-4 text-[10px] lg:text-[16px] text-center lg:text-start font-[600] leading-[18px] lgleading-[24px] transition-colors duration-200
                        ${activeTab === tab.id
                                ? 'border-[#009444] text-[#009444]'
                                : ' border-[#fff] text-[#8E98A8] hover:text-[#009444]'
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
                        className={`${activeTab === tab.id ? 'block w-full' : 'hidden'}`}>
                        {tab.content()}
                    </div>
                ))}
            </div>

        </>
    )

}

export default RenderTransactionManagement