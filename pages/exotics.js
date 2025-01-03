import { SITE_TITLE } from '@/utils/constants'
import Head from 'next/head'
import { ProductPageLayout } from '@/components/ProductPageLayout'

export default function ExoticsPage() {
  return (
    <>
      <Head>
        <title>{SITE_TITLE} - Exotics</title>
      </Head>
      <ProductPageLayout
        pageTitle="Exotics"
        activePage="exotics"
        fetchUrl="/api/products/exotics"
      />
    </>
  )
} 