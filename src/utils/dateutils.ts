export const formatDateTime = (date: Date, format: string): string => {
  const replacements: { [key: string]: string } = {
    YYYY: date.getFullYear().toString(),
    MM: (date.getMonth() + 1).toString().padStart(2, "0"),
    DD: date.getDate().toString().padStart(2, "0"),
    HH: date.getHours().toString().padStart(2, "0"),
    mm: date.getMinutes().toString().padStart(2, "0"),
    ss: date.getSeconds().toString().padStart(2, "0"),
    SSS: date.getMilliseconds().toString().padStart(3, "0"),
  };

  return format.replace(/YYYY|MM|DD|HH|mm|ss|SSS/g, (match) => {
    const key = match as keyof typeof replacements;
    return replacements[key];
  });
};
