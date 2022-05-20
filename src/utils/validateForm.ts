export const updateObject = (
  result: object,
  key: string,
  value: object | string
): object => Object.assign(result, { [key]: value });

const validateForm = (form: object, invalidates?: string[]) => {
  let valid = true;
  const result: any = {};
  const entries = Object.entries(form);

  entries.forEach((entry) => {
    const key = entry[0];
    const value = entry[1];

    if (invalidates && invalidates.includes(key)) updateObject(result, key, "");
    else {
      if (typeof value === "object") {
        const answer = validateForm(value, invalidates);
        if (answer.valid === false) valid = false;
        updateObject(result, key, answer.result);
      } else if (!value) {
        valid = false;
        updateObject(result, key, `${key} is required`);
      } else {
        updateObject(result, key, "");
      }
    }
  });

  return { result, valid };
};

export default validateForm;
