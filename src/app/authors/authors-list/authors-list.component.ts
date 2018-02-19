import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Book } from '../../shared/book';
import { BookService } from '../../core/services/books.service';
import { Author } from '../../shared/author';
import { AuthorsService } from '../../core/services/authors.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-authors-list',
  templateUrl: './authors-list.component.html',
  styleUrls: ['./authors-list.component.css']
})
export class AuthorsListComponent implements OnInit {
  public authors$: Observable<Author[]>;
  public searchText: string;
  public pageNumber = 1;
  public pages;

  private pageChanged = new BehaviorSubject<number>(this.pageNumber);
  private searchChanged = new BehaviorSubject<string>('');

  constructor(private authorService: AuthorsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.authors$ = this.searchChanged
                  .debounceTime(50)
                  .distinctUntilChanged()
                  .combineLatest(this.pageChanged, (search, page) => ({ page: page, search: search }))
                  .combineLatest(this.route.url, (change, url) => change)
                  .switchMap(change => this.authorService.getAuthors({ pageNumber: change.page, itemsPerPage: 3}, change.search))
                  .map(result => {
                    this.pages = result.numberOfItems;
                    return result.data;
                  });
  }

  removeAuthor(author: Author, event: any): void {
    event.stopPropagation();
    this.authorService.deleteAuthor(author.id).subscribe(_ => {
      // if removed author is the selected author then go back to author list
      const currentId = this.route.snapshot.firstChild && +this.route.snapshot.firstChild.paramMap.get('id');
      if (author.id === currentId) { this.router.navigate(['/authors']); }

      // trigger new query by resetting the page number
      this.pageChanged.next(this.pageNumber);
    });
  }

  trackAuthors(index: number, author: Author): number {
    return author.id;
  }

  changePage(page: number): void {
    this.pageNumber = page;
    this.pageChanged.next(page);
  }

  searchAuthor(search: string): void {
    this.searchText = search;
    this.searchChanged.next(search);
  }
}
