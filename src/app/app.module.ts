import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';
import { CategoriesComponent } from './categories/categories.component';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { AuthInterceptor } from './auth-interceptor.interceptor';
import { UsersComponent } from './users/users.component';
import { OrderComponent } from './order/order.component';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "products", component: ProductsComponent },
  { path: "categories", component: CategoriesComponent },
  { path: "signup", component: LoginFormComponent },
  { path: "register", component:RegisterFormComponent },
  { path: "users", component:UsersComponent },
  { path: "orders", component:OrderComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    CategoriesComponent,
    LoginFormComponent,
    RegisterFormComponent,
    UsersComponent,
    OrderComponent,
    DashboardComponent,
    
  ],
  imports: [
    CanvasJSAngularChartsModule,
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  
  providers: [  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, ],
  bootstrap: [AppComponent]
})

export class AppModule {}
