import { DeviceScreenSizes } from '../types/DeviceScreenSizes';
export const isMobile = () => {
  return process.browser && window && window.innerWidth < DeviceScreenSizes.Tablet;
};
