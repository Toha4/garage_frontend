export function truncateStr(str: string, length: number) {
  if (str.length > length) {
    return str.substring(0, length) + "...";
  } else {
    return str;
  }
}
