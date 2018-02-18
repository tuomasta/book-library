import { Book } from './book';

export interface BooksResult {
    data: Book[];
    numberOfItems: number;
}
