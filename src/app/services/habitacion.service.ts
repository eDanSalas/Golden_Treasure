import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Habitacion } from '../habitacion';

@Injectable({
  providedIn: 'root'
})
export class HabitacionService {
  apiURL = 'https://prueba2.free.beeceptor.com/';

  constructor(private http: HttpClient) { }

  retornar(): Observable<{ habitaciones: Habitacion[] }> {
    return this.http.get<{ habitaciones: Habitacion[] }>(this.apiURL).pipe(take(1));
  }

}
