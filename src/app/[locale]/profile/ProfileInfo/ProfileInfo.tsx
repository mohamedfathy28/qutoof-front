import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// import ImageUpload from '../imageUploud';
import Button from '../../_components/button/Button';
import { useUser } from '../../_contexts/userContext';
import ImageUpload from '../imageUploud';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';


interface ICountry {
    id: number;
    name: string;
    phone_code: string;
}

interface INationality {
    id: number;
    name: string;
}

interface ProfileInfo {
    image:File | null,
    email: string,
    current_password: string,
    username: string,
    full_name: string,
    country_code: string,
    phone: string,
    country_code_2: string,
    phone_2: string,
    country_code_whatsapp: string,
    whatsapp_number: string,
    emergency_number: string,
    bank_name: string,
    bank_account_number: string,
    nationality_id: string,
    isntapay_account: string,
    national_id: string,
    national_id_image: File | null
}

const RenderProfileInfo = () => {
        // State to manage the selected value
    
    const [countries, setCountries] = useState<ICountry[]>([]);
    const [nationalities, setNationalities] = useState<INationality[]>([]);

    const { updateUser } = useUser();

      const t = useTranslations("profile.profileInfo");
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const countriesResponse = await fetch("https://quttouf.com//api/user/countries");
                const countriesResult = await countriesResponse.json();
                setCountries(countriesResult);

                const nationalitiesResponse = await fetch("https://quttouf.com//api/user/nationalities");
                const nationalitiesResult = await nationalitiesResponse.json();
                setNationalities(nationalitiesResult);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const validationSchema = Yup.object({
        image: Yup.mixed(),
        email: Yup.string().required(t("email_required")).email(t("email_invalid")),
        current_password: Yup.string().min(8,t("current_password_min")).required(t("current_password_required")),
        username: Yup.string(),
        full_name: Yup.string(),
        country_code: Yup.string(),
        phone: Yup.string(),
        country_code_2: Yup.string(),
        phone_2: Yup.string().nullable(),
        country_code_whatsapp: Yup.string(),
        whatsapp_number: Yup.string().nullable(),
        emergency_number: Yup.string().nullable(),
        bank_name: Yup.string(),
        bank_account_number: Yup.string(),
        nationality_id: Yup.string(),
        isntapay_account: Yup.string().nullable(),
        national_id: Yup.string(),
        national_id_image: Yup.mixed(),
    });

    const currentUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem("userInfo") as string);


    const formik = useFormik({

        initialValues: currentUser,
        validationSchema,
        onSubmit: async (values: ProfileInfo) => {

            const token = typeof window !== 'undefined' && localStorage.getItem('token');

            const myHeaders = new Headers();
            myHeaders.append("accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${token ? JSON.parse(token) : ''}`);

            const formData = new FormData();

            Object.entries(values).forEach(([key, value]) => {
                if (value !== null) {
                    formData.append(key, value);
                }
            });

            try {
                const response = await fetch('https://quttouf.com//api/user/update/profile', {
                    method: 'POST',
                    headers:myHeaders,
                    body: formData,
                });
                const result = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('userInfo', JSON.stringify(result));
                    updateUser(result);
                    toast.success(t("profile_updated"));
                } else {
                    toast.error(result.message);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                   if (error instanceof Error) {
          toast.error(error.message); 
        } else {
          toast.error('An unexpected error occurred');
        };

            }
        },
    });


    const [files, setFiles] = useState<File[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const droppedFiles = Array.from(event.dataTransfer.files);
        const imageFiles = droppedFiles.filter(file => file.type.startsWith('image/'));

        if (imageFiles.length > 0) {
            setFiles([...files, ...imageFiles]);
            formik.setFieldValue('national_id_image', imageFiles[0]); // Update formik value
        } else {
            alert('Only image files are allowed!');
        }
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFiles = Array.from(event.target.files);
            const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'));

            if (imageFiles.length > 0) {
                setFiles([...files, ...imageFiles]);
                formik.setFieldValue('national_id_image', imageFiles[0]); // Update formik value
            } else {
                alert('Only image files are allowed!');
            }
        }
    };

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <form onSubmit={formik.handleSubmit} className="lg:grid lg:grid-cols-2 gap-5 p-8 bg-white rounded-[16px]">
            <div className="space-y-1 lg:col-span-2">
                <ImageUpload
                    maxSizeInMB={5}
                    onImageUpload={(file) => formik.setFieldValue('image', file)}
                    width={600}
                    height={400}
                    acceptedFileTypes={['image/jpeg', 'image/png']}
                />
                { formik.errors.image && (
                    <p className="text-red-500 text-sm">{formik.errors.image}</p>
                )}
            </div>

            <div className="space-y-1">
                <label htmlFor="email" className="text-[#656C77] text-[16px] leading-[24px] font-[500]">{t("email_label")}</label>
                <input
                    type="email"
                    id="email"
                    {...formik.getFieldProps('email')}
                    className="w-full px-3 py-2 border border-[#ECECEE] bg-white rounded-[8px] outline-none text-[16px]"
                />
                { formik.errors.email && (
                    <p className="text-red-500 text-sm">{formik.errors.email}</p>
                )}
            </div>

            <div className="space-y-1 mb-4">
                <label htmlFor="current_password" className="text-[#656C77] text-[16px] leading-[24px] font-[500]">{t("current_password_label")}</label>
                <input
                    type="password"
                    id="current_password"
                    {...formik.getFieldProps('current_password')}
                    className="w-full px-3 py-2 border border-[#ECECEE] bg-white rounded-[8px] outline-none text-[16px]"
                />
                { formik.errors.current_password && (
                    <p className="text-red-500 text-sm">{formik.errors.current_password}</p>
                )}
            </div>

            <div className="space-y-1 mb-4">
                <label htmlFor="username" className="text-[#656C77] text-[16px] leading-[24px] font-[500]">{t("username_label")}</label>
                <input
                    type="text"
                    id="username"
                    {...formik.getFieldProps('username')}
                    className="w-full px-3 py-2 border border-[#ECECEE] bg-white rounded-[8px] outline-none text-[16px]"
                />
                { formik.errors.username && (
                    <p className="text-red-500 text-sm">{formik.errors.username}</p>
                )}
            </div>

            <div className="space-y-1 mb-4">
                <label htmlFor="full_name" className="text-[#656C77] text-[16px] leading-[24px] font-[500]">{t("fullname_label")}</label>
                <input
                    type="text"
                    id="full_name"
                    {...formik.getFieldProps('full_name')}
                    className="w-full px-3 py-2 border border-[#ECECEE] bg-white rounded-[8px] outline-none text-[16px]"
                />
                { formik.errors.full_name && (
                    <p className="text-red-500 text-sm">{formik.errors.full_name}</p>
                )}
            </div>

            <div className="space-y-1">
                <label
                    htmlFor="country_code"
                    className="text-[#656C77] text-[16px] leading-[24px] font-[500]"
                >
                    {t("Country_for_phone_label")}
                </label>
                <select
                    id="country_code"
                    {...formik.getFieldProps('country_code')}
                    className="w-full px-3 py-2 border border-[#ECECEE] bg-white rounded-[8px] outline-none text-[16px]"
                >
                    <option value="">{t("Select_country")}</option>
                    {countries.map((country) => (
                        <option key={country.id} value={country.phone_code} >
                            {country.name}  {`(+${country.phone_code})`}
                        </option>
                    ))}
                </select>
                { formik.errors.country_code && (
                    <p className="text-red-500 text-sm">{formik.errors.country_code}</p>
                )}
            </div>

            <div className="space-y-1 mb-4">
                <label htmlFor="phone" className="text-[#656C77] text-[16px] leading-[24px] font-[500]">{t("Phone_label")}</label>
                <input
                    type="text"
                    id="phone"
                    {...formik.getFieldProps('phone')}
                    className="w-full px-3 py-2 border border-[#ECECEE] bg-white rounded-[8px] outline-none text-[16px]"
                />
                { formik.errors.phone && (
                    <p className="text-red-500 text-sm">{formik.errors.phone}</p>
                )}
            </div>


            <div className="space-y-1">
                <label
                    htmlFor="country_code_2"
                    className="text-[#656C77] text-[16px] leading-[24px] font-[500]"
                >
                    {t("Country_for_phone2_label")}
                </label>
                <select
                    id="country_code_2"
                    {...formik.getFieldProps('country_code_2')}
                    className="w-full px-3 py-2 border border-[#ECECEE] bg-white rounded-[8px] outline-none text-[16px]"
                >
                    <option value="">{t("Select_country")}</option>
                    {countries.map((country) => (
                        <option key={country.id} value={country.phone_code}>
                            {country.name}  {`(+${country.phone_code})`}
                        </option>
                    ))}
                </select>
                { formik.errors.country_code_2 && (
                    <p className="text-red-500 text-sm">{formik.errors.country_code_2}</p>
                )}
            </div>

            <div className="space-y-1 mb-4">
                <label htmlFor="phone_2" className="text-[#656C77] text-[16px] leading-[24px] font-[500]">{t("Phone2_label")}</label>
                <input
                    type="text"
                    id="phone_2"
                    {...formik.getFieldProps('phone_2')}
                    className="w-full px-3 py-2 border border-[#ECECEE] bg-white rounded-[8px] outline-none text-[16px]"
                />
                { formik.errors.phone_2 && (
                    <p className="text-red-500 text-sm">{formik.errors.phone_2}</p>
                )}
            </div>


            <div className="space-y-1">
                <label
                    htmlFor="country_code_whatsapp"
                    className="text-[#656C77] text-[16px] leading-[24px] font-[500]"
                >
                    {t("Country_for_whatsapp_label")}
                </label>
                <select
                    id="country_code_whatsapp"
                    {...formik.getFieldProps('country_code_whatsapp')}
                    className="w-full px-3 py-2 border border-[#ECECEE] bg-white rounded-[8px] outline-none text-[16px]"
                >
                    <option value="">{t("Select_country")}</option>
                    {countries.map((country) => (
                        <option key={country.id} value={country.phone_code}>
                            {country.name}  {`(+${country.phone_code})`}
                        </option>
                    ))}
                </select>
                { formik.errors.country_code_whatsapp && (
                    <p className="text-red-500 text-sm">{formik.errors.country_code_whatsapp}</p>
                )}
            </div>

            <div className="space-y-1 mb-4">
                <label htmlFor="whatsapp_number" className="text-[#656C77] text-[16px] leading-[24px] font-[500]">{t("whatsapp_number_label")}</label>
                <input
                    type="text"
                    id="whatsapp_number"
                    {...formik.getFieldProps('whatsapp_number')}
                    className="w-full px-3 py-2 border border-[#ECECEE] bg-white rounded-[8px] outline-none text-[16px]"
                />
                { formik.errors.whatsapp_number && (
                    <p className="text-red-500 text-sm">{formik.errors.whatsapp_number}</p>
                )}
            </div>


            <div className="space-y-1 mb-4">
                <label htmlFor="emergency_number" className="text-[#656C77] text-[16px] leading-[24px] font-[500]">{t("emergency_number_label")}</label>
                <input
                    type="text"
                    id="emergency_number"
                    {...formik.getFieldProps('emergency_number')}
                    className="w-full px-3 py-2 border border-[#ECECEE] bg-white rounded-[8px] outline-none text-[16px]"
                />
                { formik.errors.emergency_number && (
                    <p className="text-red-500 text-sm">{formik.errors.emergency_number}</p>
                )}
            </div>

            <div className="space-y-1 mb-4">
                <label htmlFor="bank_name" className="text-[#656C77] text-[16px] leading-[24px] font-[500]">{t("bank_name_label")}</label>
                <input
                    type="text"
                    id="bank_name"
                    {...formik.getFieldProps('bank_name')}
                    className="w-full px-3 py-2 border border-[#ECECEE] bg-white rounded-[8px] outline-none text-[16px]"
                />
                { formik.errors.bank_name && (
                    <p className="text-red-500 text-sm">{formik.errors.bank_name}</p>
                )}
            </div>

            <div className="space-y-1 mb-4">
                <label htmlFor="bank_account_number" className="text-[#656C77] text-[16px] leading-[24px] font-[500]">{t("bank_account_number_label")}</label>
                <input
                    type="text"
                    id="bank_account_number"
                    {...formik.getFieldProps('bank_account_number')}
                    className="w-full px-3 py-2 border border-[#ECECEE] bg-white rounded-[8px] outline-none text-[16px]"
                />
                { formik.errors.bank_account_number && (
                    <p className="text-red-500 text-sm">{formik.errors.bank_account_number}</p>
                )}
            </div>

            <div className="space-y-1 mb-4">
                <label htmlFor="isntapay_account" className="text-[#656C77] text-[16px] leading-[24px] font-[500]">{t("isntapay_account_label")}</label>
                <input
                    type="text"
                    id="isntapay_account"
                    {...formik.getFieldProps('isntapay_account')}
                    className="w-full px-3 py-2 border border-[#ECECEE] bg-white rounded-[8px] outline-none text-[16px]"
                />
                { formik.errors.isntapay_account && (
                    <p className="text-red-500 text-sm">{formik.errors.isntapay_account}</p>
                )}
            </div>


            <div className="space-y-1">
                <label
                    htmlFor="nationality_id"
                    className="text-[#656C77] text-[16px] leading-[24px] font-[500]"
                >
                    {t("Nationality_label")}
                </label>
                <select
                    id="nationality_id"
                    {...formik.getFieldProps('nationality_id')}
                    className="w-full px-3 py-2 border border-[#ECECEE] bg-white rounded-[8px] outline-none text-[16px]"
                >
                    <option value="">{t("Select_nationality")}</option>
                    {nationalities.map((nationality) => (
                        <option key={nationality.id} value={nationality.id}>
                            {nationality.name}
                        </option>
                    ))}
                </select>
                { formik.errors.nationality_id && (
                    <p className="text-red-500 text-sm">{formik.errors.nationality_id}</p>
                )}
            </div>

            <div className="space-y-1 mb-4">
                <label htmlFor="national_id" className="text-[#656C77] text-[16px] leading-[24px] font-[500]">{t("national_ID_label")}</label>
                <input
                    type="text"
                    id="national_id"
                    {...formik.getFieldProps('national_id')}
                    className="w-full px-3 py-2 border border-[#ECECEE] bg-white rounded-[8px] outline-none text-[16px]"
                />
                { formik.errors.national_id && (
                    <p className="text-red-500 text-sm">{formik.errors.national_id}</p>
                )}
            </div>

            <div className='space-y-1 col-span-2'>
                <label htmlFor="national_id_image" className='text-[#656C77] text-[16px] leading-[24px] font-[500]'>{t("national_ID_image_label")}</label>
                <div>
                    <div
                        className="border-[1px] border-dashed border-[#009444] rounded-lg p-6 text-center cursor-pointer hover:bg-gray-100"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={handleClick} // Makes the dropzone clickable
                    >
                        <div className='flex justify-center items-center mx-auto mb-2 w-8 h-8 rounded-[10px] bg-[#009444]'>
                            <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M3.72476 3.5579C3.48069 3.80198 3.48069 4.19771 3.72477 4.44178C3.96885 4.68586 4.36457 4.68586 4.60865 4.44178L6.87501 2.1754V12.3332C6.87501 12.6784 7.15483 12.9582 7.50001 12.9582C7.84519 12.9582 8.12501 12.6784 8.12501 12.3332V2.17538L10.3914 4.44178C10.6355 4.68586 11.0312 4.68586 11.2753 4.44178C11.5194 4.1977 11.5194 3.80197 11.2753 3.5579L7.94195 0.22456C7.82474 0.10735 7.66577 0.0415031 7.50001 0.0415039C7.33425 0.0415047 7.17528 0.107354 7.05807 0.224564L3.72476 3.5579ZM2.78322 6.89078C2.99911 6.62146 2.9558 6.22811 2.68648 6.01221C2.41715 5.79631 2.0238 5.83962 1.80791 6.10894C0.807302 7.35716 0.208374 8.94275 0.208374 10.6665C0.208374 14.6936 3.47296 17.9582 7.50004 17.9582C11.5271 17.9582 14.7917 14.6936 14.7917 10.6665C14.7917 8.94275 14.1928 7.35716 13.1922 6.10894C12.9763 5.83962 12.5829 5.79631 12.3136 6.01221C12.0443 6.22811 12.001 6.62146 12.2169 6.89078C13.0461 7.92523 13.5417 9.23714 13.5417 10.6665C13.5417 14.0032 10.8368 16.7082 7.50004 16.7082C4.16332 16.7082 1.45837 14.0032 1.45837 10.6665C1.45837 9.23714 1.95397 7.92523 2.78322 6.89078Z" fill="white" />
                            </svg>
                        </div>
                        <p className="text-[#40444C] text-[14px]">{t("Drag_Drop")} <span className='text-[#009444]'>{t("choose_file")}</span> {t("to_upload")}</p>
                        <p className="text-[#949494] text-[10px]">{t("Supported")}</p>
                        <input
                            type="file"
                            id='national_id_image'
                            multiple
                            accept=".jpeg, .jpg, .pdf"
                            ref={fileInputRef} // Reference to the hidden input
                            onChange={handleFileInputChange}
                            className="hidden"
                        />
                    </div>
                    <ul className="mt-4 text-sm text-gray-700">
                        {files.length > 0 &&
                            files.map((file, index) => (
                                <li key={index} className="border p-2 rounded mb-2">
                                    {file.name}
                                </li>
                            ))}
                    </ul>
                </div>
            </div>

            <Button type="submit" className="col-span-2 w-36 ml-auto">{formik.isSubmitting ? t("Loading") : t("Confirm")}</Button>
        </form>
    );
};

export default RenderProfileInfo;
