import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './../../../shared/components/header/header';
import { Footer } from "src/shared/components/footer/footer";

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, HeaderComponent, Footer],
  standalone: true,
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayoutComponent {

}
