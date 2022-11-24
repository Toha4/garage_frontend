import React from "react";
import { Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { OrderWorkMechanics } from "../../../services/types";
import InputTimeDuration from "../InputTimeDuration";
import SelectMechanic from "./SelectMechanic";

interface IInputWorkMechanics {
  refInput?: any;
  value?: OrderWorkMechanics[] | null;
  onChange?: (value: OrderWorkMechanics[]) => void;
  onUpdateValue?: () => void;
  dateRequest?: moment.Moment;
}

const InputWorkMechanics: React.FC<IInputWorkMechanics> = ({
  refInput,
  value,
  onChange,
  onUpdateValue,
  dateRequest,
}) => {
  const handleBlur = (e: any) => {
    const currentTarget = e.currentTarget;
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        if (onUpdateValue) onUpdateValue();
      }
    }, 0);
  };

  const handleChangeTimeDuration = (time: number | null, index: number) => {
    if (onChange && value && index != undefined) {
      const newValue = [...value];
      newValue[index].time_minutes = time;
      onChange(newValue);
    }
  };

  const handleAddMechanic = (mechanic: OrderWorkMechanics) => {
    if (onChange) {
      const newValue = value ? [...value, mechanic] : [mechanic];
      onChange(newValue);
    }
  };

  const handleRemoveMechanic = (index: number) => {
    if (onChange && value && index != undefined) {
      const newValue = [...value];
      newValue.splice(index, 1);
      onChange(newValue);

      if (refInput.current) {
        refInput.current!.focus();
      }
    }
  };

  const excludeMechanicsKeys: number[] = value ? value.map((mechanic) => mechanic.mechanic) : [];

  return (
    <div ref={refInput} tabIndex={1} onBlur={handleBlur}>
      {value?.map((mechanic, index) => (
        <div className="mechanic-row-edit" key={index}>
          <div className="mechanic-name-edit">
            <Button className="action-button" type="link" onClick={() => handleRemoveMechanic(index)}>
              <CloseOutlined />
            </Button>
            <span>{mechanic.mechanic_short_fio}</span>
          </div>
          <span style={{ marginLeft: "auto" }}>
            <InputTimeDuration
              width={85}
              scale="m"
              value={mechanic.time_minutes || undefined}
              onChange={(value) => handleChangeTimeDuration(value, index)}
              placeholder="Затрачено времени"
            />
          </span>
        </div>
      ))}

      <SelectMechanic dateRequest={dateRequest} onSelect={handleAddMechanic} excludeMechanics={excludeMechanicsKeys} />
    </div>
  );
};

export default InputWorkMechanics;
