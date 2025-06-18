import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ofertas',
  imports: [RouterModule, CommonModule],
  templateUrl: './ofertas.component.html',
  styleUrl: './ofertas.component.css'
})
export class OfertasComponent {
  ngOnInit(){
    window.scrollTo({ top: 0 });
  }

   cupones = [
    { id: 'cupon1', titulo: '10% en Spa', codigo: 'spa10' },
    { id: 'cupon2', titulo: '2x1 en bebidas', codigo: 'bebida2x1' },
    { id: 'cupon3', titulo: '25% en tours', codigo: 'tour25' },
    { id: 'cupon4', titulo: '20% en Zona Kids', codigo: 'kids20' },
    { id: 'cupon5', titulo: 'Cena romántica gratis', codigo: 'love100' }
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
