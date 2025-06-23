import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ArtistsWebservice } from './artists-webservice';
import { Artist } from '../models/artist';
import { environment } from '../../environments/environment';

describe('ArtistsWebservice', () => {
  let service: ArtistsWebservice;
  let httpMock: HttpTestingController;

  const mockArtists: Artist[] = [
    {
      id: "134286cbe0fbcc8d6e229b40ea18c0cf",
      name: "Justice",
      photo: "https://toutelaculture.com/wp-content/uploads/2012/01/20090212171201_justice4-400x400.jpg"
    },
    {
      id: "aa6e4335aa3488cd6ef33a723566985a",
      name: "Deadmau5",
      photo: "https://images.sk-static.com/images/media/profile_images/artists/244669/huge_avatar"
    },
    {
      id: "e892cbb57f08db5b5c6f0edaccb98fca",
      name: "Savant",
      photo: "https://mir-s3-cdn-cf.behance.net/project_modules/disp/01790311196803.560f3873b675e.jpg"
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ArtistsWebservice]
    });
    service = TestBed.inject(ArtistsWebservice);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch artists', () => {
    service.getArtists().subscribe(artists => {
      expect(artists).toEqual(mockArtists);
      expect(artists.length).toBe(3);
    });

    const req = httpMock.expectOne('https://artists-api-ndhd.onrender.com/artists');
    expect(req.request.method).toBe('GET');
    req.flush(mockArtists);
  });

  it('should create an artist', () => {
    const newArtistData = { 
      name: 'Test Artist', 
      photo: 'https://example.com/test.jpg' 
    };
    const newArtist: Artist = { 
      id: 'new-id-123', 
      ...newArtistData 
    };

    service.createArtist(newArtistData).subscribe(artist => {
      expect(artist).toEqual(newArtist);
    });

    const req = httpMock.expectOne('https://artists-api-ndhd.onrender.com/artists');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newArtistData);
    req.flush(newArtist);
  });

  it('should delete an artist', () => {
    const artistId = '134286cbe0fbcc8d6e229b40ea18c0cf';

    service.deleteArtist(artistId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`https://artists-api-ndhd.onrender.com/artists/${artistId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get a single artist', () => {
    const artistId = '134286cbe0fbcc8d6e229b40ea18c0cf';
    const expectedArtist = mockArtists[0];

    service.getArtist(artistId).subscribe(artist => {
      expect(artist).toEqual(expectedArtist);
    });

    const req = httpMock.expectOne(`https://artists-api-ndhd.onrender.com/artists/${artistId}`);
    expect(req.request.method).toBe('GET');
    req.flush(expectedArtist);
  });

  it('should update an artist', () => {
    const artistId = '134286cbe0fbcc8d6e229b40ea18c0cf';
    const updateData = { name: 'Updated Name' };
    const updatedArtist = { ...mockArtists[0], ...updateData };

    service.updateArtist(artistId, updateData).subscribe(artist => {
      expect(artist).toEqual(updatedArtist);
    });

    const req = httpMock.expectOne(`https://artists-api-ndhd.onrender.com/artists/${artistId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);
    req.flush(updatedArtist);
  });
});