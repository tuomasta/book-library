import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Author, AuthorWithBooks } from '../../shared/author';
import { GetResult } from '../../shared/get-result';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';

import { BookService } from './books.service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AuthorsService {
    readonly authors = 'authors';

    constructor(private httpClient: HttpClient, private bookService: BookService) { }

    getAuthors(page?: {pageNumber: number, itemsPerPage: number}, search?: string): Observable<GetResult<Author>> {
        let params = new HttpParams();
        if (search) { params = params.set('name', search); }

        return this.httpClient.get<Author[]>(`app/${this.authors}`, { params: params })
        .map(authors => {
            // this should actually happen on a server
            const startIndex = page ? (page.pageNumber - 1) * page.itemsPerPage : 0;
            return {
                numberOfItems: authors.length,
                data: page ?
                    authors.slice(startIndex, Math.min(startIndex + page.itemsPerPage, authors.length)) :
                    authors
            };
        });
    }

    getAuthor(id: number): Observable<AuthorWithBooks> {
        return this.httpClient.get<Author>(`app/${this.authors}/${id}`)
            .switchMap(author => {
                 return this.bookService.getBooksByAuthorId(author.id).map(books => ({
                    ... author,
                    books: books
                 }));
            });
    }

    deleteAuthor(id: number): Observable<Author> {
        return this.httpClient
            .delete<Author>(`app/${this.authors}/${id}`)
            .switchMap(author => {
                return this.bookService.deleteBooksByAuthorId(id).map(_ => author);
            });
    }

    updateAuthor(book: Author) {
        return this.httpClient.put<Author>(`app/${this.authors}`, book, httpOptions);
    }
}
