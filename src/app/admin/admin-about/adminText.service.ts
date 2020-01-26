import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AboutText } from './aboutText.modal';

const BACKEND_URL = environment.apiUrl + "/about";
@Injectable({providedIn: 'root'})
export class AboutTextService {
  private AboutText: AboutText[] = [];
  private aboutTextUpdated = new Subject<{AboutText: AboutText[] , postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}
  getAboutText(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, abouts: any, maxPosts: number}>(BACKEND_URL + queryParams)
      .pipe(map((data) => {
          return {
            AboutText : data.abouts.map(post => {
              return {
                id : post._id,
                text : post.text,
                creator: post.creator
              };
            }) ,
            maxPosts : data.maxPosts
        };
      }))
      .subscribe((finalData) => {
            console.log(finalData);
            this.AboutText = finalData.AboutText;
            this.aboutTextUpdated.next({AboutText: [...this.AboutText] , postCount : finalData.maxPosts});
      });
  }

  // get one About Text
  getSingleAboutText(id: string){
    return this.http.get<{_id: string;
       text: string;
        creator: string
      }>(BACKEND_URL + "/" + id);
  }

  // Add New About Text
  addAboutText(text: string) {
    const postData = new FormData();
    postData.append('text', text);

    this.http.post<{message: string, text: AboutText}>(BACKEND_URL, postData)
    .subscribe((data) => {
      this.router.navigate(['/admin/About']);
    });

  }

  // update About Text
  updateAboutText(id: string ,text: string) {
    let postData: AboutText | FormData;
    postData = {
          id : id,
          text: text,
        creator: null
    }
    this.http.put(BACKEND_URL + "/" +  id, postData)
    .subscribe((data) => {
       const updateAboutText = [...this.AboutText];
       const oldProjectIndex = updateAboutText.findIndex(p => p.id === id);
       this.router.navigate(['/admin/About']);
      });
  }

  // delete About Text
  deleteAboutText(aboutTextId: string) {
    return this.http.delete(BACKEND_URL + "/" + aboutTextId);
  }

  // Team Member Update Listener (listen on every change)
  getAboutTextUpdateListener() {
    return this.aboutTextUpdated.asObservable();
  }

}
