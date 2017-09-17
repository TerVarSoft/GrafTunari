import { Injectable } from '@angular/core';
import { AlertController, Alert } from 'ionic-angular';

/**
 * Utility class for user page. 
 */
@Injectable()
export class UserUtil {  

  constructor(public alertCtrl: AlertController) {}

  getExitConfirmAlert(): Alert {
    let alert = this.alertCtrl.create({
        title: 'Salir',
        message: 'Esta seguro de remover sus credenciales de la aplication?',
        buttons: [
            {
                text: 'Cancelar'
            }
        ]
    });

    return alert;
  }
}