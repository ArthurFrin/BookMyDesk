import { Component } from '@angular/core';
import { CalendarComponent } from '../../components/calendar/calendar.component'

@Component({
  selector: 'app-home-page',
  imports: [CalendarComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {


}
