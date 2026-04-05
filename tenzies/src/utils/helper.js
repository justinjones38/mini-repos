export function getDiceValues() {
  const arr = [];
  for (let index = 0; index < 10; index++) {
    arr.push({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: index,
    });
  }
  return arr;
}
