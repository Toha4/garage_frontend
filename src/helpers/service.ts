export const getSearchParams = (params: any) => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (params.hasOwnProperty(key) && value) {
      if (value instanceof Array) {
        if (value.length > 0) searchParams.set(key, value.join(","));
      } else {
        searchParams.set(key, `${value}`);
      }
    }
  }

  let result = searchParams.toString();
  if (result.length > 0) {
    result = `?${result}`;
  }
  return result;
};

export const getFormData = (params: any) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(params)) {
    if (params.hasOwnProperty(key) && value) {
      formData.append(key, `${value}`);
    }
  }

  return formData;
};

export const toJson = (key: string, value: any) => {
  if (value || value == null || typeof value == "boolean" || typeof value == "string" || typeof value == "number")
    return value;
};
