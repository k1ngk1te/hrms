type ResultType = Date | string;

export const getDate = (dateString?: string, str = false): ResultType => {
  if (dateString) {
    const date = new Date(dateString);
    return str ? date.toLocaleDateString("en-CA") : date;
  } else {
    const c = new Date();
    const date = new Date(c.getFullYear(), c.getMonth(), c.getDate());
    return str ? date.toLocaleDateString("en-CA") : date;
  }
};

export const getDateString = (
  _date?: Date,
  _type?: "date" | "day" | "month" | "year"
) => {
  const date = _date || new Date();
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  switch (_type) {
    case "date":
      return date.getDate();
    case "day":
      return days[date.getDay()];
    case "month":
      return months[date.getMonth()];
    case "year":
      return date.getFullYear();
    default:
      return days[date.getDay()];
  }
  return days[date.getDay()];
};

export const getNextDate = (
  date: Date | string,
  nod = 1,
  str = false
): ResultType => {
  // nod => no_of_days
  const number_of_days = nod * 24 * 60 * 60 * 1000;
  const dateTime =
    typeof date === "string" ? new Date(date).getTime() : date.getTime();

  const nd = new Date(number_of_days + dateTime);
  return str ? nd.toLocaleDateString("en-CA") : nd;
};

export const fixZeroDigit = (digit: number): string => digit < 0 ? "00" : digit < 10 ? `0${digit}` : String(digit)

export const getTime = (time: string): string => {
	const timeSplit = time.split(":")
	let suffix = "AM"
	let hour = timeSplit[0] ? parseInt(timeSplit[0]) : 0
	const minute = timeSplit[0] ? parseInt(timeSplit[1]) : 0

	if (hour > 12) {
		hour = hour - 12;
		suffix = "PM"
	} else if (hour === 0) {
		hour = 12
		suffix = "AM"
	}

	return `${hour}:${fixZeroDigit(minute)} ${suffix}`
}

export default getDate;
