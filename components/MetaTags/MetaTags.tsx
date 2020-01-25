import React from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import { useRouter } from 'next/router';

interface Props {
  title?: string;
  description?: string;
  image?: string | undefined | boolean;
}

const { publicRuntimeConfig } = getConfig();

const FALLBACK_IMAGE = `${publicRuntimeConfig.imgixUrl}/hp/hoops.jpg`;

const MetaTags: React.FC<Props> = ({ title = 'Hoops', description = '', image = FALLBACK_IMAGE }) => {
  const router = useRouter();
  const { asPath } = router;
  const canonicalUrl = `https://www.hoopspots.com${asPath}`;
  const metaImage = image ? `${image}?auto=compress&fit=fill&fill=solid&w=1200&h=630&fm=jpg` : '';
  const metaData = [
    {
      name: 'description',
      content: description,
    },
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      property: 'og:image',
      content: metaImage,
    },
    {
      property: 'og:url',
      content: `https://www.hoopspots.com${asPath}`,
    },
  ];
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:site_name" content="HoopSpots" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@hoop_spots" />
      <link rel="canonical" href={canonicalUrl} />
      {metaData.map(item => {
        return <meta {...item} key={item.name || item.property} />;
      })}
    </Head>
  );
};

export default MetaTags;