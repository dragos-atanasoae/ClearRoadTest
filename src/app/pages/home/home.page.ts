import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuthModel } from '../../core/models/google-auth.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  userDetails: GoogleAuthModel;

  constructor(
    private router: Router,
  ) {}

  ngOnInit() {
    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
  }

  signOut() {
    localStorage.removeItem('userDetails');
    this.router.navigateByUrl('');
  }

}
