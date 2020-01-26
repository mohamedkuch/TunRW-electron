import { Component, OnInit, OnDestroy } from '@angular/core';
import { Event } from '../events.model';
import { EventService } from '../events.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from '../../auth/auth.service';
import { Member } from '../../admin-members/member.model';
import { NotificationService } from '../../header-admin/notifications.service';

@Component({
  selector: 'app-admin-list-event',
  templateUrl: './list-event.component.html',
  styleUrls: ['./list-event.component.css']
})
export class AdminListEventsComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  currentUser: Member;
  membersList: Member[] = [];
  membersCount: number;
  private eventsSub: Subscription;
  private memberSub: Subscription;
  isLoading = false;
  totalEvents = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2 , 5, 10];
  constructor(public eventsService: EventService,
    private notificationService : NotificationService,
    private authService: AuthService) {}


  ngOnInit() {
    this.isLoading = true;
    this.eventsService.getEvent(this.postsPerPage, this.currentPage);
    this.eventsSub = this.eventsService.getEventUpdateListener()
      .subscribe(
        (eventData:{ events : Event[] ,postCount : number } ) => {
          this.isLoading = false;
          this.totalEvents = eventData.postCount;
          this.events = eventData.events;
          this.buildMembers();
        });
    this.currentUser = this.authService.getcurrentUser();
  }
  onDelete(eventId: string) {
    this.isLoading = true;
    this.eventsService.deleteEvent(eventId).subscribe(() => {
      this.eventsService.getEvent(this.postsPerPage, this.currentPage);
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

    for (let i = 0; i < this.events.length; i++) {
      for (let j = 0; j < this.membersList.length; j++) {
         if (this.events[i].creator === this.membersList[j].id) {
          this.events[i].creator = this.membersList[j].name;
         }
      }
    }


  }

  ngOnDestroy() {
    this.eventsSub.unsubscribe();
    this.memberSub.unsubscribe();
  }
  onChangePage( pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.eventsService.getEvent(this.postsPerPage, this.currentPage);
  }
}
