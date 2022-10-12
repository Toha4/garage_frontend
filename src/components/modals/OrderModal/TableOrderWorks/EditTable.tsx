import React from "react";
import type { InputRef } from "antd";
import { Form, FormInstance, InputNumber, Input } from "antd";
import { OrderWorkType } from "../../../../services/types";
import InputTimeDuration from "../../../common/InputTimeDuration";
import InputWorkMechanics from "../../../common/InputWorkMechanics";

const { TextArea } = Input;

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
  dataIndex: keyof OrderWorkType;
  record: OrderWorkType;
  dateRequest?: moment.Moment;
  handleChange: (record: OrderWorkType) => void;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleChange,
  dateRequest,
  ...restProps
}) => {
  const [editing, setEditing] = React.useState(false);
  const inputRef = React.useRef<InputRef>(null);
  const form = React.useContext(EditableContext)!;

  React.useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    setEditing(!editing);
  };

  const change = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleChange({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    if (dataIndex === "quantity" && editing) {
      childNode = (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <InputNumber
            ref={inputRef as any}
            size="small"
            style={{ width: "65px" }}
            min={1}
            onPressEnter={change}
            onBlur={change}
          />
        </Form.Item>
      );
    } else if (dataIndex === "mechanics" && editing) {
      childNode = (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[
            {
              message: "Затраченное время работника не должно превышать общее затраченное время",
              validator: (_, value) => {
                for (let mechanic of value) {
                  if (mechanic.time_minutes && record.time_minutes && mechanic.time_minutes > record.time_minutes) {
                    return Promise.reject();
                  }
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputWorkMechanics refInput={inputRef} onUpdateValue={change} dateRequest={dateRequest} />
        </Form.Item>
      );
    } else if (dataIndex === "time_minutes" && editing) {
      childNode = (
        <Form.Item style={{ margin: 0 }} name={dataIndex}>
          <InputTimeDuration scale="m" refInput={inputRef} onUpdateValue={change} />
        </Form.Item>
      );
    } else if (dataIndex === "note" && editing) {
      childNode = (
        <Form.Item style={{ margin: 0 }} name={dataIndex}>
          <TextArea ref={inputRef} onPressEnter={change} onBlur={change} />
        </Form.Item>
      );
    } else {
      childNode = (
        <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
          {children}
        </div>
      );
    }
  }

  return <td {...restProps}>{childNode}</td>;
};
