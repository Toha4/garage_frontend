import React from "react";
import { Controller } from "react-hook-form";
import TableEntranceMaterials from "./TableEntranceMaterials";

interface ITableEntranceMaterialsForm {
  name: string;
  control: any;
  readOnlyMode?: boolean;
}

const TableEntranceMaterialsForm: React.FC<ITableEntranceMaterialsForm> = ({ name, control, readOnlyMode = false }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <TableEntranceMaterials value={value} onChange={onChange} readOnlyMode={readOnlyMode} />
      )}
    />
  );
};

export default TableEntranceMaterialsForm;
