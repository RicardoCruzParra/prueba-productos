import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService, Producto } from '../../core/productos.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="container">
      <h2>Productos</h2>
      <form (ngSubmit)="agregar()" class="row">
        <input [(ngModel)]="nuevo.nombre" name="nombre" placeholder="Nombre" required class="input"/>
        <input [(ngModel)]="nuevo.precio" name="precio" type="number" min="1" step="0.01" placeholder="Precio" required class="input"/>
        <button class="btn" type="submit">Agregar</button>
      </form>
      <ul class="list">
        <li *ngFor="let p of lista">
          <strong>{{ p.nombre }}</strong> — $ {{ p.precio }}
          <button class="btn danger" (click)="eliminar(p.id!)">Eliminar</button>
        </li>
      </ul>
    </section>
  `,
  styles: [`
    .container{ max-width: 720px; margin: 2rem auto; }
    .row{ display:flex; gap:.5rem; margin-bottom:1rem; }
    .input{ flex:1; padding:.5rem; }
    .btn{ padding:.4rem .8rem; }
    .btn.danger{ background:#ffdddd; }
    .list{ list-style:none; padding:0; display:flex; flex-direction:column; gap:.5rem; }
  `]
})
export class ProductosComponent implements OnInit {
  lista: Producto[] = [];
  nuevo: Producto = { nombre: '', precio: 0 };

  constructor(private svc: ProductosService) {}

  ngOnInit(): void { this.refrescar(); }

  refrescar(): void { this.svc.listar().subscribe(r => this.lista = r); }

  agregar(): void {
    const toSend = { nombre: this.nuevo.nombre.trim(), precio: Number(this.nuevo.precio) };
    this.svc.crear(toSend).subscribe(() => {
      this.nuevo = { nombre: '', precio: 0 };
      this.refrescar();
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar producto?')) return;
    this.svc.eliminar(id).subscribe(() => this.refrescar());
  }
}
