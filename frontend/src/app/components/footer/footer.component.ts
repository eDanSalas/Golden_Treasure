import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-footer',
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  
  // private map: any;
  // private latitud: any = 19.10654;
  // private longitud: any = -104.34957;

  
  // private userMarker: L.Marker<any> | undefined;
  
  // ngOnInit(): void {
  //   this.initMap();
  // }
  
  // private initMap() {
  //   const coords: [number, number] = [this.latitud, this.longitud];
    
  //   this.map = L.map('map').setView([this.latitud, this.longitud],13);

  //   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

  //   // this.userMarker([this.latitud, this.longitud]).addTo(this.map);

  //   const myIcon = L.icon({
  //     iconUrl: '/marker.png', // Ruta absoluta desde la raíz del servidor
  //     iconSize: [25, 41],
  //     iconAnchor: [12, 41],
  //     popupAnchor: [1, -34]
  //   });

  //   if(this.userMarker){
  //     this.userMarker = L.marker(coords);
  //   } else {
  //     this.userMarker = L.marker(coords,{
  //       icon:myIcon
  //     }).addTo(this.map).bindPopup('Encuentranos Aqui!').openPopup();
  //   }

  // }
  private map!: L.Map;
  private readonly COORDS: L.LatLngExpression = [19.10654, -104.34957];

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView(this.COORDS, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Marcador con icono personalizado
    const customIcon = L.icon({
      iconUrl: 'images/marker.png', // Desde carpeta public/
      iconSize: [45, 45],
      iconAnchor: [16, 32]
    });

    L.marker(this.COORDS, {
      icon: customIcon,
      title: 'Nuestra ubicación'
    })
    .bindPopup('¡Encuéntranos aquí!')
    .addTo(this.map);
  }
}
