import isServer from './isServer';

type BrowserStorageType = 'localStorage' | 'sessionStorage';

export const isExpired = (expiryTime = 9000000000000, currentTime: number = Date.now()) => {
  return currentTime > expiryTime;
};

export const getExpiry = (expiry: Expiry, currentTime: number = Date.now()) => {
  const millisecondsInSecond = 1000;
  const secondsInMinute = 60;
  const minutesInHour = 60;
  const hoursInDay = 24;
  const minuteMultiplier = millisecondsInSecond * secondsInMinute;
  const dayMultiplier = minuteMultiplier * minutesInHour * hoursInDay;
  let additionalTime;
  if (expiry.unit === 'minutes') {
    additionalTime = expiry.value * minuteMultiplier;
  } else {
    additionalTime = expiry.value * dayMultiplier;
  }
  return currentTime + additionalTime;
};

export type CurrentlyUsedKeys = 'lastSearchedLocation' | 'routeBeforeLeavingToLogin';

type GetFromStorageArgs = {
  type: BrowserStorageType;
  key: CurrentlyUsedKeys;
};

export const getFromStorage = <T>({ type, key }: GetFromStorageArgs): T | null => {
  if (isServer()) return null;
  try {
    // dynamically infer local or session storage from window
    const data = window[type].getItem(key);
    if (data === null) return null;
    const parsedData = JSON.parse(data);
    if (parsedData.expiryTime && isExpired(parsedData.expiryTime)) {
      window[type].removeItem(key);
      return null;
    }
    return parsedData.value;
  } catch (error) {
    return null;
  }
};

type Expiry = {
  unit: 'days' | 'minutes';
  value: number;
};

type SetToStorageArgs = {
  type: BrowserStorageType;
  key: CurrentlyUsedKeys;
  value: any;
  expiry?: Expiry;
};

export const setToStorage = ({ type, key, value, expiry = { unit: 'days', value: 30 } }: SetToStorageArgs) => {
  const item = { value, expiryTime: getExpiry(expiry) };
  const itemData = JSON.stringify(item);

  try {
    window[type].setItem(key, itemData);
    return true;
  } catch (error) {
    console.error(error);
    console.error(`There were problems writing to ${type}`);
    return false;
  }
};

export const refreshStorage = ({
  key,
  type,
  expiry = { unit: 'minutes', value: 30 },
}: GetFromStorageArgs & { expiry?: Expiry }) => {
  const value = getFromStorage({ type, key });
  if (value) {
    setToStorage({
      type,
      key,
      value,
      expiry,
    });
    return true;
  }
  return false;
};

export const removeFromStorage = ({ type, key }: GetFromStorageArgs) => {
  try {
    window[type].removeItem(key);
    return true;
  } catch (error) {
    console.error(error);
    console.error(`There were problems removing ${key} from ${type}`);
    return false;
  }
};

export const getLastSearchedLocation = () => getFromStorage({ type: 'localStorage', key: 'lastSearchedLocation' });
export const getRouteBeforeLeavingToLogIn = () =>
  getFromStorage({ type: 'localStorage', key: 'routeBeforeLeavingToLogin' });
