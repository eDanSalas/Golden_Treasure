import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder,FormGroup,Validators, AbstractControl, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormsModule } from '@angular/forms'; 
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { NgOtpInputComponent } from 'ng-otp-input';
import { Router } from '@angular/router';
import { NavbarStateService } from '../../services/navbar-state.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,FormsModule,CommonModule,NgOtpInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  showLogin=true;

  // Formularios
  loginForm: FormGroup;
  registerForm: FormGroup;

  //Variables para el captcha
  showCaptchaModal = false;
  captchaArray: string[] = [];
  captchaStyles: { [key: string]: string }[] = []; 
  userInput = '';
  captchaMode: 'login' | 'register' | null = null;

  //variables autenticacion sms
  authSMS = false;
  userSMS = '';
  phoneSMS = '';
  showCodeInput = false;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false
  }
  otp: string = '';
  verify: any = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private navbarState: NavbarStateService) {

    // Formulario de login
    this.loginForm=this.fb.group({
      id:['',[Validators.required]],
      contra:['',[Validators.required]]
    });

    // Formulario de registro
    this.registerForm=this.fb.group({
      correo:['',[Validators.required, Validators.email]],
      username:['',[Validators.required]],
      contra: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15), this.passwordPatternValidator]],
      confcontra: ['', [Validators.required]]
    }, { validators: this.matchPasswordValidator });
  }

  toggleMode() {
    this.showLogin=!this.showLogin;
  }

  async onLogin() {
  if (this.loginForm.valid) {
    const id = this.loginForm.get('id')?.value;
    const contra = this.loginForm.get('contra')?.value;

    const info = await fetch('https://goldentreasurebackend-production.up.railway.app/api/client/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, contra })
    });

    if (info.status === 423) {
      Swal.fire({
          title: "Cuenta Bloqueada",
          text: "Tu cuenta ha sido bloqueada por multiples inicios de sesion",
          icon: "error",
          confirmButtonColor: 'gold',
          background: '#1e1e1e',
          color: 'white'
        });
      const data = await fetch('https://goldentreasurebackend-production.up.railway.app/api/mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });
      if (data.status === 200) {
        Swal.fire({
          title: "Se envio el correo correctamente",
          text: "Por favor comprueba tu bandeja de entrada", 
          icon: "success",
          confirmButtonColor: 'gold',
          background: '#1e1e1e',
          color: 'white'
        });
      }
      return;
    }

    if (info.status === 200) {
      console.log(info);
      const data = await info.json();
      // Aquí asumimos que el backend retorna algo como { id: ..., nombre: ... }
      localStorage.setItem('loggedUserId', data.cliente.id); 
      localStorage.setItem('loggedUserName', data.cliente.nombre);

      Swal.fire({
        title: `Bienvenido ${data.cliente.nombre}`,
        text: "Es un placer tenerte devuelta", 
        icon: "success",
        confirmButtonColor: 'gold',
        background: '#1e1e1e',
        color: 'white'
      }).then(() => {
        // Recarga para que el navbar detecte los cambios
        this.router.navigate(['/inicio']).then(() => {
            window.location.reload(); // recarga luego de navegar
        });
      });
      
    } else {
      Swal.fire({
        title: "Error en las credenciales",
        text: "Porfavor checa que tus datos sean correctos", 
        icon: "error",
        confirmButtonColor: 'gold',
        background: '#1e1e1e',
        color: 'white'
      });
    }
  }
}

  async onLoginGoogle(){
    const user = await this.authService.logInGoogle();
    const info = await fetch('https://goldentreasurebackend-production.up.railway.app/api/client/loginGoogle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre: user.displayName, correo: user.email })
      });
    if (info.status === 201 || info.status == 200) {
      console.log(info);
      const data = await info.json();
      // Aquí asumimos que el backend retorna algo como { id: ..., nombre: ... }
      localStorage.setItem('loggedUserId', data.cliente.id); 
      localStorage.setItem('loggedUserName', data.cliente.nombre);
      localStorage.setItem('isGoogleAccount', 'true');

      Swal.fire({
        title: 'Inicio de sesión exitoso',
        text: `Bienvenido ${data.cliente.nombre}`,
        icon: 'success'
      }).then(() => {
        // Recarga para que el navbar detecte los cambios
        this.router.navigate(['/inicio']).then(() => {
            window.location.reload(); // recarga luego de navegar
        });
      });
      
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Error en las credenciales',
        icon: 'error'
      });
    }
  }

  activatePhoneAuth(){
    this.authSMS = !this.authSMS;
  }

  onLoginPhone(){
    this.authService.logInMessage(this.phoneSMS);
    if (localStorage.getItem('verificationId')) {
      this.showCodeInput = true;
      this.verify = JSON.parse(localStorage.getItem('verificationId') || '{}');
    }
  }

  onOtpChange(otpCode: any){
    this.otp = otpCode;
  }

  async handleClick(){
    this.authService.credential(this.verify, this.otp);
    if (localStorage.getItem('user_data')) {
      const info = await fetch('https://goldentreasurebackend-production.up.railway.app/api/client/loginPhone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre: this.userSMS, telefono: this.phoneSMS })
      });
      if(info.status === 201 || info.status === 200){
        console.log(info);
        const data = await info.json();
        localStorage.setItem('isPhoneAccount', 'true');
        localStorage.setItem('loggedUserId', data.cliente.id); 
        localStorage.setItem('loggedUserName', data.cliente.nombre);
        Swal.fire({
          title: 'Inicio de sesión exitoso',
          text: `Bienvenido ${data.cliente.nombre}`,
          icon: 'success'
        }).then(() => {
          // Recarga para que el navbar detecte los cambios
          this.router.navigate(['/inicio']).then(() => {
              window.location.reload(); // recarga luego de navegar
          });
        });
      }else{
        Swal.fire({
          title: 'Error',
          text: 'Error en las credenciales',
          icon: 'error'
        });
      }
    }
  }

  async onRegister(){
    if (this.registerForm.valid){
      const correo=this.registerForm.get('correo')?.value;
      const nombre=this.registerForm.get('username')?.value;
      const contra=this.registerForm.get('contra')?.value;
      // Aca pondremos la logica para mandar la informacion del registro

      const info = await fetch('https://goldentreasurebackend-production.up.railway.app/api/client', {
        method : 'POST', 
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, correo, contra })
      });
      
      const data = await info.json();
      
      if(info.ok){
        Swal.fire({
          title: 'Registro Exitoso',
          text: `Muchas gracias por tu registro: ${data.cliente.nombre}, tu id de acceso es: ${data.cliente.id}, guarda tu ID para iniciar sesion`,
          icon: 'success',
          confirmButtonColor: 'gold',
          background: '#1e1e1e',
          color: 'white'
        });
      }

      console.log('Intentando registro con', { correo, nombre, contra });
    }
  }

  // Validators extra
  passwordPatternValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const valid = /^[A-Za-z0-9_]{6,15}$/.test(value) && /[A-Z]/.test(value) && /[0-9]/.test(value);

    return valid ? null : { invalidPassword: true };
  }

  matchPasswordValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
    const password = formGroup.get('contra')?.value;
    const confirmPassword = formGroup.get('confcontra')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  };

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

  openCaptchaModal(mode: 'login'|'register') {
    this.captchaMode = mode;
    this.showCaptchaModal = true;
    this.generateCaptcha();
  }

  verificarCaptcha() {
    const generated = this.captchaArray.join('');
    if (this.userInput === generated) {
      this.showCaptchaModal = false;
      // dependiendo de si es login o register hace la distincion
      if (this.captchaMode === 'login') this.onLogin();
      if (this.captchaMode === 'register') this.onRegister();
    } else {
      Swal.fire({
        title: "El captcha es incorrecto",
        text: "Intentalo de nuevo ", 
        icon: "error",
        confirmButtonColor: 'gold',
        background: '#1e1e1e',
        color: 'white'
      });
      this.generateCaptcha();
    }
  }

}
