import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Event } from './events.model';
import { EventService } from './events.service';
@Component({
  selector: 'app-admin-events',
  templateUrl: './admin-events.component.html',
  styleUrls : ['./admin-events.component.css']
})
export class AdminEventsComponent implements OnInit {
  events: Event[] = [];
  private eventsSub: Subscription;
  isLoading = false;
  totalEvents = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2 , 5, 10];
  constructor(public eventsService: EventService) {}


  ngOnInit() {
    this.isLoading = true;
    this.eventsService.getEvent(this.postsPerPage, this.currentPage);
    this.eventsSub = this.eventsService.getEventUpdateListener()
      .subscribe(
        (eventData:{ events : Event[] ,postCount : number } ) => {
          this.isLoading = false;
          this.totalEvents = eventData.postCount;
          this.events = eventData.events;
        });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.eventsSub.unsubscribe();
  }
}
