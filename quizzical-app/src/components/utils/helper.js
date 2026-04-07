export function shuffleArr(arr) {
  for (let index = arr.length - 1; index > 0; index--) {
    let randomIndex = Math.floor(Math.random() * (index + 1));
    [arr[index], arr[randomIndex]] = [arr[randomIndex], arr[index]];
  }
  return arr;
}
