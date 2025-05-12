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
  hovered: boolean = false;

  admin: {[key: number]: string[]} = {
    1: ["Dany","Ángel Daniel Lopez Rodriguez", "ISC1_ad", "/admins/admin1.jpg"],
    2: ["Dan","Eric Daniel Salas Martínez", "ISC2_ed", "/admins/admin2.jpg"],
    3: ["Daizer","Diego Adriel Segura Ramírez", "ISC3_da"]
  }

  showLoginModal = false;
  loginId: number | null = null;
  loginUs: string | null = null;
  loginPassword: string = '';
  loggedAdminName: string | null = null;
  loggedAdminUs: string | null = null;
  loggedAdminId: number | null = null;
  loggedAdminAvatar: string | null = null;
  adminInfo: { key: number, nombre: string } | null = null;
  showDashboard: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 200;
  }

  constructor(private eRef: ElementRef, private router: Router) { }

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
        this.loggedAdminAvatar = localStorage.getItem('loggedAdminAvatar');
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
    const username = this.loginUs;
    const pass = this.loginPassword.trim();

    if (id && this.admin[id] && this.admin[id][0] == username && this.admin[id][2] === pass) {
      const nombre = this.admin[id][1];
      this.loggedAdminName = nombre;
      this.loggedAdminId = id;
      this.loggedAdminUs = this.admin[id][0];
      this.loggedAdminAvatar = this.admin[id][3];
      this.adminInfo = { key: id, nombre };

      localStorage.setItem('loggedAdminName', nombre);
      localStorage.setItem('loggedAdminUs', this.admin[id][0]);
      localStorage.setItem('loggedAdminId', id.toString());
      localStorage.setItem('loggedAdminAvatar', this.admin[id][2]);
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
      text: '¿Estás seguro que deseas cerrar sesión? Te va redirigir al Inicio',
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
        this.loggedAdminAvatar = null;
        this.loggedAdminUs = null;
        this.menuOpen = false;
        localStorage.removeItem('loggedAdminName');
        localStorage.removeItem('loggedAdminId');
        localStorage.removeItem('loggedAdminAvatar');
        localStorage.removeItem('loggedAdminUs');

        Swal.fire({
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión correctamente.',
          icon: 'info',
          confirmButtonColor: 'gold',
          background: '#1e1e1e',
          color: 'white'
        }).then(() => {
          this.router.navigate(['/']);
        });
      }
    });
  }


}
