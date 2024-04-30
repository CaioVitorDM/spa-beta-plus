import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private nomeUsuario = new BehaviorSubject<string>('');
  private fotoUsuario = new BehaviorSubject<string>('');

  nomeUsuario$ = this.nomeUsuario.asObservable();
  fotoUsuario$ = this.fotoUsuario.asObservable();

  setNomeUsuario(nome: string) {
    this.nomeUsuario.next(nome);
  }

  setFotoUsuario(foto: string) {
    this.fotoUsuario.next(foto);
  }


}
