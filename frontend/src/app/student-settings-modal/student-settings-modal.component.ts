import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { StudentApiService } from '../student-api.service';

@Component({
  selector: 'app-student-settings-modal',
  templateUrl: './student-settings-modal.component.html',
  styleUrls: ['./student-settings-modal.component.scss']
})
export class StudentSettingsModalComponent implements OnInit {
  @Input() isActive: boolean = false;
  user: any = {};
  isEditing: { [key: string]: boolean } = { name: false, email: false };
  currentPasswordError: string = '';
  isCurrentPasswordValid: boolean = false;

  constructor(private apiService: StudentApiService) {}

  ngOnInit(): void {
    this.apiService.getUserInfo().subscribe(data => {
      this.user = data;
    }, error => {
      console.error('There was an error fetching user info:', error);
    });
  }

  closeModal() {
    this.isActive = false;
  }

  toggleEdit(field: string) {
    this.isEditing[field] = !this.isEditing[field];
  }

  checkCurrentPassword() {
    if (this.user.currentPassword) {
      this.apiService.checkPassword(this.user.currentPassword).subscribe({
        next: (response) => {
          this.isCurrentPasswordValid = true;
          this.currentPasswordError = '';
        },
        error: (error) => {
          this.isCurrentPasswordValid = false;
          this.currentPasswordError = 'Current password is incorrect';
        }
      });
    }
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.apiService.updateProfile(this.user).subscribe({
      next: (response) => {
        console.log('Profile updated:', response);
        this.closeModal();
      },
      error: (error) => {
        console.error('Failed to update profile:', error);
      }
    });
  }
}
