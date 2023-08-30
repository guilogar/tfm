const randomNumber = (min = 0, max = 100) => {
  return Math.random() * (max - min) + min;
};

const randomNumberFixed = (min = 0, max = 100, fixDecimals = 2) => {
  return parseFloat(randomNumber(min, max).toFixed(fixDecimals));
};

module.exports = {
  randomNumber,
  randomNumberFixed,
};
