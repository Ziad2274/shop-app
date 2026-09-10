import { ProductDetailsComponent } from './shared/components/product-details/product-details.component';
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './shared/components/home/home.component';
import { CartComponent } from './shared/components/cart/cart.component';
import { ProductComponent } from './shared/components/product/product.component';
import { authGuard } from './core/guards/auth.guard';
import { authedGuard } from './core/guards/authed.guard';
import { ProfileComponent } from './shared/components/profile/profile.component';
import { ChangePasswordComponent } from './features/auth/change-password/change-password.component';
import { AddressesComponent } from './features/addresses/addresses.component';
import { CheckoutComponent } from './features/payment/checkout/checkout.component';
import { OrderDetailsComponent } from './features/payment/order-details/order-details.component';
import { AllordersComponent } from './features/payment/allorders/allorders.component';
import { WishlistComponent } from './features/wishlist/wishlist.component';

export const routes: Routes = [

    {path:'', component: AuthLayoutComponent,canActivate:[authedGuard],
        children:[
            {path:'', redirectTo:'login', pathMatch:'full'},
            {path:'login',component: LoginComponent} ,
            {path:'register',component: RegisterComponent} ,
            // Forgot/reset-password flow removed: zizo-shop's AuthController
            // has no matching endpoints yet.
        ] },
    {path:'', component: BlankLayoutComponent ,canActivate:[authGuard],
        children:[
            {path:'', redirectTo:'home', pathMatch:'full'},
            {path:'home',component:HomeComponent},
            {path:'cart',component:CartComponent},
            {path:'product',component:ProductComponent},
            {path:'allorders',component:AllordersComponent},
            {path:'product-details/:id',component:ProductDetailsComponent},
            { path: 'wishlist', component: WishlistComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'change-password', component: ChangePasswordComponent },
            { path: 'addresses', component: AddressesComponent },
            { path: 'checkout', component: CheckoutComponent },
            { path: 'order-details/:id', component: OrderDetailsComponent },
            // Categories, subcategories, brands, addresses, checkout, and
            // profile/password-update pages were removed: zizo-shop has no
            // backend controllers for any of them yet.

            {path:'**', component: NotfoundComponent}

        ]},
            {path:'**', component: NotfoundComponent}


];
