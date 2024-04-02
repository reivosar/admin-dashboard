export const formatDateTime = (date: Date | null, format: string): string => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  const replacements: { [key: string]: string } = {
    YYYY: dateObj.getFullYear().toString(),
    MM: (dateObj.getMonth() + 1).toString().padStart(2, "0"),
    DD: dateObj.getDate().toString().padStart(2, "0"),
    HH: dateObj.getHours().toString().padStart(2, "0"),
    mm: dateObj.getMinutes().toString().padStart(2, "0"),
    ss: dateObj.getSeconds().toString().padStart(2, "0"),
    SSS: dateObj.getMilliseconds().toString().padStart(3, "0"),
  };

  return format.replace(/YYYY|MM|DD|HH|mm|ss|SSS/g, (match) => {
    const key = match as keyof typeof replacements;
    return replacements[key];
  });
};
