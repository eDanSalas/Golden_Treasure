import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Servicios } from '../servicios/servicios.interface';
import { ServicioService } from '../../services/servicio.service';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import Swal from 'sweetalert2';
import { MatRadioModule } from '@angular/material/radio';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-servicio',
  imports: [
    RouterModule,
    CommonModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule
  ],
  templateUrl: './servicio.component.html',
  styleUrl: './servicio.component.css',
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
    fechaParticular: null as Date | null,
    cuentaReservacion: ''
  };
  minFecha = new Date();
  fechaInvalida: boolean = false;

  @ViewChild('formulario') formularioElement!: ElementRef;

  serImage: { [key: number]: string[] } = {
    1: ['images/s1-1.jpg', 'images/s1-2.webp', 'images/s1-3.jpg'],
    2: ['images/s2-1.jpg', 'images/s2-2.webp', 'images/s2-3.jpg'],
    3: ['images/s3-1.jpg', 'images/s3-2.jpg', 'images/s3-3.jpg'],
    4: ['images/s4-1.jpg', 'images/s4-2.jfif', 'images/s4-3.jpg'],
    5: ['images/s5-1.jpg', 'images/s5-2.webp', 'images/s5-3.jpg'],
    6: ['images/s6-1.jpg', 'images/s6-2.jfif', 'images/s6-3.webp'],
    7: ['images/s7-1.jpg', 'images/s7-2.jpg', 'images/s7-3.avif'],
    8: ['images/s8-1.jpg', 'images/s8-2.jpg', 'images/s8-3.jpg'],
    9: ['images/s9-1.png', 'images/s9-2.webp', 'images/s9-3.jfif'],
  };

  serName: string[] = [
    'SPA',
    'Restaurant',
    'Gimnasio',
    'Albercas',
    'Bar',
    'Salón de eventos',
    'Sala de Reuniones',
    'Limpieza y Lavandería',
    'Transportes',
  ];

  
  constructor(
    public service: ServicioService,
    public route: ActivatedRoute,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    const sEncontrado = this.service
      .getServicios()
      .find((s) => s.id == this.id);
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
    const y =
      element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });

    element.classList.add('resaltar-formulario');

    setTimeout(() => {
      element.classList.remove('resaltar-formulario');
    }, 1000);
  }

  fechaEsDomingoSinReservacion(): boolean {
    const fecha = this.modelo.fechaParticular;
    const reservacion = this.modelo.cuentaReservacion;
    if (!fecha || !reservacion) return false;

    const esDomingo = (fecha instanceof Date) && fecha.getDay() === 0;
    return esDomingo && reservacion === 'no';
  }


  @Output() servicioCreado = new EventEmitter<any>();
  
  enviarInfo(form: NgForm) {
    if (form.valid) {

      // const data = {
      //   nombre: this.modelo.nombre,
      //   nombrePublico: this.modelo.nombrePublico,
      //   email: this.modelo.email,
      //   duda: this.modelo.duda,
      //   aceptaFAQ: this.modelo.aceptaFAQ,
      //   fechaParticular: this.modelo.fechaParticular,
      //   cuentaReservacion: this.modelo.cuentaReservacion
      // };
      // const lsData = JSON.parse(localStorage.getItem('serviciosReservados') || '[]');
      // lsData.push(data);
      // localStorage.setItem('serviciosReservados',JSON.stringify(lsData));

      this.storageService.guardarServicio(this.modelo);
      this.servicioCreado.emit(this.modelo);

      Swal.fire({
        icon: 'success',
        title: '¡Reservación de servicio enviada!',
        text: 'Pronto recibirá un correo con su servicio reservado. ¡Muchas Gracias!',
        confirmButtonText: 'Aceptar'
      });

      form.resetForm();
    }
  }
  
  invalidString(s: any): boolean {
    const pattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;
    return typeof s !== 'string' || s.length === 0 || !pattern.test(s);
  }


  minLength(s: any, l: number): boolean {
    return typeof s !== 'string' || (s.length > 0 && s.length < l);
  }


}
