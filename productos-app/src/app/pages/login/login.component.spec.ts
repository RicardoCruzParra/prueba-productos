import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let comp: LoginComponent;

  const authSpy = jasmine.createSpyObj('AuthService', ['login']);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    comp = fixture.componentInstance;
  });

  it('ingresar navega a /productos en login OK', () => {
    authSpy.login.and.returnValue(of(true));
    comp.ingresar();
    expect(authSpy.login).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/productos']);
  });

  it('ingresar alerta en login fallido', () => {
    spyOn(window, 'alert');
    authSpy.login.and.returnValue(throwError(() => new Error('bad')));
    comp.ingresar();
    expect(window.alert).toHaveBeenCalled();
  });
});
