import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes} from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
import { BooksComponent } from './books/books.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatPaginatorModule,
  MatInputModule, MatSelectModule, MatDividerModule } from '@angular/material';

const routes: Routes = [
  {
    path: 'books',
    component : BooksComponent,
    children: [{
        path: ':id', component: BookDetailComponent
    }]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule,
    MatInputModule,
    MatSelectModule,
    RouterModule.forChild(routes),
  ],
  declarations: [BookListComponent, BooksComponent, BookDetailComponent]
})
export class BooksModule { }
