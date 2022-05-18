const toCapitalize = (value: string | undefined): string => {
  if (value) {
    const trimedValue = value.trim();
    const firstLetter = trimedValue.slice(0, 1).toUpperCase();
    const restLetters = trimedValue.slice(1).toLowerCase();
    const result = firstLetter + restLetters;

    return result;
  }

  return "";
};

export default toCapitalize;
