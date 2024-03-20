/**
 * Takes a Date object and a format string, then returns a formatted date-time string.
 *
 * @param {Date} date - The Date object to format.
 * @param {string} format - The format string (e.g., 'YYYY-MM-DD HH:mm:ss.SSS', 'YYYY/MM/DD HH:mm').
 * @returns {string} The formatted date-time string.
 */
export const formatDateTime = (date: Date, format: string): string => {
  const replacements = {
    YYYY: date.getFullYear().toString(),
    MM: (date.getMonth() + 1).toString().padStart(2, "0"),
    DD: date.getDate().toString().padStart(2, "0"),
    HH: date.getHours().toString().padStart(2, "0"),
    mm: date.getMinutes().toString().padStart(2, "0"),
    ss: date.getSeconds().toString().padStart(2, "0"),
    SSS: date.getMilliseconds().toString().padStart(3, "0"),
  };

  return format.replace(
    /YYYY|MM|DD|HH|mm|ss|SSS/g,
    (match) => replacements[match]
  );
};
