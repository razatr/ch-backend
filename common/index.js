export const snakeToCamel = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel);
  }

  const camelObj = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, match) => match.toUpperCase());
      camelObj[camelKey] = snakeToCamel(obj[key]);
    }
  }

  return camelObj;
}
