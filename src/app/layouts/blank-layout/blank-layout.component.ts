import { Component } from '@angular/core';
import { NavbarHomeComponent } from "../../shared/components/navbar-home/navbar-home.component";
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "../../shared/components/footer/footer.component";

@Component({
  selector: 'app-blank-layout',
  standalone: true,
  imports: [NavbarHomeComponent, RouterOutlet, FooterComponent],
  templateUrl: './blank-layout.component.html',
  styleUrl: './blank-layout.component.scss'
})
export class BlankLayoutComponent {

}
