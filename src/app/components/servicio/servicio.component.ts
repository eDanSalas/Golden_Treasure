import { Component, ElementRef, ViewChild } from '@angular/core';
import { Servicios } from '../servicios/servicios.interface';
import { ServicioService } from '../../services/servicio.service';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-servicio',
  imports: [RouterModule, 
    CommonModule, 
    MatProgressSpinnerModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSnackBarModule, 
    MatIconModule, 
    MatCheckboxModule, 
    MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule],
  templateUrl: './servicio.component.html',
  styleUrl: './servicio.component.css'
})
export class ServicioComponent {
  servicio!: Servicios;
  id!: number;
  modelo = {
    nombre: '',
    nombrePublico: '',
    email: '',
    duda: '',
    aceptaFAQ: false,
    fechaParticular: null
  };
  minFecha = new Date();

  @ViewChild('formulario') formularioElement!: ElementRef;

  serImage: {[key: number]: string[]} = {
    1: ["images/s1-1.jpg","images/s1-2.webp","images/s1-3.jpg"],
    2: ["images/s2-1.jpg","images/s2-2.webp","images/s2-3.jpg"],
    3: ["images/s3-1.jpg","images/s3-2.jpg","images/s3-3.jpg"],
    4: ["images/s4-1.jpg","images/s4-2.jfif","images/s4-3.jpg"],
    5: ["images/s5-1.jpg","images/s5-2.webp","images/s5-3.jpg"],
    6: ["images/s6-1.jpg","images/s6-2.jfif","images/s6-3.webp"],
    7: ["images/s7-1.jpg","images/s7-2.jpg","images/s7-3.avif"],
    8: ["images/s8-1.jpg","images/s8-2.jpg","images/s8-3.jpg"],
    9: ["images/s9-1.png","images/s9-2.webp","images/s9-3.jfif"],
  };

  serName: string[] = [
    "SPA",
    "Restaurant",
    "Gimnasio",
    "Albercas",
    "Bar",
    "Salón de eventos",
    "Sala de Reuniones",
    "Limpieza y Lavandería",
    "Transportes"
  ]

  constructor(public service: ServicioService, public route: ActivatedRoute, private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    const sEncontrado = this.service.getServicios().find(s => s.id == this.id);
    if (sEncontrado) {
      this.servicio = sEncontrado;
    }
    window.scrollTo({ top: 0 });
  }

  scrollToFormulario() {
    const navbar = document.querySelector('nav');
    const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 80;

    const yOffset = -navbarHeight;
    const element = this.formularioElement.nativeElement;
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });

    element.classList.add('resaltar-formulario');

    setTimeout(() => {
      element.classList.remove('resaltar-formulario');
    }, 1000);
  }

  enviarInfo(form: NgForm) {
    if (form.valid) {
      console.log(this.modelo);

      this.snackBar.open('Tu información se envió correctamente', 'Cerrar', {
        duration: 4000,
        panelClass: ['snackbar-success']
      });

      form.resetForm();
    }
  }

}
