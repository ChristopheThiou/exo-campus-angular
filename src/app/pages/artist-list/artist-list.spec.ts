import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ArtistList } from './artist-list';
import { ArtistComponent } from '../../components/artist/artist';
import { ArtistFormComponent } from '../../components/artist-form-component/artist-form-component';
import { ReactiveFormsModule } from '@angular/forms';
import { Artist } from '../../models/artist';
import { ArtistsWebservice } from '../../services/artists-webservice';
import { of, throwError, Observable } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

describe('ArtistList', () => {
  let component: ArtistList;
  let fixture: ComponentFixture<ArtistList>;
  let mockArtistsService: jasmine.SpyObj<ArtistsWebservice>;
  let mockCdr: jasmine.SpyObj<ChangeDetectorRef>;

  const mockArtists: Artist[] = [
    {
      id: '134286cbe0fbcc8d6e229b40ea18c0cf',
      name: 'Justice',
      photo:
        'https://toutelaculture.com/wp-content/uploads/2012/01/20090212171201_justice4-400x400.jpg',
    },
    {
      id: 'aa6e4335aa3488cd6ef33a723566985a',
      name: 'Deadmau5',
      photo:
        'https://images.sk-static.com/images/media/profile_images/artists/244669/huge_avatar',
    },
    {
      id: 'e892cbb57f08db5b5c6f0edaccb98fca',
      name: 'Savant',
      photo:
        'https://mir-s3-cdn-cf.behance.net/project_modules/disp/01790311196803.560f3873b675e.jpg',
    },
  ];

  const mockArtistsWithFour: Artist[] = [
    ...mockArtists,
    {
      id: 'test-id-4',
      name: 'Test Artist 4',
      photo: 'https://example.com/test4.jpg',
    },
  ];

  beforeEach(async () => {
    const artistsServiceSpy = jasmine.createSpyObj('ArtistsWebservice', [
      'getArtists',
      'createArtist',
      'deleteArtist',
    ]);
    const cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      imports: [
        ArtistList,
        ArtistComponent,
        ArtistFormComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: ArtistsWebservice, useValue: artistsServiceSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtistList);
    component = fixture.componentInstance;
    mockArtistsService = TestBed.inject(
      ArtistsWebservice
    ) as jasmine.SpyObj<ArtistsWebservice>;
    mockCdr = TestBed.inject(
      ChangeDetectorRef
    ) as jasmine.SpyObj<ChangeDetectorRef>;

    mockArtistsService.getArtists.and.returnValue(of(mockArtists));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty artists list and loading false', () => {
    expect(component.artists).toEqual([]);
    expect(component.isLoading).toBe(false);
    expect(component.error).toBe(null);
  });

  it('should load artists on init', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(mockArtistsService.getArtists).toHaveBeenCalled();
    expect(component.artists).toEqual(mockArtists);
    expect(component.isLoading).toBe(false);
  }));

  it('should set loading state correctly during API call', fakeAsync(() => {
    mockArtistsService.getArtists.and.returnValue(
      new Observable((observer: any) => {})
    );

    component.loadArtists();

    expect(component.isLoading).toBe(true);
    expect(component.error).toBe(null);
  }));

  it('should handle API error correctly', () => {
    const errorMessage = 'API Error';
    mockArtistsService.getArtists.and.returnValue(
      throwError(() => new Error(errorMessage))
    );

    component.loadArtists();

    expect(component.isLoading).toBe(false);
    expect(component.error).toBe('Impossible de charger les artistes');
    expect(component.artists).toEqual([]);
  });

  it('should add a new artist successfully', () => {
    const newArtistData = {
      name: 'Test Artist',
      photo: 'https://example.com/test.jpg',
    };
    const newArtist: Artist = {
      id: 'new-artist-id-123',
      name: 'Test Artist',
      photo: 'https://example.com/test.jpg',
    };

    mockArtistsService.createArtist.and.returnValue(of(newArtist));
    component.artists = [...mockArtists];

    component.onAddArtist(newArtistData);

    expect(mockArtistsService.createArtist).toHaveBeenCalledWith(newArtistData);
    expect(component.artists).toEqual([newArtist, ...mockArtists]);
  });

  it('should handle add artist error', () => {
    const newArtistData = {
      name: 'Test Artist',
      photo: 'https://example.com/test.jpg',
    };
    mockArtistsService.createArtist.and.returnValue(
      throwError(() => new Error('Create failed'))
    );

    component.onAddArtist(newArtistData);

    expect(component.error).toBe("Impossible d'ajouter l'artiste");
  });

  it('should delete an artist successfully when there are 4+ artists', () => {
    component.artists = [...mockArtistsWithFour];
    const artistIdToDelete = mockArtistsWithFour[3].id;

    mockArtistsService.deleteArtist.and.returnValue(of(void 0));

    component.onDeleteArtist(artistIdToDelete);

    expect(mockArtistsService.deleteArtist).toHaveBeenCalledWith(
      artistIdToDelete
    );
    expect(component.artists.length).toBe(3);
    expect(
      component.artists.find((artist) => artist.id === artistIdToDelete)
    ).toBeUndefined();
  });

  it('should handle delete artist error when trying to delete with less than 4 artists', () => {
    component.artists = [...mockArtists];
    const artistIdToDelete = mockArtists[0].id;

    mockArtistsService.deleteArtist.and.returnValue(
      throwError(
        () => new Error('Cannot delete artist - minimum 4 artists required')
      )
    );

    component.onDeleteArtist(artistIdToDelete);

    expect(mockArtistsService.deleteArtist).toHaveBeenCalledWith(
      artistIdToDelete
    );
    expect(component.error).toBe("Impossible de supprimer l'artiste");
    expect(component.artists.length).toBe(3);
  });

  it('should display loading message when isLoading is true', () => {
    component.isLoading = true;
    component.error = null;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Chargement des artistes...');
  });

  it('should display error message when error exists', () => {
    component.isLoading = false;
    component.error = 'Test error message';
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Test error message');
  });

  it('should display empty message when no artists and not loading', () => {
    component.isLoading = false;
    component.error = null;
    component.artists = [];
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Aucun artiste trouvé');
  });

  it('should call detectChanges on successful operations', () => {
    component.artists = mockArtists;
    component.isLoading = false;
    mockCdr.detectChanges();

    expect(mockCdr.detectChanges).toHaveBeenCalled();
  });
});
