import { TestBed } from '@angular/core/testing';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update and emit new search term', (done) => {
    const testTerm = 'laptop';
    service.setSearchTerm(testTerm);

    service.getSearchTerm().subscribe(value => {
      expect(value).toBe(testTerm);
      done(); // ✅ completes async test
    });
  });
});
