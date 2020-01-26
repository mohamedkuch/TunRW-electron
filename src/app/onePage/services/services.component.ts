import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminService } from 'src/app/admin/admin-services/adminService.service';
import { Subscription } from 'rxjs';
import { Service } from 'src/app/admin/admin-services/services.modal';


@Component({
  selector : 'app-services',
  templateUrl : './services.component.html',
  styleUrls : ['./services.component.scss']
})

export class ServicesComponent{
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

}
