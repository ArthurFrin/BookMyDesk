import { Component } from '@angular/core';
import { DayAvailabilityComponent } from '../../components/availability/day-availability/day-availability.component';
import { NavDateComponent } from '../../components/availability/nav-date/nav-date.component';

@Component({
  selector: 'app-day-availability-page',
  imports: [DayAvailabilityComponent, NavDateComponent],
  templateUrl: './day-availability-page.component.html',
  styleUrl: './day-availability-page.component.css'
})
export class DayAvailabilityPageComponent {

}
