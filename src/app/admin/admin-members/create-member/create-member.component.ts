import { Component , OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { NgForm } from '@angular/forms';
@Component ({
  selector : 'app-create-member',
  templateUrl : './create-member.component.html',
  styleUrls : ['./create-member.component.css']
})

export class CreateMemberComponent implements OnInit {
  invalidFlag = false;
  constructor(public authService : AuthService,
              private router: Router) {
   }
  ngOnInit() {
  }
  onSaveMember(form: NgForm) {
    this.invalidFlag = true;
    if (form.invalid) {
      return;
    } else {
      this.authService.createUser(form.value.username,  form.value.password, form.value.name)
      .subscribe(response => {
          console.log(response);
          this.router.navigate(['/admin/Members']);
      });
    }
  }
}
