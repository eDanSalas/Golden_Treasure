import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Habitacion } from '../habitacion';

@Injectable({
  providedIn: 'root'
})
export class HabitacionService {
  apiURL = 'https://run.mocky.io/v3/51205701-32cd-4e27-b660-17ec61012cb0';
  
  constructor(private http: HttpClient) { }

  retornar(): Observable<{ habitaciones: Habitacion[] }> {
    return this.http.get<{ habitaciones: Habitacion[] }>(this.apiURL).pipe(take(1));
  }
}
