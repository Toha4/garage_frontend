import React from "react";
import { Controller } from "react-hook-form";
import TableOrderMaterials from "./TableOrderMaterials";

interface ITableOrderMaterialsForm {
  name: string;
  control: any;
  editMode?: boolean;
  defaultCompatbility?: string;
}

const TableOrderMaterialsForm: React.FC<ITableOrderMaterialsForm> = ({
  name,
  control,
  editMode = true,
  defaultCompatbility,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <TableOrderMaterials
          value={value}
          onChange={onChange}
          editMode={editMode}
          defaultCompatbility={defaultCompatbility}
        />
      )}
    />
  );
};

export default TableOrderMaterialsForm;
