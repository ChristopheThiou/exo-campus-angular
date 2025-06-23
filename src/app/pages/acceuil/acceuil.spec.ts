import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Acceuil } from './acceuil';

describe('Acceuil', () => {
  let component: Acceuil;
  let fixture: ComponentFixture<Acceuil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Acceuil]
    }).compileComponents();

    fixture = TestBed.createComponent(Acceuil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with showParagraph as false', () => {
    expect(component.showParagraph).toBe(false);
  });

  it('should toggle paragraph visibility', () => {
    expect(component.showParagraph).toBe(false);
    
    component.toggleParagraph();
    expect(component.showParagraph).toBe(true);
    
    component.toggleParagraph();
    expect(component.showParagraph).toBe(false);
  });

  it('should display main title', () => {
    const compiled = fixture.nativeElement;
    const title = compiled.querySelector('h1');
    
    expect(title.textContent).toContain('Music Hub');
  });

  it('should display subtitle', () => {
    const compiled = fixture.nativeElement;
    const subtitle = compiled.querySelector('.hero-text p');
    
    expect(subtitle.textContent).toContain('Découvrez l\'univers infini de la musique');
  });

  it('should display hero image', () => {
    const compiled = fixture.nativeElement;
    const image = compiled.querySelector('.hero-image');
    
    expect(image).toBeTruthy();
    expect(image.src).toContain('assets/images/businessman-5791566_1280.jpg');
    expect(image.alt).toBe('Music');
  });

  it('should display explore button with correct text', () => {
    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('.explore-btn');
    
    expect(button.textContent.trim()).toBe('Explorer');
  });

  it('should change button text when paragraph is shown', () => {
    component.showParagraph = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('.explore-btn');
    
    expect(button.textContent.trim()).toBe('Réduire');
  });

  it('should show info card when showParagraph is true', () => {
    component.showParagraph = false;
    fixture.detectChanges();
    
    let infoCard = fixture.nativeElement.querySelector('.info-card');
    expect(infoCard).toBeFalsy();
    
    component.showParagraph = true;
    fixture.detectChanges();
    
    infoCard = fixture.nativeElement.querySelector('.info-card');
    expect(infoCard).toBeTruthy();
  });

  it('should call toggleParagraph when button is clicked', () => {
    spyOn(component, 'toggleParagraph');
    
    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('.explore-btn');
    button.click();
    
    expect(component.toggleParagraph).toHaveBeenCalled();
  });

  it('should display info card content when visible', () => {
    component.showParagraph = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const infoCard = compiled.querySelector('.info-card');
    
    expect(infoCard.querySelector('h3').textContent).toContain('Une expérience musicale immersive');
    expect(infoCard.querySelector('p').textContent).toContain('Découvrez une collection exceptionnelle');
  });
});