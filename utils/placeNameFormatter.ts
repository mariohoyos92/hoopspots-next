export default function placeNameFormatter(placeNameFromMapbox: string) {
  const punctuationLess = placeNameFromMapbox.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
  const withDashes = punctuationLess.replace(/\s/g, '-');
  const lowerCased = withDashes.toLowerCase();
  return lowerCased;
}
