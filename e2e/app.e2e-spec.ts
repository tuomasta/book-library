import { AppPage } from './app.po';

describe('zylab-interview-web-task App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page).toBeTruthy();
  });
});
