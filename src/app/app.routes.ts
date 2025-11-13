import { ProductDetailsComponent } from './shared/components/product-details/product-details.component';
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './shared/components/home/home.component';
import { CartComponent } from './shared/components/cart/cart.component';
import { CategoriesComponent } from './shared/components/categories/categories.component';
import { ProductComponent } from './shared/components/product/product.component';
import { BrandsComponent } from './shared/components/brands/brands.component';
import { authGuard } from './core/guards/auth.guard';
import { authedGuard } from './core/guards/authed.guard';
// import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
// import { VerifyCodeComponent } from './components/verify-code/verify-code.component';
// import { ShippingDetailsComponent } from './components/shipping-details/shipping-details.component';
// import { AllordersComponent } from './components/allorders/allorders.component';
// import { SubcategoriesComponent } from './components/subcategories/subcategories.component';
// import { WishlistComponent } from './components/wishlist/wishlist.component';
import { AddressesComponent } from './shared/components/addresses/addresses.component';
import { ProfileComponent } from './shared/components/profile/profile.component';
import { ResetLoggedPasswordComponent } from './features/auth/reset-logged-password/reset-logged-password.component';
import { UpdateDataComponent } from './features/auth/update-data/update-data.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { VerifyCodeComponent } from './features/auth/verify-code/verify-code.component';
import { AllordersComponent } from './features/payment/allorders/allorders.component';
import { SubcategoriesComponent } from './shared/components/subcategories/subcategories.component';
import { WishlistComponent } from './features/wishlist/wishlist.component';
import { ShippingDetailsComponent } from './features/payment/shipping-details/shipping-details.component';
import { BrandDetailsComponent } from './shared/components/brand-details/brand-details.component';

export const routes: Routes = [

    {path:'', component: AuthLayoutComponent,canActivate:[authedGuard],
        children:[
            {path:'', redirectTo:'login', pathMatch:'full'},
            {path:'login',component: LoginComponent} ,
            {path:'register',component: RegisterComponent} ,
            {path:'forgot-password', component: ForgotPasswordComponent,},
            {path:'verify-code', component: VerifyCodeComponent,},
            {path:'reset-password', component: ResetPasswordComponent },

        ] },
    {path:'', component: BlankLayoutComponent ,canActivate:[authGuard],
        children:[
            {path:'', redirectTo:'home', pathMatch:'full'},
            {path:'home',component:HomeComponent},
            {path:'cart',component:CartComponent},
            {path:'categories',component:CategoriesComponent},
            {path:'product',component:ProductComponent},
            {path:'brand',component:BrandsComponent},
            {path:'brand/:id',component:BrandDetailsComponent},
            {path:'allorders',component:AllordersComponent},
            {path:'shipping-details/:id',component:ShippingDetailsComponent},
            {path:'product-details/:id',component:ProductDetailsComponent},
            { path: 'categories/:id/subcategories', component: SubcategoriesComponent },
            { path: 'wishlist', component: WishlistComponent },
            { path: 'addresses', component: AddressesComponent },
            { path: 'profile', component: ProfileComponent },
            {path:'update-logged-password', component: ResetLoggedPasswordComponent },
            {path:'update-logged-data', component: UpdateDataComponent },

            {path:'**', component: NotfoundComponent}  

        ]},
            {path:'**', component: NotfoundComponent}  


];
