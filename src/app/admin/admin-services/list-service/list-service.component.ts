
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from '../../auth/auth.service';
import { Member } from '../../admin-members/member.model';
import { Service } from '../services.modal';
import { AdminService } from '../adminService.service';
import { NotificationService } from '../../header-admin/notifications.service';

@Component({
  selector: 'app-admin-list-service',
  templateUrl: './list-service.component.html',
  styleUrls: ['./list-service.component.css']
})
export class AdminListServicesComponent implements OnInit, OnDestroy {
  services: Service[] = [];
  currentUser: Member;
  membersList: Member[] = [];
  membersCount: number;
  private servicesSub: Subscription;
  private memberSub: Subscription;
  isLoading = false;
  totalServices = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2 , 5, 10];
  constructor(public adminService: AdminService,
    public notificationService : NotificationService,
    private authService: AuthService) {}


  ngOnInit() {
    this.isLoading = true;
    this.adminService.getService(this.postsPerPage, this.currentPage);
    this.servicesSub = this.adminService.getServiceUpdateListener()
      .subscribe(
        (serviceData:{ services : Service[] ,postCount : number } ) => {
          this.isLoading = false;
          this.totalServices = serviceData.postCount;
          this.services = serviceData.services;
          this.buildMembers();
        });
    this.currentUser = this.authService.getcurrentUser();
  }
  onDelete(serviceId: string) {
    this.isLoading = true;
    this.adminService.deleteService(serviceId).subscribe(() => {
      this.adminService.getService(this.postsPerPage, this.currentPage);
      this.notificationService.getNotification(5,1);
      this.notificationService.getNotWatchedNotification();
    });
  }
  private buildMembers(){
      this.authService.getAllMembers(1000, 1);
      this.memberSub = this.authService.getMemberUpdateListener()
      .subscribe( (data:{postCount: number, Members: Member[]}) => {
        this.membersList = data.Members;
        this.membersCount = data.postCount;
        this.buildCreators();
      });
  }
  private buildCreators(){

    for (let i = 0; i < this.services.length; i++) {
      for (let j = 0; j < this.membersList.length; j++) {
         if (this.services[i].creator === this.membersList[j].id) {
          this.services[i].creator = this.membersList[j].name;
         }
      }
    }


  }

  ngOnDestroy() {
    this.servicesSub.unsubscribe();
    this.memberSub.unsubscribe();
  }
  onChangePage( pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.adminService.getService(this.postsPerPage, this.currentPage);
  }
}
