import React from "react";
import { Space, Typography } from "antd";

const { Text } = Typography;

const InputTimeDuratiomHelper = () => {
  return (
    <Space direction="vertical" size={2}>
      <Text strong>{"Формат ввода: <число>д <число>ч <число>м"}</Text>
      <Text>Где: д - дни; ч - часы; м - минуты.</Text>
      <Text>Например: "1д 4ч 30м", "6ч 30м", "2ч", "45м"</Text>
      <Text>Если в ввод ввести только число, то оно будет </Text>
      <Text>преобразовано в часы, например: "5" - "5ч".</Text>
      <Text strong>1 час = 60 минут</Text>
      <Text strong>1 день = 8 часов</Text>
    </Space>
  );
};

export default InputTimeDuratiomHelper;
