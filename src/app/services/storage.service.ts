import { Injectable } from '@angular/core';
import { Servicios } from '../components/servicios/servicios.interface';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  serviciosReservados: any[] = [];
  reservaciones: any[] = [];
  
  private readonly LS_KEY = 'serviciosReservados';
  private readonly LS_KEY_R = 'reservaciones';

  constructor() {
    this.serviciosReservados = JSON.parse(
      localStorage.getItem(this.LS_KEY) || '[]'
    );

    this.reservaciones = JSON.parse(
      localStorage.getItem(this.LS_KEY_R) || '[]'
    );
  }

  getServicios() {
    const data = localStorage.getItem(this.LS_KEY);
    return data ? JSON.parse(data) : [];
  }

  guardarServicio(servicio: any): void {
    const servicios = this.getServicios();
    servicios.push(servicio);
    localStorage.setItem(this.LS_KEY, JSON.stringify(servicios));
  }

  eliminarServicio(index: number): void {
    const servicios = this.getServicios();
    servicios.splice(index, 1);
    localStorage.setItem(this.LS_KEY, JSON.stringify(servicios));
  }

  editarServicios(index: number, servicio: any): void {
    const servicios = this.getServicios();
    servicios[index] = servicio;
    localStorage.setItem(this.LS_KEY, JSON.stringify(servicios));
  }

  // Reservaciones
  getReservaciones() {
    const data = localStorage.getItem(this.LS_KEY_R);
    return data ? JSON.parse(data) : [];
  }

  guardarReservaciones(reservacion: any): void {
    const reservaciones = this.getReservaciones();
    reservaciones.push(reservacion);
    localStorage.setItem(this.LS_KEY, JSON.stringify(reservacion));
  }

  eliminarReservaciones(index: number): void {
    const reservaciones = this.getReservaciones();
    reservaciones.splice(index, 1);
    localStorage.setItem(this.LS_KEY, JSON.stringify(reservaciones));
  }

  editarReservaciones(index: number, reservacion: any): void {
    const reservaciones = this.getReservaciones();
    reservaciones[index] = reservacion;
    localStorage.setItem(this.LS_KEY, JSON.stringify(reservaciones));
  }
}
