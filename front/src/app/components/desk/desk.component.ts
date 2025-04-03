import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Desk } from '../../interfaces/desk';
import { AvailabilityService } from '../../services/availability.service';

@Component({
  selector: 'app-desk',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './desk.component.html',
  styleUrl: './desk.component.css'
})
export class DeskComponent {
  @Input({ required: true }) desk!: Desk;
}
