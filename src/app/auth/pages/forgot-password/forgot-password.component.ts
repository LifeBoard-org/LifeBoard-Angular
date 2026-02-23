import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <h2 class="text-xl font-semibold text-primary mb-6">
      Reset Password
    </h2>

    <form [formGroup]="form" class="space-y-4">
      <input
        type="email"
        placeholder="Email"
        formControlName="email"
        class="w-full rounded-lg border border-outline px-3 py-2 bg-transparent"
      />

      <button
        type="button"
        (click)="reset()"
        class="w-full rounded-xl bg-primary py-3 text-on-primary font-medium"
      >
        Send Reset Link
      </button>
    </form>

    <p class="mt-4 text-sm text-center">
      <a routerLink="/auth/login" class="text-primary">Back to login</a>
    </p>
  `
})
export class ForgotPasswordComponent {
  form: FormGroup
  private fb = inject(FormBuilder);
  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }


  reset() {
    console.log(this.form.value);
  }
}
