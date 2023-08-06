export const settings = {
  speakersLimit: 4,
  historyLimit: 80,
  subtitleTextLimit: 2000,
  scaleMin: 1,
  scaleWidthMin: 100,
  scaleWidthMax: 160,
  rateLimit: parseFloat(process.env.REACT_APP_RATE_LIMIT),
};
