import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { TeamMembers } from './teamMeambers.modal';

const BACKEND_URL = environment.apiUrl + "/teamMembers";
@Injectable({ providedIn: 'root' })
export class TeamMembersService {
  private teamMembers: TeamMembers[] = [];
  private teamMembersUpdated = new Subject<{ teamMembers: TeamMembers[], postCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }
  // get All teamMembers
  getTeamMembers(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, teamMembers: any, maxPosts: number }>(BACKEND_URL + queryParams)
      .pipe(map((data) => {
        return {
          teamMembers: data.teamMembers.map(post => {
            return {
              id: post._id,
              title: post.title,
              position: post.position,
              imagePath: post.imagePath,
              creator: post.creator
            };
          }),
          maxPosts: data.maxPosts
        };
      }))
      .subscribe((finalData) => {
        console.log(finalData);
        this.teamMembers = finalData.teamMembers;
        this.teamMembersUpdated.next({ teamMembers: [...this.teamMembers], postCount: finalData.maxPosts });
      });
  }

  // get one Team Member
  getSingleTeamMember(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      position: string;
      imagePath: string;
      creator: string
    }>(BACKEND_URL + "/" + id);
  }

  // Add New Team Member
  addTeamMember(title: string, position: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('position', position);
    postData.append('image', image, title);
    console.log("adding Team member", title, image, position);

    this.http.post<{ message: string, teamMembers: TeamMembers }>(BACKEND_URL, postData)
      .subscribe((data) => {
        this.router.navigate(['/admin/About']);
      });

  }

  // update Team Member
  updateTeamMember(id: string, title: string, position: string, image: File | string) {
    let postData: TeamMembers | FormData;
    if (typeof (image) === 'object') {

      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("position", position);
      postData.append("image", image, title);

    } else {
      postData = {
        id: id,
        title: title,
        position: position,
        imagePath: image,
        creator: null
      }


    }
    this.http.put(BACKEND_URL + "/" + id, postData)
      .subscribe((data) => {
        const updatedTeamMembers = [...this.teamMembers];
        const oldProjectIndex = updatedTeamMembers.findIndex(p => p.id === id);
        this.router.navigate(['/admin/About']);
      });
  }

  // delete Team Member
  deleteTeamMember(teamMemberId: string) {
    return this.http.delete(BACKEND_URL + "/" + teamMemberId);
  }

  // Team Member Update Listener (listen on every change)
  getTeamMemberUpdateListener() {
    return this.teamMembersUpdated.asObservable();
  }

}
