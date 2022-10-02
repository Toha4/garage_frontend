import React from "react";
import { Controller } from "react-hook-form";
import TableOrderWorks from "../TableOrderWorks";

interface ISelectStatus {
  name: string;
  control: any;
}

const TableOrderWorksForm: React.FC<ISelectStatus> = ({ name, control }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => <TableOrderWorks value={value} onChange={onChange} />}
    />
  );
};

export default TableOrderWorksForm;
