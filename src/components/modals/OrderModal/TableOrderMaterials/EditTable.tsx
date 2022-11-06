import React from "react";
import { Form, FormInstance } from "antd";
import { TurnoverNestedOrderType, WarehouseType } from "../../../../services/types";
import InputNumberUnit from "../../../common/InputNumberUnit";

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
  dataIndex: keyof TurnoverNestedOrderType;
  record: TurnoverNestedOrderType;
  warehouses: WarehouseType[];
  handleChange: (record: TurnoverNestedOrderType) => void;
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
              max={record.max_quantity}
              onUpdateValue={change}
            />
          </Form.Item>
        );
        break;
      }
    }
  }

  return <td {...restProps}>{childNode}</td>;
};
