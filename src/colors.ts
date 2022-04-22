import axios from "axios";

type Color = {
  code: string;
  likes: string;
  date: string;
  tags?: string;
};

const now = Date.now();

const millisecondsOf = (text: string) => {
  if (text === "Yesterday") {
    return 86400000;
  }

  const number = parseInt(text.split(" ")[0]); // 1, 2, 3 ...etc
  const word = text.split(" ")[1]; // weeks, week, days ...etc

  switch (word) {
    case "millisecond":
    case "milliseconds":
      return 1 * number; // ms of millisecond
    case "second":
    case "seconds":
      return 1000 * number; // ms of second
    case "minute":
    case "minutes":
      return 60000 * number; // ms of minute
    case "hour":
    case "hours":
      return 3600000 * number; // ms of hour
    case "day":
    case "days":
      return 86400000 * number; // ms of day
    case "week":
    case "weeks":
      return 604800000 * number; // ms of week
    case "month":
    case "months":
      return 2629800000 * number; // ms of month
    case "year":
    case "years":
      return 31556952000 * number; // ms of year
    default:
      return 31556952000 * 1; // 1 year
  }
};

const formatDate = (text: string) => {
  const ms = millisecondsOf(text);
  return new Date(now - ms).toString();
};

const fetchPage = async (step: number): Promise<Color[]> => {
  const { data } = await axios.post<Color[]>(
    "https://colorhunt.co/php/feed.php",
    `step=${step}&sort=new&tags=&timeframe=4000`,
    {
      headers: {
        accept: "text/html, */*; q=0.01",
        "accept-language": "en,ar;q=0.9",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        cookie:
          "_ga=GA1.2.649898212.1649879639; _gid=GA1.2.1192212843.1650533076; _gat=1",
        Referer: "https://colorhunt.co/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    }
  );

  return data;
};

const fetchColor = async (id: string): Promise<Color | null> => {
  try {
    const { data } = await axios.post<[Color]>(
      "https://colorhunt.co/php/single.php",
      `single=${id}`,
      {
        headers: {
          accept: "text/html, */*; q=0.01",
          "accept-language": "en,ar;q=0.9",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "sec-ch-ua":
            '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
          cookie:
            "_ga=GA1.2.649898212.1649879639; _gid=GA1.2.1192212843.1650533076; _gat=1",
          Referer: `https://colorhunt.co/palette/${id}`,
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
      }
    );

    // It returns array of one element.
    return data[0];
  } catch (error) {
    console.log("Error at ID: " + id);
    console.log(error);
    return null;
  }
};

const fetchAllColors = async (): Promise<Color[]> => {
  const steps = Array(100)
    .fill("")
    .map((_, i) => i); // Pages load on scroll.

  const _colors: Color[] = [];

  for (const step of steps) {
    const data = await fetchPage(step);

    if (data.length === 0) {
      break;
    }

    _colors.push(...data);
    console.log("Colors fetched: " + _colors.length);
  }

  const colors = _colors.map((color) => ({
    ...color,
    date: formatDate(color.date),
  }));

  return colors;
};

export const getColors = async () => {
  const colors = await fetchAllColors();
  const ids = colors.map((c) => c.code);

  let number = 1;

  for (const id of ids) {
    console.log(`Fetching individual color data: ${number}/${colors.length}`);
    number++;

    const color = await fetchColor(id);
    if (!color) {
      continue;
    }

    const foundIndex = colors.findIndex((c) => c.code == color.code);
    colors[foundIndex].tags = color.tags;
  }

  return colors;
};
