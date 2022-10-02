import React from "react";
import { Button } from "antd";

interface ITableOrderWorks {
  value: any;
  onChange: (...event: any[]) => void;
}

const TableOrderWorks: React.FC<ITableOrderWorks> = ({ value, onChange }) => {
  console.log(value);

  const handleAddWork = () => {
    console.log("Add works");
  };

  return (
    <>
      <Button type="primary" size="small" onClick={handleAddWork}>
        Добавить работу
      </Button>
    </>
  );
};

export default TableOrderWorks;
