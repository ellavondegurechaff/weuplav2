import { SITE_TITLE } from '@/utils/constants'
import Head from 'next/head'
import { ProductPageLayout } from '@/components/ProductPageLayout'

export default function MidsPage() {
  return (
    <>
      <Head>
        <title>{SITE_TITLE} - Mids</title>
      </Head>
      <ProductPageLayout
        pageTitle="Mids"
        activePage="mids"
        fetchUrl="/api/products/mids"
      />
    </>
  )
} 