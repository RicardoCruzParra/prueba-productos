import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="container">
      <h2>Login</h2>
      <form (ngSubmit)="ingresar()">
        <input [(ngModel)]="username" name="u" placeholder="user" required class="input"/>
        <input [(ngModel)]="password" type="password" name="p" placeholder="password" required class="input"/>
        <button class="btn" type="submit">Entrar</button>
      </form>
      <p class="hint">Demo: user / password</p>
    </section>
  `,
  styles: [`
    .container { max-width: 420px; margin: 3rem auto; display:flex; flex-direction:column; gap:1rem; }
    .input { width:100%; padding:.6rem; }
    .btn { padding:.6rem 1rem; }
    .hint { color:#666; font-size:.9rem; }
  `]
})
export class LoginComponent {
  username = 'user';
  password = 'password';
  constructor(private auth: AuthService, private router: Router) {}
  ingresar(): void {
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/productos']),
      error: () => alert('Credenciales inválidas')
    });
  }
}
