export const parseYml = (yml: { children: any[]; }, i: number, tree: any[]) => {
  tree[i] = tree[i] ?? [];
  let j = 0;
  while (tree[i][j]) {
    j++;
  }
  tree[i][j] = yml;
  if (yml.children) {
    yml.children.forEach((data) => {
      parseYml(data, i + 1, tree);
    });
  }
};
