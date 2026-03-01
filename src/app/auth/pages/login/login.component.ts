import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector:'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl:'./login.component.html',
  styleUrl:'./login.component.css'
})
export class LoginComponent {
    form:FormGroup
    constructor(private fb: FormBuilder) {
      this.form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
      });
    }

  login() {
    console.log(this.form.value);
  }
}
