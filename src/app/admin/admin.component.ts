import { Component , OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { NotificationService } from './header-admin/notifications.service';
import { Subscription } from 'rxjs';
import { Notification } from './header-admin/notifications.modal';
import { PageEvent } from '@angular/material';
import { Member } from './admin-members/member.model';
@Component ({
  selector : 'app-admin',
  templateUrl : './admin.component.html',
  styleUrls : ['./admin.component.css']
})

export class AdminComponent implements OnInit {

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = ['5/12', '6/12', '7/12', '8/12', '9/12', '10/12', '11/12'];
  public barChartType = 'line';
  public barChartLegend = true;
  public barChartData = [
    {data: [0, 3, 3, 2, 5, 6, 10], label: 'Projects'},
    {data: [0, 0, 1, 2, 2, 3, 4], label: 'Events'}
  ];


  isLoadingNotifications = false;
  totalNotifications = 0;
  notWatchedNotification : Number;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2 , 5, 10];

  notificationList: Notification[]= [];
  notificationSub: Subscription;
  notWatchedNotificationSub: Subscription;
  currentUser: Member;

  notWatchedPostList : any;

  constructor(private authService: AuthService,
    private notificationService : NotificationService) { }

  ngOnInit() {
    this.authService.autoAuthUser();
    this.currentUser = this.authService.getcurrentUser();
    this.isLoadingNotifications = true;
   // get notifications
    this.notificationService.getNotification(this.postsPerPage, this.currentPage);
    this.notificationSub = this.notificationService.getNotificationUpdateListener()
     .subscribe((data) => {
         this.isLoadingNotifications = false;
         this.totalNotifications = data.postCount;
         this.notificationList = data.notifications;
       });

    this.notificationService.getNotWatchedNotification();
    this.notWatchedNotificationSub = this.notificationService.getNotWatchedNotificationUpdateListener()
        .subscribe((data) => {
          this.notWatchedNotification = data.notWatchedPost;
          this.notWatchedPostList = data.notWatchedPostList;
    });
  }

  onChangePage( pageData: PageEvent){
    this.isLoadingNotifications = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.notificationService.getNotification(this.postsPerPage, this.currentPage);
  }

  watchVerification(notification){
    let watchedArray = notification.watched;

    for(let j=0; j < watchedArray.length; j++){
      if(this.currentUser.id == watchedArray[j]._id){
        return true;
      }
    }

    return false;
  }
  readAllNotifications(){
    //const allNot = this.notificationService.getNotification(this.totalNotifications, 1);

    for(let j=0; j < this.notWatchedPostList.length; j++){

      this.notificationService.updateNotification(this.notWatchedPostList[j]["_id"]);

    }


  }
}
