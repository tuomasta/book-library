import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Author } from '../../shared/author';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AuthorsService {
    readonly authors = 'authors';

    constructor(private httpClient: HttpClient) { }

    getAuthors() {
        return this.httpClient.get<Author[]>(`app/${this.authors}`);
    }

    getAuthor(id: number) {
        return this.httpClient.get<Author>(`app/${this.authors}/${id}`);
    }

    deleteAuthor(id: number) {
        return this.httpClient.delete<Author>(`app/${this.authors}/${id}`);
    }

    updateAuthor(book: Author) {
        return this.httpClient.put<Author>(`app/${this.authors}`, book, httpOptions);
    }
}
