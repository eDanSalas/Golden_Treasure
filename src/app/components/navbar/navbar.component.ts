import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { DataBaseService } from '../../services/data-base.service';

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

  admin : any = null;

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
  currentRoute: string = '';

  // navbar.component.ts
  loggedUserName: string | null = localStorage.getItem('loggedUserName');
  loggedUserId: number | null = null;


  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 200;
  }

  constructor(private eRef: ElementRef, private router: Router, private bdservice: DataBaseService ) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.menuOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.menuOpen = false;
    }
  }

  ngOnInit() {
    this.loadAdminData();
    this.checkLoggedAdmin();
    this.checkLoggedUser();
  }

  loadAdminData() {
    this.bdservice.getAllAdmins().subscribe({
      next: (admins) => {
        this.admin = admins.reduce((acc: any, admin: any) => {
          acc[admin.id] = [admin.username, admin.nombre, admin.contra, admin.imagen];
          return acc;
        }, {});
      },
      error: (err) => {
        console.error('Error al cargar admins:', err);
      }
    });
  }

  checkLoggedUser() {
    const storedUserName = localStorage.getItem('loggedUserName');
    const storedUserId = localStorage.getItem('loggedUserId');

    if (storedUserName && storedUserId) {
      this.loggedUserName = storedUserName;
      this.loggedUserId = parseInt(storedUserId, 10);
    }
  }

  checkLoggedAdmin() {
    const storedAdminId = localStorage.getItem('loggedAdminId');
    const storedAdminName = localStorage.getItem('loggedAdminName');
    const storedAdminUs = localStorage.getItem('loggedAdminUs');
    const storedAdminAvatar = localStorage.getItem('loggedAdminAvatar');

    if (storedAdminId && storedAdminName && storedAdminUs && storedAdminAvatar) {
      const id = parseInt(storedAdminId, 10);
      this.loggedAdminId = id;
      this.loggedAdminName = storedAdminName;
      this.loggedAdminUs = storedAdminUs;
      this.loggedAdminAvatar = storedAdminAvatar;
      this.adminInfo = {
        key: id,
        nombre: storedAdminName
      };
    }
  }

  submitLogin() {
    const id = this.loginId;
    const username = this.loginUs;
    const pass = this.loginPassword.trim();

    if (!id || !username || !pass) {
      this.showError('Todos los campos son requeridos');
      return;
    }

    this.bdservice.login(id, username, pass).subscribe({
      next: (response: any) => {
        console.log('Respuesta completa:', response);
      
        // Ajusta según la estructura real de tu respuesta
        if (response && response.message === 'Login exitoso' && response.admin) {
          const adminData = response.admin;
          this.handleSuccessfulLogin(
            adminData.id, 
            adminData.nombre,
            adminData.username,
            adminData.imagen || this.getAdminAvatar(adminData.id)
          );
        } else {
          this.showError('Credenciales incorrectas');
        }
      },
      error: (error) => {
        console.error('Error completo:', error);
        if (error.status === 404) {
          this.showError('Endpoint no encontrado. Verifica la URL');
        } else if (error.status === 401) {
          this.showError('Credenciales incorrectas');
        } else if (error.status === 501) {
          this.showError('Cuenta Bloqueada');
        } else {
          this.showError(`El error es: ${error.message || 'Error desconocido'}`);
        }
      }
    });
  }

  private getAdminAvatar(adminId: number): string {
    return `admins/admin${adminId}.jpg`;
  }

  private handleSuccessfulLogin(id: number, nombre: string, username: string, avatar: string) {
    this.loggedAdminName = nombre;
    this.loggedAdminId = id;
    this.loggedAdminUs = username;
    this.loggedAdminAvatar = avatar;
    this.adminInfo = { key: id, nombre };

    localStorage.setItem('loggedAdminName', nombre);
    localStorage.setItem('loggedAdminUs', username);
    localStorage.setItem('loggedAdminId', id.toString());
    localStorage.setItem('loggedAdminAvatar', avatar);
    this.closeLoginModal();

    Swal.fire({
      title: '¡Bienvenido!',
      text: `Hola ${nombre}, acceso concedido.`,
      icon: 'success',
      confirmButtonColor: 'gold',
      background: '#1e1e1e',
      color: 'white'
    });
  }

  private showError(message: string) {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonColor: 'gold',
      background: '#1e1e1e',
      color: 'white'
    });
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

  // logoutUser() {
  //   Swal.fire({
  //     title: '¿Cerrar sesión?',
  //     text: "¿Estás seguro que quieres salir de tu cuenta?",
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonColor: '#d33',
  //     cancelButtonColor: '#3085d6',
  //     confirmButtonText: 'Sí, salir',
  //     cancelButtonText: 'Cancelar'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.loggedUserName = null;
  //       this.loggedUserId = null;
  //       localStorage.removeItem('loggedUserName');
  //       localStorage.removeItem('loggedUserId');

  //       Swal.fire(
  //         'Sesión cerrada',
  //         'Has salido correctamente.',
  //         'success'
  //       ).then(() => {
  //         this.router.navigate(['/']);
  //       });
  //     }
  //   });
  // }

  logout() {
  Swal.fire({
    title: '¿Cerrar sesión?',
    text: '¿Estás seguro que quieres salir de tu cuenta?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, salir',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Borrar datos del usuario
      this.loggedUserName = null;
      this.loggedUserId = null;
      localStorage.removeItem('loggedUserName');
      localStorage.removeItem('loggedUserId');

      // Borrar datos del admin
      this.loggedAdminName = null;
      this.loggedAdminUs = null;
      this.loggedAdminId = null;
      this.loggedAdminAvatar = null;
      this.adminInfo = null;
      localStorage.removeItem('loggedAdminName');
      localStorage.removeItem('loggedAdminUs');
      localStorage.removeItem('loggedAdminId');
      localStorage.removeItem('loggedAdminAvatar');

      Swal.fire(
        'Sesión cerrada',
        'Has salido correctamente.',
        'success'
      ).then(() => {
        this.router.navigate(['/']); // Redirigir al inicio
      });
    }
  });
}



  isActive(route: string): boolean {
    return this.currentRoute === route;
  }

  showCaptchaModal = false;
  captchaArray: string[] = [];
  captchaStyles: { [key: string]: string }[] = [];
  userInput = '';
  captchaMode: 'admin' | null = null;

  generateCaptcha() {
    this.userInput = '';
    this.captchaArray = [];
    this.captchaStyles = [];

    const longitud = 5;
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < longitud; i++) {
      const char = caracteres.charAt(Math.floor(Math.random() * caracteres.length));
      this.captchaArray.push(char);
      this.captchaStyles.push(this.randomCharStyle());
    }
  }

  // Estilos para las letras y que se vea piola
  randomCharStyle(): { [key: string]: string } {
    const size = 16 + Math.floor(Math.random() * 12); // entre 16 y 28px
    const color = `hsl(${Math.floor(Math.random() * 360)}, 80%, 40%)`;
    return {
      'font-size': `${size}px`,
      color
    };
  }

  openCaptchaModal(mode: 'admin') {
    this.captchaMode = mode;
    this.showCaptchaModal = true;
    this.generateCaptcha();
  }


  verificarCaptcha() {
  const generated = this.captchaArray.join('');
  if (this.userInput === generated) {
    this.showCaptchaModal = false;
    if (this.captchaMode === 'admin') {
      this.submitLogin();
    }
  } else {
    alert('Captcha incorrecto, inténtalo de nuevo');
    this.generateCaptcha();
  }
}


}