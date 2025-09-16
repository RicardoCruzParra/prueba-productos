import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto { id?: number; nombre: string; precio: number; }

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private readonly api = 'http://localhost:8080/api/productos';
  constructor(private http: HttpClient) {}

  listar(): Observable<Producto[]> { return this.http.get<Producto[]>(this.api); }
  crear(p: Producto): Observable<Producto> { return this.http.post<Producto>(this.api, p); }
  eliminar(id: number): Observable<void> { return this.http.delete<void>(`${this.api}/${id}`); }
}
