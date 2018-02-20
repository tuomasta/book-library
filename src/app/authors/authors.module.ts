import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorsListComponent } from './authors-list/authors-list.component';
import { Routes, RouterModule } from '@angular/router/';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthorsComponent } from './authors/authors.component';
import { AuthorDetailsComponent } from './author-details/author-details.component';
import {
  MatPaginatorModule,
  MatDividerModule, MatButtonModule, MatIconModule, MatCardModule, MatInputModule, MatSelectModule } from '@angular/material';

const routes: Routes = [{
  path: '', component: AuthorsComponent,
  children: [{
    path: ':id', component: AuthorDetailsComponent
  }]
}];

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
    RouterModule.forChild(routes)
  ],
  declarations: [AuthorsListComponent, AuthorsComponent, AuthorDetailsComponent]
})
export class AuthorsModule { }
