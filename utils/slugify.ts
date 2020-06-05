export default function slugify(str: string) {
  const punctuationLess = str.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
  const withDashes = punctuationLess.replace(/\s/g, '-');
  const lowerCased = withDashes.toLowerCase();
  return lowerCased;
}
