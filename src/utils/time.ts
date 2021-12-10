const REGEX = {
  distanceSecond: new RegExp(/(\d+)(?=\s*giây trước)/gi),
  distanceMinute: new RegExp(/(\d+)(?=\s*phút trước)/gi),
  distanceDate: new RegExp(/(\d+)(?=\s*ngày trước)/gi),
  distanceHour: new RegExp(/(\d+)(?=\s*giờ trước)/gi),
  relateveDate: new RegExp(/(\d+)[/](\d+)[/](\d+)/),
  relativeTime: new RegExp(/(\d+):(\d+) (\d+)[/](\d+)/),
};

export function distance2Date(distance: string) {
  try {
    // 10 ngày trước
    const daysAgo = distance.match(REGEX.distanceDate)?.shift();
    if (daysAgo) {
      const date = new Date();
      date.setDate(date.getDate() - Number.parseInt(daysAgo, 0));
      return date;
    }

    const secondsAgo = distance.match(REGEX.distanceDate)?.shift();
    if (secondsAgo) {
      const date = new Date();
      date.setDate(date.getDate() - Number.parseInt(secondsAgo, 0));
      return date;
    }

    const minutesAgo = distance.match(REGEX.distanceMinute)?.shift();
    if (minutesAgo) {
      const date = new Date();
      date.setDate(date.getMinutes() - Number.parseInt(minutesAgo, 0));
      return date;
    }

    const hoursAgo = distance.match(REGEX.distanceHour)?.shift();
    if (hoursAgo) {
      const date = new Date();
      date.setDate(date.getHours() - Number.parseInt(hoursAgo, 0));
      return date;
    }

    // 04/02/18
    const dateInfo = distance.match(REGEX.relateveDate);
    if (dateInfo?.length === 4) {
      const tmp = Number.parseInt(dateInfo[3] || "0", 0);
      const year = tmp > 2000 ? tmp : tmp + 2000;
      const month = Number.parseInt(dateInfo[2] || "0", 0);
      const date = Number.parseInt(dateInfo[1] || "0", 0);
      return new Date(year, month - 1, date);
    }

    // 17:57 25/10
    const timeInfo = distance.match(REGEX.relativeTime);
    if (timeInfo?.length === 5) {
      const month = Number.parseInt(timeInfo[4] || "0", 0);
      const date = Number.parseInt(timeInfo[3] || "0", 0);
      const minute = Number.parseInt(timeInfo[2] || "0", 0);
      const hour = Number.parseInt(timeInfo[1] || "0", 0);
      return new Date(new Date().getFullYear(), month - 1, date, hour, minute);
    }

    return null;
  } catch (error) {
    console.log(error);
  }
}

// console.log(distance2Date());
// console.log(distance2Date("17:57 25/10"));
