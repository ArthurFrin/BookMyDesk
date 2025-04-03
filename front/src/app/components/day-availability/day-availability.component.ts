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
  currentReservedDesk: Desk | null = null; // Variable pour suivre le bureau actuellement réservé

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
            // Identifier si l'utilisateur a déjà un bureau réservé
            this.currentReservedDesk = data.desks.find(desk =>
              desk.status === 'user-reserved') || null;
            console.log('Bureaux disponibles:', data);
          },
          error: (error) => {
            console.error('Erreur lors du chargement des disponibilités:', error);
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
      // Vérifier si l'utilisateur a déjà un bureau réservé
      const previousReservedDesk = this.currentReservedDesk;

      if (previousReservedDesk) {
        // Annuler la réservation précédente avant d'en faire une nouvelle
        this.availabilityService.unfollowDesk(previousReservedDesk.id, this.currentUser!.id, this.selectedDate!).subscribe({
          next: () => {
            previousReservedDesk.status = 'available';
            previousReservedDesk.userId = undefined;
            previousReservedDesk.userName = undefined; // Réinitialiser le nom de l'utilisateur

            // Puis réserver le nouveau bureau
            this.reserveNewDesk(desk);
          },
          error: (error: any) => {
            console.error('Erreur lors de l\'annulation de la réservation précédente:', error);
          }
        });
      } else {
        // Aucun bureau réservé, procéder directement à la réservation
        this.reserveNewDesk(desk);
      }
    } else if (desk.status === 'user-reserved') {
      this.availabilityService.unfollowDesk(desk.id, this.currentUser!.id, this.selectedDate!).subscribe({
        next: () => {
          desk.status = 'available';
          desk.userId = undefined;
          desk.userName = undefined; // Réinitialiser le nom de l'utilisateur
          this.currentReservedDesk = null; // Mettre à jour le suivi du bureau réservé
        },
        error: (error: any) => {
          console.error('Erreur lors de l\'annulation de la réservation du bureau:', error);
        }
      });
    }
  }

  private reserveNewDesk(desk: Desk): void {
    this.availabilityService.reserveDesk(desk.id, this.currentUser!.id, this.selectedDate!).subscribe({
      next: () => {
        desk.status = 'user-reserved';
        desk.userId = this.currentUser!.id;
        desk.userName = `${this.currentUser!.firstName} ${this.currentUser!.lastName}`; // Ajouter le nom de l'utilisateur
        this.currentReservedDesk = desk; // Mettre à jour le bureau actuellement réservé
      },
      error: (error: any) => {
        console.error('Erreur lors de la réservation du bureau:', error);
      }
    });
  }
}
