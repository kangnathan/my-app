import { format } from 'date-fns';

export function formatDateTime(dateTime) {
  const formattedDate = format(dateTime, 'MM/dd/yyyy');
  const formattedTime = format(dateTime, 'hh:mm a');
  return `${formattedDate} ${formattedTime}`;
}
