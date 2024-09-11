const winningComp = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,4,8],
  [6,4,2],
  [0,3,6],
  [1,4,7],
  [2,5,8]
]

export const checkWinning = (grid) => {
  var ans = false;
  winningComp.forEach((comp) => {
    if (grid[comp[0]] == grid[comp[1]] && grid[comp[0]] == grid[comp[2]] && grid[comp[0]] != '') ans = true;
  });
  return ans;
};