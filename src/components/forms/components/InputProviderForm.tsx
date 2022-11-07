import React from "react";
import { AutoComplete } from "antd";
import { Controller } from "react-hook-form";
import EntranceService from "../../../services/EntranceService";

interface IInputProviderForm {
  name: string;
  control: any;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

const InputProviderForm: React.FC<IInputProviderForm> = ({
  name,
  control,
  disabled = false,
  placeholder = "",
  maxLength = undefined,
}) => {
  const DataEntranceService = new EntranceService();

  const [providerList, setProviderList] = React.useState<string[]>([]);

  React.useEffect(() => {
    const onDataLoaded = (data: string[]) => {
      setProviderList(data);
    };

    const onError = (error: any) => {
      alert(error);
    };

    DataEntranceService.getProviders().then(onDataLoaded).catch(onError);
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <AutoComplete
          allowClear
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          options={providerList.map((provider, _) => ({ value: provider }))}
          filterOption={(inputValue, option) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
          {...field}
        />
      )}
    />
  );
};

export default InputProviderForm;
