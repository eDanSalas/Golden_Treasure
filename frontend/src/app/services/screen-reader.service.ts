import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScreenReaderService {

  constructor() { }

  private synth =  window.speechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  public lectorActivo = false;

  activarLector() {
    this.lectorActivo = true;
  }

  desactivarLector() {
    this.lectorActivo = false;
    this.stop();
  }

  speak(text: string) {
     if (!this.lectorActivo) return;
    this.stop();
    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.lang = 'es-MX';
    this.synth.speak(this.utterance);
  }

  pause() {
    if(this.synth.speaking) this.synth.pause();
  }

  resume() {
    if(this.synth.paused) this.synth.resume();
  }

  stop() {
    this.synth.cancel();
  }
}
