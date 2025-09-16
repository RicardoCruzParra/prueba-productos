import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductosService, Producto } from '../productos.service';

describe('ProductosService', () => {
  let svc: ProductosService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    svc = TestBed.inject(ProductosService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('listar retorna productos', () => {
    let data: Producto[] | undefined;
    svc.listar().subscribe(r => data = r);
    const req = http.expectOne('http://localhost:8080/api/productos');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'Lápiz', precio: 500 }]);

    expect(data?.length).toBe(1);
    expect(data?.[0].nombre).toBe('Lápiz');
  });

  it('crear envía POST', () => {
    const nuevo: Producto = { nombre: 'Borrador', precio: 300 };
    let created: Producto | undefined;
    svc.crear(nuevo).subscribe(r => created = r);
    const req = http.expectOne('http://localhost:8080/api/productos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevo);
    req.flush({ id: 2, ...nuevo });
    expect(created?.id).toBe(2);
  });

  it('eliminar envía DELETE', () => {
    svc.eliminar(9).subscribe(r => expect(r).toBeUndefined());
    const req = http.expectOne('http://localhost:8080/api/productos/9');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
