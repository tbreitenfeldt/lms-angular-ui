export interface Author {
  id: number;
  name: string;
}

export const newAuthor = ({ id = 0, name = '' } = {}): Author => ({
  id,
  name,
});
