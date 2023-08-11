import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserLogin } from './user.model';
import { StorageService } from '../../services/storage-service.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  userLogin: UserLogin;
  loginForm !: FormGroup;
  isLoggedIn: boolean;
  isLoginFailed: boolean;
  errorMessage: any;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService
  ) {

  }
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
     }

    if (this.isLoggedIn) {
      this.router.navigate(['/products'])
    }

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  onSubmit(): void {

    this.userLogin = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    }
    this.authService.login(this.userLogin).subscribe({
      next: data => {
        this.storageService.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.router.navigateByUrl('/products');
      },
      error: err => {
        console.log(err);

        this.isLoginFailed = true;
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}

