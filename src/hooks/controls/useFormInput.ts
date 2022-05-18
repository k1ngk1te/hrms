import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { OptionsType } from "./types";

const useFormInput = (initValue: any, options?: OptionsType) => {
  const [value, setValue] = useState(initValue || "");

  const handleChange = useCallback(
    ({
      target: { checked, files, type, value },
    }: ChangeEvent<HTMLInputElement>) => {
      setValue(
        type === "checkbox"
          ? checked
          : type === "file"
          ? files && files[0]
          : value
      );

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
    reset: resetValue
  };
};

export default useFormInput;
