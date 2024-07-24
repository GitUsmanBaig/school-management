import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-admin-requests',
  templateUrl: './admin-requests.component.html',
  styleUrls: ['./admin-requests.component.scss']
})
export class AdminRequestsComponent implements OnInit {
  pendingAdmins: any[] = [];

  constructor(private adminApiService: ApiService) {}

  ngOnInit(): void {
    this.loadPendingAdmins();
  }

  loadPendingAdmins() {
    this.adminApiService.getPendingAdmins().subscribe(
      (data) => {
        this.pendingAdmins = data;
      },
      (error) => {
        console.error('Error fetching pending admins:', error);
      }
    );
  }

  approveAdmin(id: string) {
    this.adminApiService.approveAdmin(id).subscribe(
      (response) => {
        this.pendingAdmins = this.pendingAdmins.filter(admin => admin._id !== id);
      },
      (error) => {
        console.error('Error approving admin:', error);
      }
    );
  }
}
