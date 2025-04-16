"use client"

import Button from '../../_components/button/Button'
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { useWalletContext } from '../../_contexts/walletContext'
import ImageUpload from '../imageUploud'
import { useTranslations } from 'next-intl'

interface IWallet {
    id: number,
    wallet_balance: number,
    withdraw_money: number,
    deposited_money: number,
    wait_for_withdraw: number,
    wait_for_deposit: number,
}

const RenderDepositMoney = () => {
    const [data, setData] = useState<IWallet>();

    const { setTransactionsFromContext } = useWalletContext();

    const t = useTranslations("profile.wallet");
    

    const fetchData = async () => {
        const token = typeof window !== 'undefined' && localStorage.getItem('token');
        const direction = typeof window !== "undefined" && localStorage.getItem("direction");

        const myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${token ? JSON.parse(token) : ''}`);
        myHeaders.append("Accept-Language", direction=='ltr'? "en" : "ar");

        try {
            const response = await fetch('http://localhost/quttouf-backend/api/user/wallet', {
                headers: myHeaders,
            });
            const result = await response.json();
            setData(result.data);
            console.log(result.data.transactions);

            setTransactionsFromContext(result.data.transactions)

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const formik = useFormik({
        initialValues: {
            address: '',
            phone_number: '',
            amount: '',
            receipt_image: null,
        },
        validationSchema: Yup.object({
            address: Yup.string().email(t('address_invalid')).required(t('address_required')),
            phone_number: Yup.number().required(t('phone_number_required')),
            amount: Yup.number().required(t('amount_required')).positive(t('amount_positive')),
            receipt_image: Yup.mixed().required(t('receipt_image_required'))

        }),
        onSubmit: async(values) => {
            const token = typeof window !== 'undefined' && localStorage.getItem('token');
            const myHeaders = new Headers();
            myHeaders.append("accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${token ? JSON.parse(token) : ''}`);

            const formData = new FormData();
            formData.append('address', values.address);
            formData.append('phone_number', values.phone_number);
            formData.append('amount', values.amount.toString());
            // Check if receipt_image is not null before appending
            if (values.receipt_image) {
                formData.append('receipt_image', values.receipt_image);
            } else {
                toast.error('Receipt image is required');
                return; // Stop the submission if receipt_image is missing
            }

            try {
                const response = await fetch('http://localhost/quttouf-backend/api/user/wallet/deposit', {
                    method: 'POST',
                    headers: myHeaders,
                    body: formData,
                })


                const result = await response.json();

                if (response.ok) {
                    toast.success(result.message);
                        fetchData();
                } else {
                    toast.error(result.message);
                }
                    
            } catch (error) {
                console.error('Error submitting form:', error);
            }

        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <p className='text-[#656565] text-[18px] font-[400] mb-2'>{t('total_balance')}</p>
            <h4 className='pb-6 mb-6 border-b border-[#F1F1F1] text-[#17181B] text-[28px] font-[600]'>{data?.wallet_balance} <span className=' text-[16px]'>{t('currency')}</span></h4>
            <div className='space-y-1 mb-4'>
                <label htmlFor="address" className='text-[#656C77] text-[16px] leading-[24px] font-[500]'>{t('address_label')}</label>
                <input
                    type="text"
                    name="address"
                    id="address"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.address}
                    placeholder={t('address_placeholder')}
                    className='w-full px-3 py-2 border border-[#ECECEE] bg-white rounded-[8px] outline-none text-[16px]'
                />
                { formik.errors.address ? (
                    <div className="text-red-500">{formik.errors.address}</div>
                ) : null}
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 pb-6 mb-6 border-b border-[#F1F1F1]'>
                <div className='space-y-1'>
                    <label htmlFor="phone_number" className='text-[#656C77] text-[16px] leading-[24px] font-[500]'>{t('instapay_number_label')}</label>
                    <input
                        type="text"
                        name="phone_number"
                        id="phone_number"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phone_number}
                        placeholder={t('instapay_number_placeholder')}
                        className='w-full px-3 py-2 border border-[#ECECEE] bg-white rounded-[8px] outline-none text-[16px]'
                    />
                    { formik.errors.phone_number ? (
                        <div className="text-red-500">{formik.errors.phone_number}</div>
                    ) : null}
                </div>
                <div className='space-y-1'>
                    <label htmlFor="amount" className='text-[#656C77] text-[16px] leading-[24px] font-[500]'>{t('amount_label')}</label>
                    <input
                        type="text"
                        name="amount"
                        id="amount"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.amount}
                        placeholder={t('amount_placeholder')}
                        className='w-full px-3 py-2 border border-[#ECECEE] bg-white rounded-[8px] outline-none text-[16px]'
                    />
                    { formik.errors.amount ? (
                        <div className="text-red-500">{formik.errors.amount}</div>
                    ) : null}
                </div>
                <div className="space-y-1 lg:col-span-2">
                    <label htmlFor="amount" className='text-[#656C77] text-[16px] leading-[24px] font-[500]'>{t('receipt_image_label')}</label>
                    <ImageUpload
                        maxSizeInMB={5}
                        onImageUpload={(file) => formik.setFieldValue('receipt_image', file)}
                        width={600}
                        height={400}
                        acceptedFileTypes={['image/jpeg', 'image/png']}
                    />
                    { formik.errors.receipt_image && (
                        <p className="text-red-500 text-sm">{formik.errors.receipt_image}</p>
                    )}
                </div>
            </div>
            <Button type="submit" className='w-full h-12' disabled={formik.isSubmitting}>{formik.isSubmitting ? t('loading') : t('confirm')}</Button>
        </form>
    )
}

export default RenderDepositMoney