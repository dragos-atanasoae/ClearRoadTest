import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.page.html',
  styleUrls: ['./authentication.page.scss'],
})
export class AuthenticationPage implements OnInit {

  emailForm = new FormControl('', [Validators.required, Validators.email]);

  constructor(
    private googlePlus: GooglePlus,
    private router: Router,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {}

  signIn() {
    console.log(this.emailForm.value);
    if (this.emailForm.valid) {
      this.router.navigateByUrl('home');
    } else {
      this.presentToastMessage('Authentication error', 'danger');
    }
  }

  async signInWithGoogle() {
    this.googlePlus.login({})
      .then(res => {
        console.log(res);
        if (res) {
            localStorage.setItem('userDetails', JSON.stringify(res));
            this.router.navigateByUrl('home');
          }
      })
      .catch(err => console.error(err));
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
