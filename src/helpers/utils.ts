export function truncateStr(str: string, length: number) {
  if (str.length > length) {
    return str.substring(0, length) + "...";
  } else {
    return str;
  }
}

export function quantityFormatter(quantity: number, is_precision_point: boolean, unit: string) {
  return `${quantity.toFixed(is_precision_point ? 2 : 0)} ${unit}`;
}

export function hoursFormatter(value_minutes: number | null) {
  if (value_minutes === null) {
    return "";
  }

  const minutes = Math.floor(value_minutes % 60);
  const hours = Math.floor(value_minutes / 60);
  return [hours && `${hours}ч`, minutes && `${minutes}м`].filter((x) => !!x).join(" ");
}
