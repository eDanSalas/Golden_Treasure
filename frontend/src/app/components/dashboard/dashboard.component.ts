import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminComponent } from '../admin/admin.component';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AdminReactiveComponent } from '../admin-reactive/admin-reactive.component';
import { DataBaseService } from '../../services/data-base.service';

@Component({
  selector: 'app-dashboard',
  imports: [AdminComponent, AdminReactiveComponent, CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  id!: number;  
  isActive = false;

  adminName: string = '';

  admin: {[key: number]: string} = {
    1: "Ángel Daniel Lopez Rodriguez",
    2: "Eric Daniel Salas Martínez",
    3: "Diego Adriel Segura Ramírez"
  }


  servicios: any[] = [];
  reservaciones: any[] = [];

  constructor(public route: ActivatedRoute, private storageService: StorageService, private dbService: DataBaseService) {
    this.servicios = this.storageService.getServicios();
    this.reservaciones = this.storageService.getReservaciones();
  }

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.loadAdminData();
    this.actualizarLista();
    window.scrollTo({ top: 0 });
  }

  loadAdminData() {
    this.dbService.getAllAdmins().subscribe({
      next: (admins) => {
        const foundAdmin = admins.find((admin: any) => admin.id === this.id);
        if (foundAdmin) {
          this.adminName = foundAdmin.nombre;
        }
        this.actualizarLista();
      },
      error: (err) => {
        console.error('Error al cargar admin:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar la información del administrador',
          icon: 'error',
          confirmButtonColor: 'gold',
          background: '#1e1e1e',
          color: 'white'
        });
      }
    });
  }

  actualizarLista() {
    this.servicios = this.storageService.getServicios();
    this.reservaciones = this.storageService.getReservaciones();
  }

  eliminarServicio(index: number) {
    this.storageService.eliminarServicio(index);
    this.servicios = [...this.storageService.getServicios()];
    Swal.fire({
      title: 'Registro eliminado',
      icon: 'success',
      confirmButtonColor: 'gold',
      background: '#1e1e1e',
      color: 'white'
    });
    this.actualizarLista();
  }

  editarServicio(evento: {index: number, servicio: any}) {
    this.storageService.editarServicios(evento.index, evento.servicio);
    this.servicios = [...this.storageService.getServicios()];
    Swal.fire({
      title: 'Registro editado',
      icon: 'success',
      confirmButtonColor: 'gold',
      background: '#1e1e1e',
      color: 'white'
    });
    this.actualizarLista();
  }

  eliminarReservacion(index: number) {
    this.storageService.eliminarReservaciones(index);
    this.servicios = [...this.storageService.getReservaciones()];
    Swal.fire({
      title: 'Registro eliminado',
      icon: 'success',
      confirmButtonColor: 'gold',
      background: '#1e1e1e',
      color: 'white'
    });
    this.actualizarLista();
  }

  editarReservacion(evento: {index: number, reservacion: any}) {
    this.storageService.editarReservaciones(evento.index, evento.reservacion);
    // this.reservaciones = [...this.storageService.getReservaciones()];
    this.reservaciones = this.storageService.getReservaciones().slice(); 
    Swal.fire({
      title: 'Registro editado',
      icon: 'success',
      confirmButtonColor: 'gold',
      background: '#1e1e1e',
      color: 'white'
    });
    this.actualizarLista();
  }

  toggleActive() {
    this.isActive = !this.isActive;
  }
}
