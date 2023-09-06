import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserRegister } from '../users/user.model';
import { AuthService } from 'src/services/auth.service';
import { StorageService } from 'src/services/storage-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {
  registerForm!: FormGroup; isLoginFailed: boolean;
  isLoggedIn: boolean;
  userRegistre: UserRegister;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) {

  }

  ngOnInit(): void {

    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    }
    if (this.isLoggedIn) {
      this.router.navigate(['/products'])
    }
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }
  onSubmit(): void {

    this.userRegistre = {
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      username: this.registerForm.value.username,
      password: this.registerForm.value.password
    }
    this.authService.register(this.userRegistre).subscribe({
      next: data => {
        this.storageService.saveUser(data);
        console.log(data);
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
