import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.page.html',
  styleUrls: ['./authentication.page.scss'],
})
export class AuthenticationPage implements OnInit {

  emailForm = new FormControl('', [Validators.required, Validators.email]);

  constructor(
    private platform: Platform,
    private router: Router,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    if (this.platform.is('desktop')) {
      GoogleAuth.init();
    }
  }

  signIn() {
    console.log(this.emailForm.value);
    if (this.emailForm.valid) {
      this.router.navigateByUrl('home');
    } else {
      this.presentToastMessage('Authentication error', 'danger');
    }
  }

  async signInWithGoogle() {
    const googleUser = await GoogleAuth.signIn();
    console.log(googleUser);
    if (googleUser.authentication) {
      localStorage.setItem('userDetails', JSON.stringify(googleUser));
      this.router.navigateByUrl('home');
    }
  }

  async presentToastMessage(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration: 5000,
      buttons: [
        { text: 'OK', role: 'cancel' }
      ]
    });
    toast.present();
  }

}
