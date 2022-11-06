import React from "react";
import { Form, FormInstance } from "antd";
import { TurnoverNestedType, WarehouseType } from "../../../../services/types";
import InputNumberUnit from "../../../common/InputNumberUnit";
import SelectWarehouse from "./SelectWarehouse";
import InputPrice from "../../../common/InputPrice";

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
  index: number;
}

export const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof TurnoverNestedType;
  record: TurnoverNestedType;
  warehouses: WarehouseType[];
  handleChange: (record: TurnoverNestedType) => void;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleChange,
  warehouses,
  ...restProps
}) => {
  const form = React.useContext(EditableContext)!;

  React.useEffect(() => {
    if (editable) {
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    }
  }, []);

  const change = async () => {
    try {
      const values = await form.validateFields();
      handleChange({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    switch (dataIndex) {
      case "quantity": {
        childNode = (
          <Form.Item style={{ margin: 0 }} name={dataIndex}>
            <InputNumberUnit
              style={{ width: "110px" }}
              required
              precision={record.material_unit_is_precision_point ? 2 : 0}
              unit={record.material_unit_name}
              onUpdateValue={change}
            />
          </Form.Item>
        );
        break;
      }
      case "warehouse": {
        childNode = (
          <Form.Item style={{ margin: 0 }} name={dataIndex}>
            <SelectWarehouse required warehouses={warehouses} onUpdateValue={change} />
          </Form.Item>
        );
        break;
      }
      case "price": {
        childNode = (
          <Form.Item style={{ margin: 0 }} name={dataIndex}>
            <InputPrice required onUpdateValue={change} />
          </Form.Item>
        );
        break;
      }
    }
  }

  return <td {...restProps}>{childNode}</td>;
};
