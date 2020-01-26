import { Component , OnInit, OnDestroy} from '@angular/core';
import { Event } from '../../admin/admin-events/events.model';
import { EventService } from '../../admin/admin-events/events.service';
import { Subscription } from 'rxjs';

@Component({
  selector : 'app-events',
  templateUrl : './events.component.html',
  styleUrls : ['./events.component.css']
})
export class EventsComponent implements OnInit , OnDestroy{
  events: Event[] = [];
  private eventsSub: Subscription;
  postsPerPage = 2;
  currentPage = 1;
  totalEvents = 0;
  eventsRequested = 0;
   
  slideConfig = {
    "slidesToShow": 1, 
    "slidesToScroll": 1,
    "dots":true,
  
    "autoplay":true, 
    "autoplaySpeed": 2500,
    "infinite": true,
    "arrows": false

  };

  constructor(public eventsService: EventService) {
    this.eventsService.getEvent(this.postsPerPage, this.currentPage);
    this.eventsSub = this.eventsService.getEventUpdateListener()
      .subscribe(
        (data:{events:  Event[], postCount : number}) =>  {
          this.events = data.events;
          this.totalEvents = data.postCount;
        });
    if (this.totalEvents > 0 ) {
        this.eventsRequested += this.postsPerPage;
    }

  }

  ngOnInit() {


  }
  onLoadMoreEvent(){
    if(this.eventsRequested < this.totalEvents ) {
      this.postsPerPage += 2;
      this.eventsService.getEvent(this.postsPerPage, this.currentPage);
      this.eventsRequested += this.postsPerPage;
    }
  }
  ngOnDestroy() {
    this.eventsSub.unsubscribe();
    
  }
}
