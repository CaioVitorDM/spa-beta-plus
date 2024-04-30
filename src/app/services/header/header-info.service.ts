import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private tituloSubject = new BehaviorSubject<string | null>(null);
  private numeroSubject = new BehaviorSubject<number | null>(null);

  titulo$ = this.tituloSubject.asObservable();
  numero$ = this.numeroSubject.asObservable();

  setTitulo(titulo: string | null) {
    this.tituloSubject.next(titulo);
  }

  setNumero(numero: number | null) {
    this.numeroSubject.next(numero);
  }
}
