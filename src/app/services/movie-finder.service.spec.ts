import { TestBed } from '@angular/core/testing';

import { MovieFinderService } from './movie-finder.service';

describe('MovieFinderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MovieFinderService = TestBed.get(MovieFinderService);
    expect(service).toBeTruthy();
  });
});
