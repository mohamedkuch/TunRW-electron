import { Event } from './events.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

const BACKEND_URL = environment.apiUrl + "/events";
@Injectable({ providedIn: 'root' })
export class EventService {
  private events: Event[] = [];
  private eventsUpdated = new Subject<{ events: Event[], postCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }
  // get All Event
  getEvent(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, events: any, maxPosts: number }>(BACKEND_URL + queryParams)
      .pipe(map((data) => {
        return {
          events: data.events.map(post => {
            return {
              id: post._id,
              title: post.title,
              date: post.date,
              adress: post.adress,
              description: post.description,
              imagePath: post.imagePath,
              creator: post.creator
            };
          }),
          maxPosts: data.maxPosts
        };
      }))
      .subscribe((finalData) => {
        console.log(finalData);
        this.events = finalData.events;
        this.eventsUpdated.next({ events: [...this.events], postCount: finalData.maxPosts });
      });
  }

  // get one Event
  getSingleEvent(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      date: string;
      adress: string;
      description: string;
      imagePath: Array<string>;
      creator: string
    }>(BACKEND_URL + "/" + id);
  }

  // Add New Event
  addEvent(title: string, date: string, adress: string, description: string, image: Array<string>) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('date', date);
    postData.append('adress', adress);
    postData.append('description', description);

    image.forEach(element => {
      postData.append('imagePath', element);
    });

    this.http.post<{ message: string, event: Event }>(BACKEND_URL, postData)
      .subscribe((data) => {
        this.router.navigate(['/admin/Events']);
      });

  }

  // update Event
  updateEvent(id: string, title: string, date: string, adress: string, description: string, image: Array<string>) {
    let postData: Event;

    postData = {
      id: id,
      title: title,
      date: date,
      adress: adress,
      description: description,
      imagePath: image,
      creator: null
    }
    this.http.put(BACKEND_URL + "/" + id, postData)
      .subscribe((data) => {
        this.router.navigate(['/admin/Events']);
      });
  }
  // delete Event
  deleteEvent(eventId: string) {
    return this.http.delete(BACKEND_URL + "/" + eventId);
  }

  // Event Update Listener (listen on every change)
  getEventUpdateListener() {
    return this.eventsUpdated.asObservable();
  }

}
