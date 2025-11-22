let counter = 0;

export const getCounter = (req, res) => {
  res.json({ counter });
}

export const incrementCounter = (req, res) => {
  counter += 1;
  res.json({ counter });
}