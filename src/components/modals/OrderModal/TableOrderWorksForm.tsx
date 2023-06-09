import React from "react";
import { Controller } from "react-hook-form";
import TableOrderWorks from "./TableOrderWorks";

interface ITableOrderWorksForm {
  name: string;
  control: any;
  editMode?: boolean;
  dateRequest?: moment.Moment;
}

const TableOrderWorksForm: React.FC<ITableOrderWorksForm> = ({ name, control, editMode = true, dateRequest }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <TableOrderWorks value={value} onChange={onChange} editMode={editMode} dateRequest={dateRequest} />
      )}
    />
  );
};

export default TableOrderWorksForm;
