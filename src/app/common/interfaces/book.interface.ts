import { Author } from './author.interface';
import { Publisher } from './publisher.interface';
import { Genre } from './genre.interface';

export interface Book {
  id: number;
  title: string;
  authors: Author[];
  publisher: Publisher;
  genres: Genre[];
}
