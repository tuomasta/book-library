import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PreloadAllModules } from '@angular/router/';

export const routes: Routes = [
    { path: 'authors', loadChildren: 'app/authors/authors.module#AuthorsModule'},
    { path: '**', pathMatch: 'full', redirectTo: 'books'}
];
export const appRoutingProviders: any[] = [];

@NgModule({
    imports: [
      RouterModule.forRoot(routes, {
        preloadingStrategy: PreloadAllModules // using preload for all modules
      }),
    ],
    exports: [RouterModule]
  })
export class RoutingModule { }
