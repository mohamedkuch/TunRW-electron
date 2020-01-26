import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Router } from '@angular/router';
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading = false;
  invalidFlag = false;
  invalidPass = false;
  current_time = new Date().getTime() / 1000;

  constructor(public authService: AuthService,
    public router: Router) {

    console.log('user status', this.authService.getAuthStatus());
	 
    if (this.authService.getAuthStatus()) {
      this.router.navigate(['/admin']);
    }
  }

  onLogin(form: NgForm) {
    this.invalidFlag = true;
    this.isLoading = true;
    if (form.invalid) {
      return;
    }
    this.authService.loginUser(form.value.username, form.value.password);

  }
}
