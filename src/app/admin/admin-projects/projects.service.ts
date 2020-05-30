import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Project } from './projects.modal';

const BACKEND_URL = environment.apiUrl + "/projects";
@Injectable({ providedIn: 'root' })
export class ProjectService {
  private projects: Project[] = [];
  private projectsUpdated = new Subject<{ projects: Project[], postCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }
  // get All Projects
  getProject(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, projects: any, maxPosts: number }>(BACKEND_URL + queryParams)
      .pipe(map((data) => {
        return {
          projects: data.projects.map(post => {
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
        this.projects = finalData.projects;
        this.projectsUpdated.next({ projects: [...this.projects], postCount: finalData.maxPosts });
      });
  }

  // get one Project
  getSingleProject(id: string) {
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

  // Add New Project
  addProject(title: string, date: string, adress: string, description: string, image: Array<string>) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('date', date);
    postData.append('adress', adress);
    postData.append('description', description);

    for (var i = 0; i < image.length; i++) {
      var file = image[i];
      // Add the file to the request.
      postData.append('image', file, title);
    }

    this.http.post<{ message: string, project: Project }>(BACKEND_URL, postData)
      .subscribe((data) => {
        this.router.navigate(['/admin/Projects']);
      });

  }

  // update Project
  updateProject(id: string, title: string, date: string, adress: string, description: string, image: Array<string>) {
    let postData: Project;

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
        this.router.navigate(['/admin/Projects']);
      });
  }

  // delete Project
  deleteProject(projectId: string) {
    return this.http.delete(BACKEND_URL + "/" + projectId);
  }

  // Project Update Listener (listen on every change)
  getProjectUpdateListener() {
    return this.projectsUpdated.asObservable();
  }

}
