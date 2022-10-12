import React from "react";
import { Input } from "antd";
import { Controller } from "react-hook-form";

const { TextArea } = Input;

interface ITextAreaForm {
  name: string;
  control: any;
  rows?: number;
}

const TextAreaForm: React.FC<ITextAreaForm> = ({ name, control, rows = 2 }) => {
  return <Controller name={name} control={control} render={({ field }) => <TextArea rows={rows} {...field} />} />;
};

export default TextAreaForm;
