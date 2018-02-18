import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { CommonModule } from '@angular/common';
import { MatListModule, MatIconModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BookService } from './services/books.service';
import { AuthorsService } from './services/authors.service';

@NgModule({
    imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
    exports: [],
    declarations: [],
    providers: [BookService, AuthorsService],
})
export class CoreModule { }
