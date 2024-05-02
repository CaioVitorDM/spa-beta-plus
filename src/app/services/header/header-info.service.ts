import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private tituloSubject = new BehaviorSubject<string | null>(null);
  private numeroSubject = new BehaviorSubject<number | null>(null);
  private nomeUsuario = new BehaviorSubject<string>('');
  private fotoUsuario = new BehaviorSubject<string>('');

  titulo$ = this.tituloSubject.asObservable();
  numero$ = this.numeroSubject.asObservable();
  nomeUsuario$ = this.nomeUsuario.asObservable();
  fotoUsuario$ = this.fotoUsuario.asObservable();

  setTitulo(titulo: string | null) {
    this.tituloSubject.next(titulo);
  }

  setNumero(numero: number | null) {
    this.numeroSubject.next(numero);
  }

  setNomeUsuario(nome: string) {
    this.nomeUsuario.next(nome);
  }

  setFotoUsuario(foto: string) {
    this.fotoUsuario.next(foto);
  }

}
