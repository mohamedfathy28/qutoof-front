"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import Button from "../../_components/button/Button";
import { Link } from "@/i18n/routing";
import toast from "react-hot-toast";
import Modal from "../forget-password/Modal";
import Image from "next/image";
import congratsImg from '@/media/congrats.png';

const ResetPassword = () => {
    const t = useTranslations("auth.resetPassword"); // Get translations
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const validationSchema = Yup.object({
        password: Yup.string()
            .required(t("Validation.password_required"))
            .min(8, t("Validation.password_min")),
        password_confirmation: Yup.string()
            .required(t("Validation.password_confirmation_required"))
            .oneOf([Yup.ref("password")], t("Validation.password_match")),
    });

    const handleSendOTP = async (values: { password: string; password_confirmation: string }) => {
        const token = typeof window !== "undefined" && localStorage.getItem("token");

        const myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${token ? JSON.parse(token) : ""}`);

        const formData = new FormData();
        formData.append("password", values.password);
        formData.append("password_confirmation", values.password_confirmation);

        try {
            const response = await fetch("http://localhost/quttouf-backend/api/user/reset-password", {
                method: "POST",
                headers: myHeaders,
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(t("Messages.password_updated"));
                setIsOpen(true);
            } else {
                toast.error(result.message || t("Messages.network_error"));
            }
        } catch (error) {
               if (error instanceof Error) {
          toast.error(error.message); 
        } else {
          toast.error('An unexpected error occurred');
        };
        }
    };

    return (
        <>
            <div>
                <Formik
                    initialValues={{ password: "", password_confirmation: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSendOTP}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-8 mb-8">
                            <div className="space-y-1">
                                <label htmlFor="password" className="text-[#656C77] text-[16px] font-[500]">
                                    {t("Messages.reset_password")}
                                </label>
                                <Field
                                    type="password"
                                    name="password"
                                    id="password"
                                    className="w-full px-3 py-2 border border-[#ECECEE] bg-white rounded-[8px] text-[16px] outline-0"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div className="space-y-1 flex flex-col">
                                <label htmlFor="password_confirmation" className="text-[#656C77] text-[16px] font-[500]">
                                    {t("Validation.password_confirmation_required")}
                                </label>
                                <Field
                                    type="password"
                                    name="password_confirmation"
                                    id="password_confirmation"
                                    className="w-full px-3 py-2 border border-[#ECECEE] bg-white rounded-[8px] text-[16px] outline-0"
                                />
                                <ErrorMessage name="password_confirmation" component="div" className="text-red-500 text-sm" />
                            </div>

                            <Button type="submit" className="w-full mb-3" disabled={isSubmitting}>
                                {isSubmitting ? t("Messages.sending") : t("Messages.reset_password")}
                            </Button>
                        </Form>
                    )}
                </Formik>

                <Link href="/auth/signin" className="text-[16px] text-[#79818F] flex items-center justify-center gap-2">
                    <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0.971293 8.52957C0.830842 8.38895 0.751953 8.19832 0.751953 7.99957C0.751953 7.80082 0.830842 7.6102 0.971293 7.46957L7.95829 0.469571C8.02744 0.397906 8.11018 0.340732 8.20166 0.301383C8.29314 0.262033 8.39155 0.241297 8.49113 0.240386C8.59072 0.239474 8.68948 0.258403 8.78167 0.296071C8.87386 0.333738 8.95763 0.389389 9.02808 0.459775C9.09853 0.530161 9.15426 0.613872 9.19202 0.706027C9.22977 0.798181 9.24879 0.896931 9.24798 0.996516C9.24716 1.0961 9.22651 1.19452 9.18725 1.28605C9.14799 1.37757 9.09089 1.46035 9.01929 1.52957L3.31129 7.24857L19.5013 7.23757C19.7002 7.23731 19.8911 7.31607 20.0319 7.45653..."
                        />
                    </svg>
                    {t("Messages.back_to_login")}
                </Link>
            </div>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className="flex flex-col items-center gap-4">
        <Image src={congratsImg} alt="congrats" />
        <h6 className="text-center text-[#17181B] text-[28px] font-[600]">
          {t("Messages.password_update_success")}
        </h6>
        <p className="text-[#8E98A8] text-[16px] font-[400]">
          {t("Messages.password_update_description")}
        </p>
        <Link
          href="/auth/signin"
          className="w-full p-2 text-center rounded-[8px] text-white bg-[#009444] text-[16px]"
        >
          {t("Messages.back_to_login")}
        </Link>
      </div>
    </Modal>
        </>
    );
};

export default ResetPassword;
