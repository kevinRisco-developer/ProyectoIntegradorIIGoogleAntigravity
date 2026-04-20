import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { CatalogComponent } from './catalog/catalog.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-confirmation/:id', component: OrderConfirmationComponent }
];

