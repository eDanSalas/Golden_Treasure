import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pag-reservacion',
  imports: [],
  templateUrl: './pag-reservacion.component.html',
  styleUrl: './pag-reservacion.component.css'
})
export class PagReservacionComponent {
  reservacion: any = null;
  cargando = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.http.get(`http://localhost:8080/api/reservaciones/${id}`).subscribe({
      next: (data) => {
        this.reservacion = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.error = true;
        this.cargando = false;
      }
    });
  }
}
