import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { tokenInterceptor } from '../token.interceptor';

describe('tokenInterceptor', () => {
  let http: HttpTestingController;
  let client: HttpClient;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideHttpClient(withInterceptors([tokenInterceptor]))]
    });
    http = TestBed.inject(HttpTestingController);
    client = TestBed.inject(HttpClient);
  });

  it('no agrega header si no hay token', () => {
    client.get('/api/echo').subscribe();
    const req = http.expectOne('/api/echo');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('agrega Authorization si hay token', () => {
    localStorage.setItem('token', 'abc');
    client.get('/api/echo').subscribe();
    const req = http.expectOne('/api/echo');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc');
    req.flush({});
  });
});
