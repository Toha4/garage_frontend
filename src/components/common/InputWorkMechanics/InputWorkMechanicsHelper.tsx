import React from "react";
import { Space, Typography } from "antd";

const { Text } = Typography;

const InputWorkMechanicsHelper = () => {
  return (
    <Space direction="vertical" size={2}>
      <Text>Можно выбрать несколько работников выполняющих одну работу.</Text>
      <Text>Поле "Затраченное время" по каждому работнику не обязательное,</Text>
      <Text>если оно не заполненно, то затраченное время работника</Text>
      <Text>будет считаться общее затраченное время на работу.</Text>
      <Text>Затраченное время работника не должно превышать</Text>
      <Text>общее затраченное время на работу.</Text>
    </Space>
  );
};

export default InputWorkMechanicsHelper;
