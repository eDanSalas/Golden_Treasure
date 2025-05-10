import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { SafeurlPipe } from '../../pipes/safeurl.pipe';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule, SafeurlPipe],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  videoUrl: string = 'Hotel-video.mp4';
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    const video = this.videoPlayer.nativeElement;
    video.load(); 
    video.muted = true;
    video.play().catch(error => {
      console.warn('Error al reproducir:', error);
    });
    window.scrollTo({ top: 0 });
  }
  
  onRightClick(event: MouseEvent): void {
    event.preventDefault(); 
  }
}
