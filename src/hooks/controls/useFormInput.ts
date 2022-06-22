import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { OptionsType } from "./types";

const useFormInput = (initValue: any, options?: OptionsType) => {
  const [formValue, setValue] = useState(initValue || "");

  const handleChange = useCallback(
    ({
      target: { checked, files, type, value },
    }: ChangeEvent<HTMLInputElement>) => {
      const newValue =
        type === "checkbox"
          ? checked
          : type === "file"
          ? files && files[0]
          : value;
      setValue(newValue);
      if (options?.onChange) options.onChange({ value: newValue });
    },
    [options]
  );

  const resetValue = useCallback(() => setValue(initValue || ""), [initValue]);

  useEffect(() => {
    setValue(initValue);
  }, [initValue]);

  return {
    value: formValue,
    setValue,
    onChange: handleChange,
    reset: resetValue,
  };
};

export default useFormInput;
