import { Time } from './stats'

export const timeFrameToStart = (timeframe: string, previous: boolean = false) => {
  // determine the multiple (ie: previous)
  const multiple = previous ? 2 : 1;

  if (timeframe == Time.fifteen)
    return Math.floor((new Date().getTime() - (15 * 60 * 1000) * multiple) / 1000)

  if (timeframe == Time.hour)
    return Math.floor((new Date().getTime() - (60 * 60 * 1000) * multiple) / 1000)

  if (timeframe == Time.day)
    return Math.floor((new Date().getTime() - (24 * 60 * 60 * 1000) * multiple) / 1000)

  if (timeframe == Time.week)
    return Math.floor((new Date().getTime() - (24 * 7 * 60 * 60 * 1000) * multiple) / 1000)

  if (timeframe == Time.month)
    return Math.floor((new Date().getTime() - (24 * 30 * 60 * 60 * 1000) * multiple) / 1000)
}

export const timeFrameToGranularity = (timeframe: string) => {
  if (timeframe == Time.fifteen)
    return 'minute'

  if (timeframe == Time.hour)
    return '5minutes'

  if (timeframe == Time.day)
    return 'hour'

  if (timeframe == Time.week)
    return 'day'

  if (timeframe == Time.month)
    return 'day'
}

// generate a common timestamp display
export function timestampAsDisplay(timestamp: string): string {
  if (timestamp == undefined)
   return '';

  // init a date object
  const date = new Date(timestamp);

  // set the display options
  const optionsDate: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const optionsTime: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };

  // create the formatted dates
  const formattedDate = date.toLocaleDateString('en-US', optionsDate);
  const formattedTime = date.toLocaleTimeString('en-US', optionsTime).toUpperCase();

  // determine if we need a space
  const space = formattedTime.length == 7 ? ' ' : '';

  return `${formattedDate},${space} ${formattedTime}`;
}

// generate a common timestamp display
export function timestampAsDay(timestamp: string): string {
  if (timestamp == undefined)
    return '';

  // init a date object
  const date = new Date(timestamp);

  // set the display options
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  };

  // create the formatted date
  const formattedDate = date.toLocaleDateString('en-US', options);

  return formattedDate;
}

export function timestampsDuration(timestamp1: number, timestamp2: number) {
  // Calculate time difference in milliseconds
  const diff = Math.abs(timestamp1 - timestamp2);

  // Convert milliseconds to different time units
  const minute = 60 * 1000;
  const fiveMinute = 60 * 1000 * 5;
  const fifteenMinute = 60 * 1000 * 15;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day; // Approximation for a month

  if (diff < fiveMinute) return 'minute';
  if (diff < fifteenMinute) return '5minute';
  if (diff < hour)  return '15minute';
  if (diff < day)   return 'hour';
  if (diff < week)  return 'day';
  if (diff < month) return 'week';

  return 'month';
}
