import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { OptionsType } from "./types"

const useFormTextArea = (initValue: any, options?: OptionsType) => {
  const [value, setValue] = useState(initValue || "");

  const handleChange = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLTextAreaElement>) => {
      setValue(value);
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

export default useFormTextArea;
