import dynamic from 'next/dynamic';

export default dynamic(() => import('./GeoCodeAutoComplete'), { ssr: false });
