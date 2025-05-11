import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isScrolled = false;
  menuOpen: boolean = false;

  admin: {[key: number]: string[]} = {
    1: ["Ángel Daniel Lopez Rodriguez", "ISC1_ad"],
    2: ["Eric Daniel Salas Martínez", "ISC2_ed"],
    3: ["Diego Adriel Segura Ramírez", "ISC3_da"]
  }

  showLoginModal = false;
  loginId: number | null = null;
  loginPassword: string = '';
  loggedAdminName: string | null = null;
  loggedAdminId: number | null = null;
  adminInfo: { key: number, nombre: string } | null = null;
  showDashboard: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 200;
  }

  constructor(private eRef: ElementRef) { }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.menuOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.menuOpen = false;
    }
  }


  ngOnInit() {
    const storedAdminId = localStorage.getItem('loggedAdminId');
    if (storedAdminId) {
      const id = parseInt(storedAdminId, 10);
      if (id && this.admin[id]) {
        this.adminInfo = {
          key: id,
          nombre: this.admin[id][0]
        };
      }
    }
  }

  openLoginModal() {
    this.showLoginModal = true;
  }

  closeLoginModal() {
    this.showLoginModal = false;
    this.loginId = null;
    this.loginPassword = '';
  }

  toggleMenu() {
    if (this.loggedAdminName) {
      this.menuOpen = !this.menuOpen;
    } else {
      this.openLoginModal();
    }
  }

  submitLogin() {
    const id = this.loginId;
    const pass = this.loginPassword.trim();

    if (id && this.admin[id] && this.admin[id][1] === pass) {
      const nombre = this.admin[id][0];
      this.loggedAdminName = nombre;
      this.loggedAdminId = id;
      this.adminInfo = { key: id, nombre };

      localStorage.setItem('loggedAdminName', nombre);
      localStorage.setItem('loggedAdminId', id.toString());
      this.closeLoginModal();

      Swal.fire({
        title: '¡Bienvenido!',
        text: `Hola ${nombre}, acceso concedido.`,
        icon: 'success',
        confirmButtonColor: 'gold',
        background: '#1e1e1e',
        color: 'white'
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'ID o contraseña incorrectos',
        icon: 'error',
        confirmButtonColor: 'gold',
        background: '#1e1e1e',
        color: 'white'
      });
    }
  }


  logout() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro que deseas cerrar sesión?',
      iconHtml: '<i class="fas fa-sign-out-alt"></i>',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: 'gold',
      cancelButtonColor: '#6c757d',
      background: '#1e1e1e',
      color: 'white'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loggedAdminName = null;
        this.loggedAdminId = null;
        this.menuOpen = false;
        localStorage.removeItem('loggedAdminName');
        localStorage.removeItem('loggedAdminId');

        Swal.fire({
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión correctamente.',
          icon: 'info',
          confirmButtonColor: 'gold',
          background: '#1e1e1e',
          color: 'white'
        });
      }
    });
  }


}
