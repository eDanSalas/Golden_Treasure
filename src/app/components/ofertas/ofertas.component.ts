import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ofertas',
  imports: [RouterModule],
  templateUrl: './ofertas.component.html',
  styleUrl: './ofertas.component.css'
})
export class OfertasComponent {
  ngOnInit(){
    window.scrollTo({ top: 0 });
  }

   cupones = [
    { id: 'cupon1', titulo: '10% en Spa', codigo: 'SPA10' },
    { id: 'cupon2', titulo: '2x1 en bebidas', codigo: 'BEBIDA2X1' },
    { id: 'cupon3', titulo: '25% en tours', codigo: 'TOUR25' },
    { id: 'cupon4', titulo: '20% en Zona Kids', codigo: 'KIDS20' },
    { id: 'cupon5', titulo: 'Cena romántica gratis', codigo: 'LOVE100' }
  ];

  copiarAlPortapapeles(id: string) {
    const elemento = document.getElementById(id);
    if (elemento) {
      navigator.clipboard.writeText(elemento.innerText).then(() => {
        Swal.fire('¡Cupon Copiado!','Disfruta de tu beneficio', 'success');
      }, () => {
        Swal.fire('El cupon no se pudo copiar','No sabemos lo que sucedio', 'error');
      });
    }
  }
}
