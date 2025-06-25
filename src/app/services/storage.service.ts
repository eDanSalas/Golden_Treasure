import { Injectable } from '@angular/core';
import { Servicios } from '../components/servicios/servicios.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  serviciosReservados: any[] = [];
  reservaciones: any[] = [];
  
  private readonly LS_KEY = 'serviciosReservados';
  private readonly LS_KEY_R = 'reservaciones';
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {
    this.serviciosReservados = JSON.parse(
      localStorage.getItem(this.LS_KEY) || '[]'
    );

    this.reservaciones = JSON.parse(
      localStorage.getItem(this.LS_KEY_R) || '[]'
    );
  }

  getServicios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/servicios/todos`);
  }

  guardarServicio(servicio: any): void {
    fetch(`${this.apiUrl}/servicios/crear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(servicio)
    })
      .then(res => res.json())
      .then(data => console.log(data));
  }

  eliminarServicio(index: number): void {
    fetch(`${this.apiUrl}/servicios/eliminar/${index+1}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => console.log(data));
  }

  editarServicios(index: number, servicio: any): void {
    fetch(`${this.apiUrl}/servicios/editar/${index+1}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(servicio)
    })
      .then(res => res.json())
      .then(data => console.log(data));
  }

  // Reservaciones
  getReservaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservaciones/todas`);
  }

  guardarReservaciones(reservacion: any): void {
    fetch(`${this.apiUrl}/reservaciones/crear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservacion)
    })
      .then(res => res.json())
      .then(data => console.log(data));
  }

  eliminarReservaciones(index: number): void {
    fetch(`${this.apiUrl}/reservaciones/eliminar/${index+1}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => console.log(data));
  }

  editarReservaciones(index: number, reservacion: any): void {
    fetch(`${this.apiUrl}/reservaciones/editar/${index+1}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservacion)
    })
      .then(res => res.json())
      .then(data => console.log(data));
  }
}
