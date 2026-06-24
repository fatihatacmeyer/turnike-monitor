import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  defaultAuth: any = { email: '', password: '' };
  loginForm!: FormGroup;
  hasError: boolean = false;
  returnUrl: string = '/';
  isLoading: boolean = false;
  private unsubscribe: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  get f() { return this.loginForm.controls; }

  initForm() {
    this.loginForm = this.fb.group({
      email: [this.defaultAuth.email, [Validators.required, Validators.minLength(3), Validators.maxLength(320)]],
      password: [this.defaultAuth.password, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });

    const formChangesSub = this.loginForm.valueChanges.subscribe(() => {
      if (this.hasError) {
        this.hasError = false;
        this.cdr.detectChanges();
      }
    });
    this.unsubscribe.push(formChangesSub);
  }

  submit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.hasError = false;
    this.isLoading = true;
    this.cdr.detectChanges();

    const loginSub = this.authService.login(this.f['email'].value, this.f['password'].value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate([this.returnUrl]);
        },
        error: () => {
          this.hasError = true;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        complete: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });

    this.unsubscribe.push(loginSub);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(sb => sb.unsubscribe());
  }
}
