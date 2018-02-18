import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";

import { AppComponent } from './app.component';
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { CoreModule } from "./core/core.module";
import { MatToolbarModule } from '@angular/material';
import { AppModule } from './app.module';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule]
    }).compileComponents();
  }));

  it('render', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('render app title', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('[data-test-app-title]').textContent).toContain('Welcome to our Library!');
  }));
});
