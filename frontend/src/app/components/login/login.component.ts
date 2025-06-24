import { Component } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  showLogin=true;

  // Formularios
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {

    // Formulario de login
    this.loginForm=this.fb.group({
      id:['',[Validators.required]],
      contra:['',[Validators.required]]
    });

    // Formulario de registro
    this.registerForm=this.fb.group({
      correo:['',[Validators.required]],
      username:['',[Validators.required]],
      contra:['',[Validators.required, Validators.minLength(6)]]
    });
  }

  toggleMode() {
    this.showLogin=!this.showLogin;
  }

  onLogin(){
    if (this.loginForm.valid){
      const id=this.loginForm.get('id')?.value;
      const contra=this.loginForm.get('contra')?.value;
      // aca pondremos la logica para mandar la informacion 
      console.log('Intentando login con', { id, contra });
    }
  }

  async onRegister(){
    if (this.registerForm.valid){
      const correo=this.registerForm.get('correo')?.value;
      const nombre=this.registerForm.get('username')?.value;
      const contra=this.registerForm.get('contra')?.value;
      // Aca pondremos la logica para mandar la informacion del registro

      const info = await fetch('http://localhost:8080/api/client', {
        method : 'POST', 
        headers: { 
          'Content-Type': 'aplication/json'
        },
        body: JSON.stringify({ nombre, correo, contra })
      });
      
      const data = await info.json();

      data.message 
      
      if(info.ok){
        alert("Estas registrados");
      }

      console.log('Intentando registro con', { correo, nombre, contra });
    }
  }

}
