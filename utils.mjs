import dayjs from "dayjs";

const TOT_LETTERS = 26;
const START_CODE = 65;

const letters = [...Array(TOT_LETTERS)].map((_, idx) => {
  return String.fromCharCode(idx + START_CODE);
});

export const generateDistributerMap = (size = 5) => {
  if (size > TOT_LETTERS || size < 1) {
    throw new Error("invalid size");
  }
  return letters.reduce((buckets, letter, idx) => {
    buckets[letter] = idx % size;
    return buckets;
  }, {});
};

export const generateRvolWorkerStorage = (totalWorkers) => {
  const total = [...new Array(totalWorkers)].map((_, idx) => idx);
  return total.reduce((acc, id) => {
    acc[id] = {
      currentVolume: new Map(),
      prevDayVolume: new Map(),
    };

    return acc;
  }, {});
};

export const generateWorkerStorage = (totalWorkers) => {
  const total = [...new Array(totalWorkers)].map((_, idx) => idx);
  return total.reduce((acc, id) => {
    acc[id] = {
      pendingDaily5: new Set(),
      pendingDaily21: new Set(),
      pendingHour5: new Set(),
      pendingHour21: new Set(),
    };

    return acc;
  }, {});
};

export const normalizeCandle = (candle) => {
  return {
    open: candle.o,
    close: candle.c,
    high: candle.h,
    low: candle.l,
    aveVolWeightedPrice: candle.vw,
    time: candle.s,
    symbol: candle.sym,
    volume: candle.av,
  };
};

export const sortByVolume = (a, b) => {
  const ag = Number.parseFloat(a.volume);
  const bg = Number.parseFloat(b.volume);
  if (ag > bg) {
    return -1;
  } else if (ag < bg) {
    return 1;
  }
  return 0;
};

export const getPrevTradingDay = () => {
  const today = dayjs();
  const dayOfWeek = today.day();
  if (dayOfWeek === 1) {
    return today.subtract(3, "day");
  }
  return today.subtract(1, "day");
};
