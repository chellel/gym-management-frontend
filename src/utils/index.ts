import * as dayjs from "dayjs";


export const checkIsExpired = (schedule) => {
  const now = dayjs.default();
  const classDateTime = dayjs.default(schedule.startTime);
  return now.isAfter(classDateTime);
};

export const checkIsFull = (schedule) => {
  return schedule.bookingCount >= schedule.maxCapacity;
};


// 检查当前用户是否已预约
export const isBooked = (schedule, bookings) => {
  return bookings.some(
    (booking) => booking.scheduleId === schedule.id && !booking.isDeleted
  );
};


export const allowBook = (schedule, bookings) => {
  return (
    !checkIsExpired(schedule) && !checkIsFull(schedule) && !isBooked(schedule, bookings)
  );
};
