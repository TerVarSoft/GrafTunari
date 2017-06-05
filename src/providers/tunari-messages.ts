import { Injectable } from '@angular/core';

/**
 * Notifications service helper. 
 */
@Injectable()
export class TunariMessages {  
  
  authenticating: string = `Autenticando GrafTunari`;

  connectedToInternet: string = `Ahora estas conectado!`;
  
  loadingSettings: string = `Cargando configuraciones basicas`;

  noInternetError: string = `No estas conectado a Internet!,
        por favor verifica tu conexion y vuelve a intentarl`;      
}