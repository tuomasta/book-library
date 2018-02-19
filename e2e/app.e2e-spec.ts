import { AppPage } from './app.po';

describe('Book library App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page).toBeTruthy();
  });
});
