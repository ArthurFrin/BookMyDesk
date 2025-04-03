import { Component, OnInit, inject, signal } from '@angular/core';
import { AvailabilityService } from '../../services/availability.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DeskComponent } from '../desk/desk.component';
import { Desk } from '../../interfaces/desk';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-day-availability',
  standalone: true,
  imports: [CommonModule, DeskComponent],
  templateUrl: './day-availability.component.html',
  styleUrl: './day-availability.component.css'
})
export class DayAvailabilityComponent implements OnInit {

  availabilityService = inject(AvailabilityService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  currentUser = inject(AuthService).getCurrentUser();

  desks = signal<Desk[]>([]);
  currentReservedDesk: Desk | null = null; // Variable to track the currently reserved desk

  selectedDate: string | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.selectedDate = params.get('date');

        if (!this.selectedDate) {
          this.router.navigate(['/']);
          return;
        }

        this.availabilityService.getAvailableDesksForDay(this.selectedDate, this.currentUser!.id).subscribe({
          next: (data) => {
            this.desks.set(data.desks);
            // Identify if the user already has a reserved desk
            this.currentReservedDesk = data.desks.find(desk =>
              desk.status === 'user-reserved') || null;
          },
          error: (error) => {
            console.error('Error loading availability:', error);
            this.router.navigate(['/']);
          }
        });
      }
    });
  }

  deskAction(desk: Desk): void {
    if (desk.status === 'disabled') {
      return;
    }

    if (desk.status === 'available') {
      // Check if the user already has a reserved desk
      const previousReservedDesk = this.currentReservedDesk;

      if (previousReservedDesk) {
        // Cancel the previous reservation before making a new one
        this.availabilityService.unfollowDesk(previousReservedDesk.id, this.currentUser!.id, this.selectedDate!).subscribe({
          next: () => {
            previousReservedDesk.status = 'available';
            previousReservedDesk.userId = undefined;
            previousReservedDesk.userName = undefined; // Reset the user's name

            // Then reserve the new desk
            this.reserveNewDesk(desk);
          },
          error: (error: any) => {
            console.error('Error canceling the previous reservation:', error);
          }
        });
      } else {
        // No reserved desk, proceed directly to reservation
        this.reserveNewDesk(desk);
      }
    } else if (desk.status === 'user-reserved') {
      this.availabilityService.unfollowDesk(desk.id, this.currentUser!.id, this.selectedDate!).subscribe({
        next: () => {
          desk.status = 'available';
          desk.userId = undefined;
          desk.userName = undefined; // Reset the user's name
          this.currentReservedDesk = null; // Update the reserved desk tracking
        },
        error: (error: any) => {
          console.error('Error canceling the desk reservation:', error);
        }
      });
    }
  }

  private reserveNewDesk(desk: Desk): void {
    this.availabilityService.reserveDesk(desk.id, this.currentUser!.id, this.selectedDate!).subscribe({
      next: () => {
        desk.status = 'user-reserved';
        desk.userId = this.currentUser!.id;
        desk.userName = `${this.currentUser!.firstName} ${this.currentUser!.lastName}`; // Add the user's name
        this.currentReservedDesk = desk; // Update the currently reserved desk
      },
      error: (error: any) => {
        console.error('Error reserving the desk:', error);
      }
    });
  }
}
