import { Component } from '@angular/core';
import { HerosectionComponent } from '../herosection/herosection.component';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HerosectionComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
