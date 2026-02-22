import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  form: FormGroup

  private fb = inject(FormBuilder);
  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  signup() {
    console.log(this.form.value);
  }
}

// template: `
// <h2 class="text-xl font-semibold text-primary mb-6">Create Account</h2>

// <form [formGroup]="form" class="space-y-4">
//   <input
//     placeholder="Full Name"
//     formControlName="name"
//     class="w-full rounded-lg border border-outline px-3 py-2 bg-transparent"
//   />

//   <input
//     type="email"
//     placeholder="Email"
//     formControlName="email"
//     class="w-full rounded-lg border border-outline px-3 py-2 bg-transparent"
//   />

//   <input
//     type="password"
//     placeholder="Password"
//     formControlName="password"
//     class="w-full rounded-lg border border-outline px-3 py-2 bg-transparent"
//   />

//   <button
//     type="button"
//     (click)="signup()"
//     class="w-full rounded-xl bg-primary py-3 text-on-primary font-medium"
//   >
//     Create Account
//   </button>
// </form>

// <p class="mt-4 text-sm text-center">
//   Already have an account?
//   <a routerLink="/auth/login" class="text-primary">Login</a>
// </p>
// `
