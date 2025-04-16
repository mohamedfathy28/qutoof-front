"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Link , useRouter } from "@/i18n/routing";
import { useUser } from "../../_contexts/userContext";
import Button from "../../_components/button/Button";

import logo from "@/media/logo.png";

interface ICountry {
  id: number;
  name: string;
  phone_code: string;
}

const SignUpPage = () => {
  const t = useTranslations("auth.signup");
  const router = useRouter();
  const { updateUser } = useUser();

  const [countries, setCountries] = useState<ICountry[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://quttouf.com//api/user/countries");
        const result = await response.json();
        setCountries(result);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const validationSchema = Yup.object({
    username: Yup.string()
      .required(t("Validation.username_required"))
      .min(3, t("Validation.username_min")),
    country_code: Yup.number().required(t("Validation.country_required")),
    phone: Yup.number()
      .required(t("Validation.phone_required"))
      .min(5, t("Validation.phone_min")),
    password: Yup.string()
        .required(t("Validation.password_required"))
        .min(8, t("Validation.password_min"))
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            t("Validation.password_strength")
        ),
    password_confirmation: Yup.string()
      .required(t("Validation.password_required"))
      .oneOf([Yup.ref("password")], t("Validation.password_match"))
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      country_code: '',
      phone: '',
      password: '',
      password_confirmation: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData()
        formData.append('username', values.username)
        formData.append('country_code', values.country_code)
        formData.append('phone', values.phone)
        formData.append('password', values.password)
        formData.append('password_confirmation', values.password_confirmation)

        console.log(formData);

        const response = await fetch("https://quttouf.com//api/user/register", {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()


        if (response.ok) {
          console.log(data);
          toast.success(data.message)
          localStorage.setItem('token', JSON.stringify(data.data.access_token)); // Save token to localStorage
          localStorage.setItem('userInfo', JSON.stringify(data.data.user)); // Save User to localStorage
          updateUser(data.data.user)
          router.push('/'); // Redirect to home on successful login
        }
        toast.error(data.message)

        // Add your redirect or success handling here
      } catch (error) {
        console.error('Signup error:', error)
        if (error instanceof Error) {
          toast.success(error.message);
        } else {
          toast.success('An unexpected error occurred');
        }
      }
    },
  })

  return (
    <div className="p-6">
      <div className="space-y-6 mb-8 text-center flex flex-col items-center justify-center">
        <Image src={logo} alt="Logo" width={150} height={50} />
        <h2 className="text-2xl font-bold">{t("messages.welcome_title")}</h2>
        <p className="text-gray-600">{t("messages.welcome_subtitle")}</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">

        <div className='space-y-1 mb-4'>
          <label htmlFor="username" className='text-[#656C77] text-[16px] leading-[24px] font-[500]'>{t("messages.username_label")}</label>
          <input
            type="text"
            placeholder={t("messages.username_label")}
            {...formik.getFieldProps("username")}
            className="w-full px-3 py-2 border rounded"
          />
          {formik.errors.username && <div className="text-red-500">{formik.errors.username}</div>}
        </div>


        <div className='space-y-1 mb-4'>
          <label htmlFor="username" className='text-[#656C77] text-[16px] leading-[24px] font-[500]'>{t("messages.country_label")}</label>
          <select
            {...formik.getFieldProps("country_code")}
            value={formik.values.country_code || "20"}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">{t("messages.country_label")}</option>
            {countries.map((ele) => (
              <option key={ele.id} value={ele.phone_code}>
                {ele.name} (+{ele.phone_code})
              </option>
            ))}
          </select>
          {formik.errors.country_code && <div className="text-red-500">{formik.errors.country_code}</div>}
        </div>

        <div className='space-y-1 mb-4'>
          <label htmlFor="username" className='text-[#656C77] text-[16px] leading-[24px] font-[500]'>{t("messages.phone_label")}</label>

          <input
            type="text"
            placeholder={t("messages.phone_label")}
            {...formik.getFieldProps("phone")}
            className="w-full px-3 py-2 border rounded"
          />
          {formik.errors.phone && <div className="text-red-500">{formik.errors.phone}</div>}
        </div>

        <div className='space-y-1 mb-4'>
          <label htmlFor="username" className='text-[#656C77] text-[16px] leading-[24px] font-[500]'>{t("messages.password_label")}</label>

          <input
            type="password"
            placeholder={t("messages.password_label")}
            {...formik.getFieldProps("password")}
            className="w-full px-3 py-2 border rounded"
          />
          {formik.errors.password && <div className="text-red-500">{formik.errors.password}</div>}
        </div>


        <div className='space-y-1 mb-4'>
          <label htmlFor="username" className='text-[#656C77] text-[16px] leading-[24px] font-[500]'>{t("messages.password_confirmation_label")}</label>

          <input
            type="password"
            placeholder={t("messages.password_confirmation_label")}
            {...formik.getFieldProps("password_confirmation")}
            className="w-full px-3 py-2 border rounded"
          />

          {formik.errors.password_confirmation && (
            <div className="text-red-500 text-sm">{formik.errors.password_confirmation}</div>
          )}

        </div>


        <Button type="submit" className="w-full">
        {formik.isSubmitting ? t("messages.signing_up") : t("messages.signin_link")}
        </Button>

        <p className="text-center">
          {t("messages.signin_redirect")} <Link href="/auth/signin" className="text-[#009444]">{t("messages.signin_link")}</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpPage;
