import React from 'react'
import Breadcrumb from '../../_components/breadcrumb/breadcrumb'
import Out_team from '../../_components/home_components/Out_team'
import Our_client from '../../_components/home_components/Our_client'
import { useTranslations } from 'next-intl'

const PartnersPage = () => {

  const t = useTranslations("HomePage");


  return (
    <>
      <Breadcrumb
        items={[
          { label: t("Partners"), href: '/partners' },
        ]}
      />

      <Out_team />
      <Our_client />


    </>
  )
}

export default PartnersPage