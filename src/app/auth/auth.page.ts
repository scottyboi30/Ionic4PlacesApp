import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLogin = true;
  constructor(private authService: AuthService, private router: Router,
    private loadingController: LoadingController) { }

  ngOnInit() {
  }

  async onLogin() {
    this.authService.login();

    const loading = await this.loadingController.create({
      message: 'Logging in.....',
      keyboardClose: true
    });
    await loading.present();
    setTimeout(() => {
      loading.dismiss();
      this.router.navigateByUrl('/places/tabs/discover');
    }, 2000)
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const { email, password } = form.value;

    if (this.isLogin) {
      //login
    }
    else {
      //register
    }
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }
}
