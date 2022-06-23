import { useCallback, useEffect, useState } from "react";
import { OptionsType } from "./types";

const useFormSelect = (initValue: string | string[], options?: OptionsType) => {
  const [formValue, setValue] = useState(initValue || "");

  // There is an error with this handle Select Function
  const handleSelect = useCallback(
    (option: { title: string; value: string }) => {
      let newValue: string | string[] = option.value;
      if (options && options.multiple === true) {
        if (Array.isArray(formValue) && formValue.includes(option.value))
          newValue = formValue.filter((value) => value !== option.value)
        else newValue = [...formValue, option.value]
      }

      setValue(newValue);
      if (options?.onChange) options.onChange({ value: newValue });
    },
    [formValue, options]
  );

  const resetValue = useCallback(() => setValue(initValue || ""), [initValue]);

  useEffect(() => {
    setValue(initValue);
  }, [initValue]);

  return {
    value: formValue,
    setValue,
    onSelect: handleSelect,
    reset: resetValue,
  };
};

export default useFormSelect;
