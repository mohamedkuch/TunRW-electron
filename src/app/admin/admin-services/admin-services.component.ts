import { Component, OnInit, OnDestroy } from '@angular/core';
import { Service } from './services.modal';
import { Subscription } from 'rxjs';
import { AdminService } from './adminService.service';
@Component({
  selector: 'app-admin-services',
  templateUrl: './admin-services.component.html',
  styleUrls : ['./admin-services.component.scss']
})
export class AdminServicesComponent implements OnInit, OnDestroy{

  services: Service[] = [];
  membersCount: number;
  private servicesSub: Subscription;
  isLoading = false;
  totalServices = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2 , 5, 10];
  constructor(public adminService: AdminService) {}


  ngOnInit() {
    this.isLoading = true;
    this.adminService.getService(this.postsPerPage, this.currentPage);
    this.servicesSub = this.adminService.getServiceUpdateListener()
      .subscribe(
        (serviceData:{ services : Service[] ,postCount : number } ) => {
          this.isLoading = false;
          this.totalServices = serviceData.postCount;
          this.services = serviceData.services;
        });
  }

  ngOnDestroy(): void {
    this.servicesSub.unsubscribe();
  }

}
