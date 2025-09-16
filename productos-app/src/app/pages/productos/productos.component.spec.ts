import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductosComponent } from './productos.component';
import { ProductosService } from '../../core/productos.service';
import { of } from 'rxjs';

describe('ProductosComponent', () => {
  let fixture: ComponentFixture<ProductosComponent>;
  let comp: ProductosComponent;
  const svcSpy = jasmine.createSpyObj('ProductosService', ['listar', 'crear', 'eliminar']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosComponent],
      providers: [{ provide: ProductosService, useValue: svcSpy }]
    }).compileComponents();

    svcSpy.listar.and.returnValue(of([{ id: 1, nombre: 'Lápiz', precio: 500 }]));
    fixture = TestBed.createComponent(ProductosComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit -> listar
  });

  it('carga lista al iniciar', () => {
    expect(comp.lista.length).toBe(1);
  });

  it('agregar llama crear', () => {
    svcSpy.crear.and.returnValue(of({ id: 2, nombre: 'Cuaderno', precio: 1500 }));
    svcSpy.listar.and.returnValue(of([
      { id: 1, nombre: 'Lápiz', precio: 500 },
      { id: 2, nombre: 'Cuaderno', precio: 1500 }
    ]));
    comp.nuevo = { nombre: 'Cuaderno', precio: 1500 };
    comp.agregar();
    expect(svcSpy.crear).toHaveBeenCalled();
  });

  it('eliminar confirma y llama servicio', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    svcSpy.eliminar.and.returnValue(of(void 0));
    comp.eliminar(1);
    expect(svcSpy.eliminar).toHaveBeenCalledWith(1);
  });
});
