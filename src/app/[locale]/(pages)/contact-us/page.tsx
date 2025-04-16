"use client"
import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Button from '../../_components/button/Button';
import Breadcrumb from '../../_components/breadcrumb/breadcrumb';
import toast from 'react-hot-toast';
import { useConfigrationsContext } from '../../_contexts/MainConfigContext';
import { useTranslations } from 'next-intl';

// Define the form values interface
interface FormValues {
    full_name: string;
    email: string;
    phone: string; // Make it required for Formik compatibility
    message: string;
}

const ContactUsPage: React.FC = () => {

    const { Configrations } = useConfigrationsContext();

    const t = useTranslations("HomePage");



    // Validation schema using Yup
    const validationSchema = Yup.object({
        full_name: Yup.string().required(t("Validation.fullName")),
        email: Yup.string().email(t("Validation.email")).required(t("Validation.emailRequired")),
        phone: Yup.string().required(t("Validation.phone")),
        message: Yup.string().required(t("Validation.message")),
    });

    // Form submit handler
    const handleSubmit = async (
        values: FormValues,
        { setSubmitting, resetForm }: FormikHelpers<FormValues>
    ) => {
        try {

            // Create a FormData object
            const formData = new FormData();
            formData.append('full_name', values.full_name);
            formData.append('email', values.email);
            formData.append('phone', values.phone); // Ensure phone is always a string
            formData.append('message', values.message);

            // Send the FormData to the API
            const response = await fetch('http://localhost/quttouf-backend/api/user/contact-us', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json()
            console.log(data);

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            toast.success(data.message)
            resetForm();
        } catch (error) {
            console.log(error);

            alert('An error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <>
            <Breadcrumb
                items={[
                    { label: t("contactUs") , href: '/contact-us' },
                ]}
            />
            <div className="max-w-[90%] mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="py-20 md:py-32 grid grid-col-1 md:grid-cols-2 gap-16">
                    <div className='flex flex-col gap-12'>
                        <div>
                            <h4 className='text-[42px] md:text-[52px] text-[#000] font-[600] mb-6'>{t("GetInTouch")}</h4>
                        </div>
                        <div className='flex flex-col gap-6'>
                            <div className='flex items-center gap-6'>
                                <span className='w-14 h-14 flex items-center justify-center bg-[#4BAF47] rounded-[50%]'>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 14.1699C9.87 14.1699 8.13 12.4399 8.13 10.2999C8.13 8.15994 9.87 6.43994 12 6.43994C14.13 6.43994 15.87 8.16994 15.87 10.3099C15.87 12.4499 14.13 14.1699 12 14.1699ZM12 7.93994C10.7 7.93994 9.63 8.99994 9.63 10.3099C9.63 11.6199 10.69 12.6799 12 12.6799C13.31 12.6799 14.37 11.6199 14.37 10.3099C14.37 8.99994 13.3 7.93994 12 7.93994Z" fill="white" />
                                        <path d="M12.0001 22.76C10.5201 22.76 9.03005 22.2 7.87005 21.09C4.92005 18.25 1.66005 13.72 2.89005 8.33C4.00005 3.44 8.27005 1.25 12.0001 1.25C12.0001 1.25 12.0001 1.25 12.0101 1.25C15.7401 1.25 20.0101 3.44 21.1201 8.34C22.3401 13.73 19.0801 18.25 16.1301 21.09C14.9701 22.2 13.4801 22.76 12.0001 22.76ZM12.0001 2.75C9.09005 2.75 5.35005 4.3 4.36005 8.66C3.28005 13.37 6.24005 17.43 8.92005 20C10.6501 21.67 13.3601 21.67 15.0901 20C17.7601 17.43 20.7201 13.37 19.6601 8.66C18.6601 4.3 14.9101 2.75 12.0001 2.75Z" fill="white" />
                                    </svg>
                                </span>
                                <div>
                                    <span className='text-[16px] text-[#939393] font-[400] leading-[24px] mb-3'>{t("Adderss")}</span>
                                    <p className='text-[20px] text-[#000] font-[500] leading-[30px]'>Egypt Eye, Cairo,EG</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-6'>
                                <span className='w-14 h-14 flex items-center justify-center bg-[#4BAF47] rounded-[50%]'>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.45 22.75C16.32 22.75 15.13 22.48 13.9 21.96C12.7 21.45 11.49 20.75 10.31 19.9C9.14 19.04 8.01 18.08 6.94 17.03C5.88 15.96 4.92 14.83 4.07 13.67C3.21 12.47 2.52 11.27 2.03 10.11C1.51 8.87 1.25 7.67 1.25 6.54C1.25 5.76 1.39 5.02 1.66 4.33C1.94 3.62 2.39 2.96 3 2.39C3.77 1.63 4.65 1.25 5.59 1.25C5.98 1.25 6.38 1.34 6.72 1.5C7.11 1.68 7.44 1.95 7.68 2.31L10 5.58C10.21 5.87 10.37 6.15 10.48 6.43C10.61 6.73 10.68 7.03 10.68 7.32C10.68 7.7 10.57 8.07 10.36 8.42C10.21 8.69 9.98 8.98 9.69 9.27L9.01 9.98C9.02 10.01 9.03 10.03 9.04 10.05C9.16 10.26 9.4 10.62 9.86 11.16C10.35 11.72 10.81 12.23 11.27 12.7C11.86 13.28 12.35 13.74 12.81 14.12C13.38 14.6 13.75 14.84 13.97 14.95L13.95 15L14.68 14.28C14.99 13.97 15.29 13.74 15.58 13.59C16.13 13.25 16.83 13.19 17.53 13.48C17.79 13.59 18.07 13.74 18.37 13.95L21.69 16.31C22.06 16.56 22.33 16.88 22.49 17.26C22.64 17.64 22.71 17.99 22.71 18.34C22.71 18.82 22.6 19.3 22.39 19.75C22.18 20.2 21.92 20.59 21.59 20.95C21.02 21.58 20.4 22.03 19.68 22.32C18.99 22.6 18.24 22.75 17.45 22.75ZM5.59 2.75C5.04 2.75 4.53 2.99 4.04 3.47C3.58 3.9 3.26 4.37 3.06 4.88C2.85 5.4 2.75 5.95 2.75 6.54C2.75 7.47 2.97 8.48 3.41 9.52C3.86 10.58 4.49 11.68 5.29 12.78C6.09 13.88 7 14.95 8 15.96C9 16.95 10.08 17.87 11.19 18.68C12.27 19.47 13.38 20.11 14.48 20.57C16.19 21.3 17.79 21.47 19.11 20.92C19.62 20.71 20.07 20.39 20.48 19.93C20.71 19.68 20.89 19.41 21.04 19.09C21.16 18.84 21.22 18.58 21.22 18.32C21.22 18.16 21.19 18 21.11 17.82C21.08 17.76 21.02 17.65 20.83 17.52L17.51 15.16C17.31 15.02 17.13 14.92 16.96 14.85C16.74 14.76 16.65 14.67 16.31 14.88C16.11 14.98 15.93 15.13 15.73 15.33L14.97 16.08C14.58 16.46 13.98 16.55 13.52 16.38L13.25 16.26C12.84 16.04 12.36 15.7 11.83 15.25C11.35 14.84 10.83 14.36 10.2 13.74C9.71 13.24 9.22 12.71 8.71 12.12C8.24 11.57 7.9 11.1 7.69 10.71L7.57 10.41C7.51 10.18 7.49 10.05 7.49 9.91C7.49 9.55 7.62 9.23 7.87 8.98L8.62 8.2C8.82 8 8.97 7.81 9.07 7.64C9.15 7.51 9.18 7.4 9.18 7.3C9.18 7.22 9.15 7.1 9.1 6.98C9.03 6.82 8.92 6.64 8.78 6.45L6.46 3.17C6.36 3.03 6.24 2.93 6.09 2.86C5.93 2.79 5.76 2.75 5.59 2.75ZM13.95 15.01L13.79 15.69L14.06 14.99C14.01 14.98 13.97 14.99 13.95 15.01Z" fill="white" />
                                    </svg>

                                </span>
                                <div>
                                    <span className='text-[16px] text-[#939393] font-[400] leading-[24px] mb-3'>{t("PhoneNumber")}</span>
                                    <p className='text-[20px] text-[#000] font-[500] leading-[30px]'>{Configrations?.phone}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-6'>
                                <span className='w-14 h-14 flex items-center justify-center bg-[#4BAF47] rounded-[50%]'>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17 21.25H7C6.59 21.25 6.25 20.91 6.25 20.5C6.25 20.09 6.59 19.75 7 19.75H17C19.86 19.75 21.25 18.36 21.25 15.5V8.5C21.25 5.64 19.86 4.25 17 4.25H7C4.14 4.25 2.75 5.64 2.75 8.5C2.75 8.91 2.41 9.25 2 9.25C1.59 9.25 1.25 8.91 1.25 8.5C1.25 4.85 3.35 2.75 7 2.75H17C20.65 2.75 22.75 4.85 22.75 8.5V15.5C22.75 19.15 20.65 21.25 17 21.25Z" fill="white" />
                                        <path d="M11.9998 12.87C11.1598 12.87 10.3098 12.61 9.65978 12.08L6.52978 9.57997C6.20978 9.31997 6.14978 8.84997 6.40978 8.52997C6.66978 8.20997 7.13977 8.14997 7.45977 8.40997L10.5898 10.91C11.3498 11.52 12.6398 11.52 13.3998 10.91L16.5298 8.40997C16.8498 8.14997 17.3298 8.19997 17.5798 8.52997C17.8398 8.84997 17.7898 9.32997 17.4598 9.57997L14.3298 12.08C13.6898 12.61 12.8398 12.87 11.9998 12.87Z" fill="white" />
                                        <path d="M8 17.25H2C1.59 17.25 1.25 16.91 1.25 16.5C1.25 16.09 1.59 15.75 2 15.75H8C8.41 15.75 8.75 16.09 8.75 16.5C8.75 16.91 8.41 17.25 8 17.25Z" fill="white" />
                                        <path d="M5 13.25H2C1.59 13.25 1.25 12.91 1.25 12.5C1.25 12.09 1.59 11.75 2 11.75H5C5.41 11.75 5.75 12.09 5.75 12.5C5.75 12.91 5.41 13.25 5 13.25Z" fill="white" />
                                    </svg>
                                </span>
                                <div>
                                    <span className='text-[16px] text-[#939393] font-[400] leading-[24px] mb-3'>{t("Email")}</span>
                                    <p className='text-[20px] text-[#000] font-[500] leading-[30px]'>{Configrations?.email}</p>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-6'>
                            <h6 className='text-[24px] text-[#000] font-[600] leading-[30px]'>{t("FollowUs")}</h6>
                            <div className='flex items-center gap-4'>
                                <a href={Configrations?.twitter} target='_blank' className='w-12 h-12 rounded-[50%] flex items-center justify-center bg-[#F4F8ED] outline-none border-0 focus:ring-0'>
                                    <svg width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_17_675)">
                                            <path d="M16.0527 1.53613C15.7734 1.66309 15.4772 1.771 15.1641 1.85986C14.8509 1.94873 14.5293 2.01432 14.1992 2.05664H14.1611C14.4997 1.85352 14.7938 1.59749 15.0435 1.28857C15.2931 0.979655 15.4772 0.638997 15.5957 0.266602L15.6084 0.241211C15.3037 0.418945 14.98 0.575521 14.6372 0.710938C14.2944 0.846354 13.9368 0.952148 13.5645 1.02832L13.5137 1.04102C13.2174 0.719401 12.8641 0.465495 12.4536 0.279297C12.0431 0.0930986 11.6009 0 11.127 0C10.6699 0 10.2425 0.0846357 9.84473 0.253906C9.44694 0.431641 9.09993 0.66862 8.80371 0.964844C8.50749 1.26107 8.27051 1.60807 8.09277 2.00586C7.9235 2.40365 7.83887 2.83105 7.83887 3.28809C7.83887 3.4235 7.84733 3.55469 7.86426 3.68164C7.88119 3.80859 7.90234 3.93132 7.92773 4.0498V4.02441C7.24219 3.99056 6.58203 3.889 5.94727 3.71973C5.30404 3.54199 4.69678 3.30501 4.12549 3.00879C3.5542 2.71257 3.01888 2.36556 2.51953 1.96777C2.02865 1.56152 1.58008 1.11296 1.17383 0.62207L1.16113 0.59668C1.01725 0.833659 0.907227 1.0918 0.831055 1.37109C0.754883 1.65039 0.716797 1.94238 0.716797 2.24707C0.716797 2.81413 0.847982 3.33675 1.11035 3.81494C1.37272 4.29313 1.72396 4.68034 2.16406 4.97656H2.17676C1.89746 4.9681 1.63298 4.9279 1.3833 4.85596C1.13363 4.78402 0.894531 4.68457 0.666016 4.55762L0.691406 4.57031V4.6084C0.691406 5.00619 0.754883 5.38281 0.881836 5.73828C1.01725 6.09375 1.20133 6.41325 1.43408 6.69678C1.66683 6.98031 1.94401 7.2194 2.26562 7.41406C2.57878 7.60872 2.92155 7.74837 3.29395 7.83301H3.31934C3.19238 7.86686 3.05485 7.89437 2.90674 7.91553C2.75863 7.93669 2.6084 7.94727 2.45605 7.94727C2.34603 7.94727 2.23812 7.94092 2.13232 7.92822C2.02653 7.91553 1.92285 7.90072 1.82129 7.88379H1.83398C1.94401 8.21387 2.10059 8.51855 2.30371 8.79785C2.49837 9.06868 2.729 9.30566 2.99561 9.50879C3.26221 9.71191 3.55632 9.86849 3.87793 9.97852C4.19954 10.097 4.54232 10.1605 4.90625 10.1689C4.62695 10.389 4.33073 10.5837 4.01758 10.7529C3.70443 10.9222 3.37646 11.0682 3.03369 11.1909C2.69092 11.3136 2.33757 11.4089 1.97363 11.4766C1.60124 11.5358 1.22461 11.5654 0.84375 11.5654C0.835286 11.5654 0.831055 11.5654 0.831055 11.5654C0.687174 11.5654 0.547526 11.5612 0.412109 11.5527C0.276693 11.5443 0.141276 11.5316 0.00585938 11.5146L0.0439453 11.5273C0.399414 11.7559 0.77181 11.9632 1.16113 12.1494C1.55892 12.3271 1.9694 12.4795 2.39258 12.6064C2.81576 12.7334 3.25163 12.8307 3.7002 12.8984C4.14876 12.9661 4.60579 13 5.07129 13C6.58626 13 7.9235 12.7165 9.08301 12.1494C10.2425 11.5824 11.2179 10.8503 12.0093 9.95312C12.8006 9.05599 13.3994 8.05306 13.8057 6.94434C14.2119 5.83561 14.415 4.73958 14.415 3.65625L14.4023 3.2373C14.7324 3.00033 15.0329 2.74219 15.3037 2.46289C15.5745 2.18359 15.8158 1.88314 16.0273 1.56152L16.0527 1.53613Z" fill="#1F1E17" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_17_675">
                                                <rect width="16.02" height="13" fill="white" transform="matrix(1 0 0 -1 0 13)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </a>
                                <a href={Configrations?.facebook} target='_blank' className='w-12 h-12 rounded-[50%] flex items-center justify-center bg-[#F4F8ED] outline-none border-0 focus:ring-0'>
                                    <svg width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.5625 4.46875V2.84375C4.5625 2.6237 4.6429 2.43327 4.80371 2.27246C4.96452 2.11165 5.15495 2.03125 5.375 2.03125H6.1875V0H4.5625C3.88542 0 3.3099 0.236979 2.83594 0.710938C2.36198 1.1849 2.125 1.76042 2.125 2.4375V4.46875H0.5V6.5H2.125V13H4.5625V6.5H6.1875L7 4.46875H4.5625Z" fill="#1F1E17" />
                                    </svg>
                                </a>
                                <a href='https://www.linkedin.com' target='_blank' className='w-12 h-12 rounded-[50%] flex items-center justify-center bg-[#F4F8ED] outline-none border-0 focus:ring-0'>
                                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.5 7.90918V12.708H10.7197V8.22656C10.7197 7.65951 10.6097 7.20247 10.3896 6.85547C10.1696 6.50846 9.80566 6.33496 9.29785 6.33496C8.91699 6.33496 8.61019 6.44076 8.37744 6.65234C8.14469 6.86393 7.97754 7.09668 7.87598 7.35059C7.83366 7.44369 7.80615 7.54948 7.79346 7.66797C7.78076 7.78646 7.77441 7.90918 7.77441 8.03613V12.708H4.99414C4.99414 12.708 4.99414 12.3102 4.99414 11.5146C5.0026 10.7106 5.00684 9.80924 5.00684 8.81055C5.00684 7.81185 5.00684 6.86393 5.00684 5.9668C5.00684 5.06966 5.0026 4.52376 4.99414 4.3291H7.77441V5.52246C7.77441 5.52246 7.7723 5.52458 7.76807 5.52881C7.76383 5.53304 7.76172 5.53939 7.76172 5.54785H7.77441V5.52246C7.96061 5.2347 8.24202 4.93213 8.61865 4.61475C8.99528 4.29736 9.55176 4.13867 10.2881 4.13867C10.7451 4.13867 11.1725 4.21061 11.5703 4.35449C11.9596 4.50684 12.2982 4.73958 12.5859 5.05273C12.8737 5.36589 13.098 5.75944 13.2588 6.2334C13.4196 6.70736 13.5 7.26595 13.5 7.90918ZM2.07422 0.291992C1.60026 0.291992 1.2194 0.429524 0.931641 0.70459C0.64388 0.979655 0.5 1.32454 0.5 1.73926C0.5 2.13704 0.639648 2.4777 0.918945 2.76123C1.19824 3.04476 1.57064 3.18652 2.03613 3.18652H2.06152C2.54395 3.18652 2.92692 3.04476 3.21045 2.76123C3.49398 2.4777 3.63574 2.13704 3.63574 1.73926C3.62728 1.32454 3.48551 0.979655 3.21045 0.70459C2.93538 0.429524 2.55664 0.291992 2.07422 0.291992ZM0.665039 12.708H3.45801V4.3291H0.665039V12.708Z" fill="#1F1E17" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[12px] bg-[#F4F8ED] p-8 flex flex-col justify-center">
                        <p className="text-[#31A13A] text-[16px] font-[500] mb-4">{t("HaveAQuestion")}</p>
                        <h2 className="text-[#000] text-[40px] md:text-[50px] font-[600] mb-10">{t("SendUsAMessage")}</h2>
                        <Formik
                            initialValues={{
                                full_name: '',
                                email: '',
                                phone: '', // Explicitly set as an empty string
                                message: ''
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form className="w-full flex flex-col gap-4">
                                    <div>
                                        <Field
                                            type="text"
                                            name="full_name"
                                            placeholder={t("fullName")}
                                            className="w-full border-0 bg-white text-[14px] font-[400] rounded-[4px] p-4 outline-none ring-0 text-[#000] placeholder:text-[#6C757D]"
                                        />
                                        <ErrorMessage name="full_name" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <div className="grid grid-col-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Field
                                                type="email"
                                                name="email"
                                                placeholder={t("email")}
                                                className="w-full border-0 bg-white text-[14px] font-[400] rounded-[4px] p-4 outline-none ring-0 text-[#000] placeholder:text-[#6C757D]"
                                            />
                                            <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>
                                        <div>
                                            <Field
                                                type="tel"
                                                name="phone"
                                                placeholder={t("phone")}
                                                className="w-full border-0 bg-white text-[14px] font-[400] rounded-[4px] p-4 outline-none ring-0 text-[#000] placeholder:text-[#6C757D]"
                                            />
                                            <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>
                                    </div>

                                    <div>
                                        <Field
                                            as="textarea"
                                            rows={6}
                                            name="message"
                                            placeholder={t("message")}
                                            className="resize-none w-full border-0 bg-white text-[14px] font-[400] rounded-[4px] p-4 outline-none ring-0 text-[#000] placeholder:text-[#6C757D]"
                                        />
                                        <ErrorMessage name="message" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="flex items-center gap-2 w-full md:w-[50%]"
                                        disabled={isSubmitting}
                                    >
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 18 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M16.4726 0.724609C16.7603 0.569661 17.037 0.591797 17.3027 0.791016C17.5904 0.968099 17.7122 1.22266 17.6679 1.55469L15.2773 15.8984C15.233 16.1419 15.0891 16.3301 14.8456 16.4629C14.6243 16.5957 14.4029 16.6068 14.1816 16.4961L10.0312 14.7695L7.90618 17.3262C7.68482 17.6139 7.39706 17.6914 7.0429 17.5586C6.68873 17.4479 6.51165 17.2044 6.51165 16.8281V14.1387L14.5136 4.41016C14.58 4.29948 14.5689 4.21094 14.4804 4.14453C14.3919 4.05599 14.3033 4.04492 14.2148 4.11133L4.68547 12.5117L1.16594 11.0508C0.856047 10.918 0.690032 10.6855 0.667896 10.3535C0.645761 10.0215 0.778573 9.77799 1.06633 9.62305L16.4726 0.724609Z"
                                                fill="white"
                                            />
                                        </svg>
                                        <span className="text-[16px] font-[700]">
                                            {isSubmitting ? t("Sendding") : t("GetInTouch")}
                                        </span>
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
            <div className="w-full">
                <iframe
                    width={"100%"}
                    height={300}
                    frameBorder={0}
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    id="gmap_canvas"
                    src="https://maps.google.com/maps?width=980&amp;height=300&amp;hl=en&amp;q=51%20Oakley%20Close%20,%20Isleworth,%20TW7%204HY,%20United%20Kingdom%20Isleworth+()&amp;t=p&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                ></iframe>
            </div>
        </>
    );
};

export default ContactUsPage;
