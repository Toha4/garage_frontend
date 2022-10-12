import React from "react";
import { Input } from "antd";

type Scale = "d" | "h" | "m";

interface IInputTimeDuration {
  value?: number;
  scale: Scale;
  onChange?: (value: number | null) => void;
  refInput?: any;
  onUpdateValue?: () => void;
  width?: number;
  placeholder?: string;
}

const InputTimeDuration: React.FC<IInputTimeDuration> = ({
  value = 0,
  scale,
  onChange,
  refInput,
  onUpdateValue,
  width,
  placeholder
}) => {
  const [duration, setDuration] = React.useState<string>(convertFromValue(value, scale));

  React.useEffect(() => {
    const newDuration = convertFromValue(value, scale);
    if (newDuration !== duration) setDuration(newDuration);
  }, [value, scale]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDuration(e.target.value);
  };

  const handleUpdateValue = () => {
    const newValue = convertToValue(duration, scale);
    if (!isNaN(newValue) && onChange) onChange(newValue === 0 ? null : newValue);
    if (onUpdateValue) onUpdateValue();
  };

  return (
    <Input
      ref={refInput}
      value={duration}
      onChange={onInputChange}
      onPressEnter={handleUpdateValue}
      onBlur={handleUpdateValue}
      style={{ width: width ? `${width}px` : "none" }}
      placeholder={placeholder}
    />
  );
};

export const SCALE_CONVERSIONS = {
  m: 1,
  h: 60,
  d: 480,
};

export const convertValueFromScale = (value: number, scale: Scale) => {
  return value * (SCALE_CONVERSIONS[scale] || 1);
};

export const convertValueToScale = (value: number, scale: Scale) => {
  return value / (SCALE_CONVERSIONS[scale] || 1);
};

export const convertValueToDuration = (value: number | null) => {
  if (value === null) return "";
  const minutes = Math.floor(value % 60);
  const hours = Math.floor((value / 60) % 8);
  const days = Math.floor(value / 480);
  return [days && `${days}д`, hours && `${hours}ч`, minutes && `${minutes}м`].filter((x) => !!x).join(" ");
};

export const convertDurationToValue = (duration: string) => {
  const matches = duration
    .trim()
    .match(
      /^(\d+\s?(?:д|д\.|дн|дн\.|день|дня|дней))?\s*(\d+\s?(?:ч|ч\.|час|часа|часов))?\s*(\d+\s?(?:м|м\.|мин|мин\.|минут|минуты))?$/i
    );

  if (!matches) return parseFloat(duration) * 60;
  const [days, hours, minutes] = matches.slice(1).map((x) => parseInt(x) || 0);
  return (days * 8 + hours) * 60 + minutes;
};

export const convertFromValue = (value: number, scale: Scale) =>
  convertValueToDuration(convertValueFromScale(value, scale));

export const convertToValue = (duration: string, scale: Scale) =>
  convertValueToScale(convertDurationToValue(duration), scale);

export default InputTimeDuration;
