"use client";
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import logo from '@/media/logo.png';
import { FaEye } from 'react-icons/fa';
import { RiEyeCloseFill } from 'react-icons/ri';
import Button from '../../_components/button/Button';
import { Link } from "@/i18n/routing";;
import { useRouter } from "@/i18n/routing";
import toast from 'react-hot-toast';
import { useUser } from '../../_contexts/userContext';
import { useTranslations } from 'next-intl';

interface ICountry {
  id: number;
  name: string;
  phone_code: string;
}

const SignInPage: React.FC = () => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const { updateUser } = useUser();

  const t = useTranslations("auth.Login");

  const [countries, setCountries] = useState<ICountry[]>([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch("https://quttouf.com//api/user/countries");
          const result = await response.json();
          setCountries(result);
        } catch (error) {
          console.error("Error fetching countries:", error);
        }
      };
  
      fetchData();
    }, []);


  const formik = useFormik({
    initialValues: {
      country_code:'',
      phone: '',
      password: '',
    },
    validationSchema: Yup.object({
      country_code: Yup.number()
        .required(t("Validation.country_required"))
        .min(1, t("Validation.country_min")),
  
      phone: Yup.number().required(t("Validation.phone_required")),
  
      password: Yup.string()
        .min(6, t("Validation.password_min"))
        .required(t("Validation.password_required")),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      const formData = new FormData();
      formData.append('country_code', values.country_code);
      formData.append('phone', values.phone);
      formData.append('password', values.password);

      try {
        const response = await fetch(`https://quttouf.com//api/user/login`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          toast.success(data.message);
          localStorage.setItem('token', JSON.stringify(data.data.access_token));
          localStorage.setItem('userInfo', JSON.stringify(data.data.user));
          updateUser(data.data.user);
          router.push('/');
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error('Error during sign-in:', error);
        toast.error('An error occurred. Please try again later.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <div className="space-y-8 mb-8">
        <Image src={logo} alt="welcome img" />
        <div className="space-y-2">
          <h2 className="text-[#17181B] text-[24px] font-[600]">{t("welcome_back")}</h2>
          <p className="text-[#656C77] text-[16px] font-[400]">{t("enter_credentials")}</p>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-1 mb-4">
          <label htmlFor="country_code" className="text-[#656C77] text-[16px] font-[500]">
            {t("country")}
          </label>
          <select
              id="country_code"
              {...formik.getFieldProps("country_code")}
              value={formik.values.country_code || "20"}
              className="w-full px-3 py-2 border border-[#ECECEE] bg-white rounded-[8px] outline-none text-[16px]"
          >
            {countries.map((ele) => (
                <option key={ele.id} value={ele.phone_code}>
                  {ele.name} {`(+${ele.phone_code})`}
                </option>
            ))}
          </select>
          {formik.errors.country_code && <div className="text-red-500 text-sm">{formik.errors.country_code}</div>}
        </div>

        <div className="space-y-1 mb-4">
          <label htmlFor="phone" className="text-[#656C77] text-[16px] font-[500]">
            {t("phone")}
          </label>
          <input
              type="text"
              id="phone"
              name="phone"
              placeholder={t("enter_phone")}
              className="w-full px-3 py-2 border border-[#ECECEE] bg-white rounded-[8px] outline-none text-[16px]"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.phone && <div className="text-red-500 text-sm">{formik.errors.phone}</div>}
        </div>

        <div className="space-y-1 mb-6">
          <label htmlFor="password" className="text-[#656C77] text-[16px] font-[500]">
            {t("password")}
          </label>
          <div className="flex items-center gap-2 w-full px-4 py-2 mb-1 border border-[#ECECEE] bg-white rounded-[8px]">
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              name="password"
              placeholder={t("enter_password")}
              className="w-full outline-none text-[16px]"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <span className="text-[24px] cursor-pointer text-[#17181B]" onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? <FaEye /> : <RiEyeCloseFill />}
            </span>
          </div>
          {formik.errors.password && <div className="text-red-500 text-sm">{formik.errors.password}</div>}

          <div className="flex justify-between items-center gap-4">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                className="accent-[#009444] w-4"
                onChange={formik.handleChange}
              />
              <label htmlFor="rememberMe" className="text-[#A2A1A8] text-[14px] font-[400]">
                {t("remember_me")}
              </label>
            </div>
            <Link href="/auth/forget-password" className="text-[#009444]">
              {t("forget_password")}
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full mb-3" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? t("logging_in") : t("login")}
        </Button>

        <p className="text-center text-[#656C77] text-[16px] font-[400]">
          {t("dont_have_account")}{" "}
          <Link href="/auth/signup" className="text-[#009444]">
            {t("sign_up")}
          </Link>
        </p>
      </form>
    </>
  );
};

export default SignInPage;
