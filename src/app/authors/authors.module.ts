import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorsListComponent } from './authors-list/authors-list.component';
import { Routes, RouterModule } from '@angular/router/';

const routes: Routes = [{
  path: '', component: AuthorsListComponent
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)

  ],
  declarations: [AuthorsListComponent]
})
export class AuthorsModule { }
