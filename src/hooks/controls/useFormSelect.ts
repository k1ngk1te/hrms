import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { OptionsType } from "./types";

const useFormSelect = (initValue: any, options?: OptionsType) => {
  const [value, setValue] = useState(initValue || "");

  const handleChange = useCallback(
    ({ target: { selectedOptions, value } }: ChangeEvent<HTMLSelectElement>) => {
		if (options && options.multiple === true) {
			const selectValues = Array.from(
			       selectedOptions,
			       (option) => option.value
			     )
			setValue(selectValues)
		} else setValue(value)
		if (options?.onChange) options.onChange({ value })
    },
    [options]
  );

  const resetValue = useCallback(() => setValue(initValue || ""), [initValue]);

  useEffect(() => {
    setValue(initValue)
  }, [initValue])

  return {
    value,
    setValue,
    onChange: handleChange,
    reset: resetValue,
  };
};

export default useFormSelect;
