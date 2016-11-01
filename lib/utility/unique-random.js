// unique random
// return random numbers which is consecutively unique

module.exports = (min, max) => {
  let prev;
  const n = (max - min) + 1;
  return function random() {
    const rand = Math.floor((Math.random() * n) + min);
    return (rand === prev && min !== max) ? random() : (prev = rand);
  };
};
