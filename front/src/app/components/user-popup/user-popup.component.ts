import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../interfaces/user';
import { v4 as uuidv4 } from 'uuid';
import { LucideAngularModule, RefreshCcw } from 'lucide-angular';

@Component({
  selector: 'app-user-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule
  ],
  templateUrl: './user-popup.component.html',
  styleUrl: './user-popup.component.css'
})
export class UserPopupComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);

  @Input() isOpen = false;
  @Input() isEditing = false;
  @Input() user: User | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  userForm: FormGroup;

  RefreshCcw = RefreshCcw;

  constructor() {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      isAdmin: [false],
      photoUrl: ['https://api.dicebear.com/9.x/thumbs/svg?seed=' + uuidv4()]
    });
  }

  ngOnInit(): void {
    this.resetForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.patchFormWithUserData();
    }

    if (changes['isOpen'] && this.isOpen && !this.isEditing) {
      this.resetForm();
    }
  }

  private patchFormWithUserData(): void {
    if (this.user) {
      this.userForm.patchValue({
        email: this.user.email,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        isAdmin: this.user.isAdmin || false,
        photoUrl: this.user.photoUrl
      });
    }
  }

  resetForm(): void {
    if (!this.isEditing) {
      this.userForm.reset({
        email: '',
        firstName: '',
        lastName: '',
        isAdmin: false,
        photoUrl: 'https://api.dicebear.com/9.x/thumbs/svg?seed=' + uuidv4()
      });
    }
  }

  generateNewAvatar(): void {
    this.userForm.patchValue({
      photoUrl: 'https://api.dicebear.com/9.x/thumbs/svg?seed=' + uuidv4()
    });
  }

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    if (this.userForm.valid) {
      this.save.emit(this.userForm.value);
    }
  }

  onBackdropClick(event: MouseEvent): void {
    // Si l'élément cliqué est directement le backdrop (conteneur principal)
    // et non pas un de ses enfants, alors on ferme la popup
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
