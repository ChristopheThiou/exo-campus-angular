import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Navbar } from './navbar';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'], {
      url: '/'
    });

    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display brand logo and name', () => {
    const compiled = fixture.nativeElement;
    
    expect(compiled.querySelector('.brand-icon').textContent).toContain('🎵');
    expect(compiled.querySelector('.nav-logo').textContent).toContain('Music Hub');
  });

  it('should navigate to home when navigateToHome is called', () => {
    component.navigateToHome();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to artists when navigateToArtists is called', () => {
    component.navigateToArtists();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/artists']);
  });

  it('should return true for active route', () => {
    Object.defineProperty(mockRouter, 'url', { value: '/', configurable: true });
    
    expect(component.isActive('/')).toBe(true);
    expect(component.isActive('/artists')).toBe(false);
  });

  it('should return false for inactive route', () => {
    Object.defineProperty(mockRouter, 'url', { value: '/artists', configurable: true });
    
    expect(component.isActive('/')).toBe(false);
    expect(component.isActive('/artists')).toBe(true);
  });

  it('should display navigation links', () => {
    const compiled = fixture.nativeElement;
    const navLinks = compiled.querySelectorAll('.nav-link');
    
    expect(navLinks.length).toBe(2);
    expect(navLinks[0].textContent).toContain('Accueil');
    expect(navLinks[1].textContent).toContain('Artistes');
  });

  it('should call navigate methods when nav buttons are clicked', () => {
    spyOn(component, 'navigateToHome');
    spyOn(component, 'navigateToArtists');
    
    const compiled = fixture.nativeElement;
    const navLinks = compiled.querySelectorAll('.nav-link');
    
    navLinks[0].click(); // Home button
    navLinks[1].click(); // Artists button
    
    expect(component.navigateToHome).toHaveBeenCalled();
    expect(component.navigateToArtists).toHaveBeenCalled();
  });
});