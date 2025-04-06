import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})
export class PopupComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() buttonText: string = 'OK';
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() buttonClick = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  xIcon = X;

  closePopup(): void {
    this.close.emit();
  }

  onButtonClick(): void {
    this.buttonClick.emit();
    this.closePopup();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    // Ferme le popup si on clique à l'extérieur
    if (this.isOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.closePopup();
    }
  }

  // Empêche la propagation du clic dans le contenu du popup
  onPopupContentClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
