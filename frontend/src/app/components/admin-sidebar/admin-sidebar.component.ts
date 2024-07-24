import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent implements OnInit {
  pendingRequestsCount: number = 0;

  constructor(private adminApiService: ApiService) {}

  ngOnInit(): void {
    this.loadPendingRequestsCount();
  }

  loadPendingRequestsCount() {
    this.adminApiService.getPendingAdmins().subscribe(
      (data) => {
        this.pendingRequestsCount = data.length;
      },
      (error) => {
        console.error('Error fetching pending requests:', error);
      }
    );
  }
}
