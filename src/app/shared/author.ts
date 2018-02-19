import { Book } from './book';

export interface Author {
    id: number;
    name: string;
    yearOfBirth: number;
}

export interface AuthorWithBooks extends Author {
    books: Book[];
}
