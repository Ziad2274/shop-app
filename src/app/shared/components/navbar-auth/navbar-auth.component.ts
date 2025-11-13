import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-navbar-auth',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar-auth.component.html',
  styleUrl: './navbar-auth.component.scss'
})
export class NavbarAuthComponent {

}
