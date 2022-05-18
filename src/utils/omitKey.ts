const omitKey = (obj: any, arr: string[]): any =>
  Object.keys(obj)
    .filter((k) => !arr.includes(k))
    .reduce((acc: any, key: string) => ((acc[key] = obj[key]), acc), {});

export default omitKey;
