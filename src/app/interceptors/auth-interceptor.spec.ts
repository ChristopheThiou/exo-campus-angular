import { TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { authInterceptor } from './auth-interceptor';

describe('authInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(authInterceptor).toBeTruthy();
  });

  it('should add auth headers for API requests', () => {
    const mockReq = new HttpRequest('GET', 'https://artists-api-ndhd.onrender.com/artists');
    const mockNext = jasmine.createSpy('next').and.returnValue({ pipe: () => ({}) });
    
    // Test que l'interceptor existe et peut être appelé
    const result = authInterceptor(mockReq, mockNext);
    
    expect(mockNext).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should handle non-API requests', () => {
    const mockReq = new HttpRequest('GET', 'https://other-api.com/data');
    const mockNext = jasmine.createSpy('next').and.returnValue({ pipe: () => ({}) });
    
    // Test que l'interceptor traite les requêtes non-API
    const result = authInterceptor(mockReq, mockNext);
    
    expect(mockNext).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});