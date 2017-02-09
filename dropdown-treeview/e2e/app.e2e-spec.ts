import { DropdownTreeviewPage } from './app.po';

describe('dropdown-treeview App', function() {
  let page: DropdownTreeviewPage;

  beforeEach(() => {
    page = new DropdownTreeviewPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
