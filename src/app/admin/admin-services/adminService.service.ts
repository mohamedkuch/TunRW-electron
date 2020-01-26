import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Service } from './services.modal';
import { ICON_REGISTRY_PROVIDER } from '@angular/material';

const BACKEND_URL = environment.apiUrl + "/services";
@Injectable({providedIn: 'root'})
export class AdminService {
  private services: Service[] = [];
  private servicesUpdated = new Subject<{services: Service[] , postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}
  // get All Services
  getService(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, services: any, maxPosts: number}>(BACKEND_URL + queryParams)
      .pipe(map((data) => {
          return {
            services : data.services.map(post => {
              return {
                id : post._id,
                title : post.title,
                icon: post.icon,
                description : post.description,
                creator: post.creator
              };
            }) ,
            maxPosts : data.maxPosts
        };
      }))
      .subscribe((finalData) => {
            console.log(finalData);
            this.services = finalData.services;
            this.servicesUpdated.next({services: [...this.services] , postCount : finalData.maxPosts});
      });
  }

  // get one service
  getSingleService(id: string){
    return this.http.get<{_id: string;
        title: string;
        icon: string;
        description: string;
        creator: string
      }>(BACKEND_URL + "/" + id);
  }

  // Add New Service
  addService(title: string,description: string, icon:string) {
    let postData: any;
    postData = {
         title: title,
         icon:icon,
         description: description
    }
    this.http.post<{message: string, service: Service}>(BACKEND_URL, postData)
    .subscribe((data) => {
      this.router.navigate(['/admin/Services']);
    });

  }

  // update Service
  updateService(id: string ,title: string,description: string, icon:string) {
    let postData: Service | FormData;
       postData = {
            id : id,
            title: title,
            icon: icon ,
            description: description,
        creator: null
      }
    this.http.put(BACKEND_URL + "/" +  id, postData)
    .subscribe((data) => {
       const updatedServices = [...this.services];
       const oldServiceIndex = updatedServices.findIndex(p => p.id === id);
       this.router.navigate(['/admin/Services']);
      });
  }

  // delete Service
  deleteService(serviceId: string) {
    return this.http.delete(BACKEND_URL + "/" + serviceId);
  }

  // Service Update Listener (listen on every change)
  getServiceUpdateListener() {
    return this.servicesUpdated.asObservable();
  }

}
