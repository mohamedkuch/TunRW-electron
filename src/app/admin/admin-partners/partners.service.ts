import { Partner } from './partner.modal';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

const BACKEND_URL = environment.apiUrl + "/partners";
@Injectable({providedIn: 'root'})
export class PartnerService {
  private partners: Partner[] = [];
  private partnersUpdated = new Subject<{partners: Partner[] , postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}
  // get All Partners
  getPartner(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, partners: any, maxPosts: number}>(BACKEND_URL + queryParams)
      .pipe(map((data) => {
          return {
            partners : data.partners.map(post => {
              return {
                id : post._id,
                title : post.title,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }) ,
            maxPosts : data.maxPosts
        };
      }))
      .subscribe((finalData) => {
            console.log(finalData);
            this.partners = finalData.partners;
            this.partnersUpdated.next({partners: [...this.partners] , postCount : finalData.maxPosts});
      });
  }

  // get one Partner
  getSinglePartner(id: string){
    return this.http.get<{_id: string;
        title: string;
        imagePath: string;
        creator: string
      }>(BACKEND_URL + "/" + id);
  }

  // Add New Partner
  addPartner(title: string,  image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('image', image, title);
    console.log("adding partner", postData);
    this.http.post<{message: string, partner: Partner}>(BACKEND_URL, postData)
    .subscribe((data) => {
      this.router.navigate(['/admin/Partners']);
    });

  }

  // update Partner
  updatePartner(id: string ,title: string,  image: File | string) {
    let postData: Partner | FormData;
    if(typeof(image) === 'object') {
       postData = new FormData();
      postData.append("title", title);
      postData.append("id", id);
      postData.append("image", image, title);

    } else {
       postData = {
            id : id,
            title: title,
            imagePath: image,
            creator: null
      }
    }
    this.http.put(BACKEND_URL + "/" +  id, postData)
    .subscribe((data) => {
       const updatedPartners = [...this.partners];
       const oldPartnerIndex = updatedPartners.findIndex(p => p.id === id);
       this.router.navigate(['/admin/Partners']);
      });
  }

  // delete Partner
  deletePartner(partnerId: string) {
    return this.http.delete(BACKEND_URL + "/" + partnerId);
  }

  // Partner Update Listener (listen on every change)
  getPartnerUpdateListener() {
    return this.partnersUpdated.asObservable();
  }

}
