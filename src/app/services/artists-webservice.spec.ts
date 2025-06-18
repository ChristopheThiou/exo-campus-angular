import { TestBed } from '@angular/core/testing';

import { ArtistsWebservice } from './artists-webservice';

describe('ArtistsWebservice', () => {
  let service: ArtistsWebservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtistsWebservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
