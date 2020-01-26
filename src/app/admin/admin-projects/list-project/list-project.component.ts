import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from '../../auth/auth.service';
import { Member } from '../../admin-members/member.model';
import { Project } from '../projects.modal';
import { ProjectService } from '../projects.service';
import { NotificationService } from '../../header-admin/notifications.service';

@Component({
  selector: 'app-admin-list-project',
  templateUrl: './list-project.component.html',
  styleUrls: ['./list-project.component.css']
})
export class AdminListProjectsComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  currentUser: Member;
  membersList: Member[] = [];
  membersCount: number;
  private projectsSub: Subscription;
  private memberSub: Subscription;
  isLoading = false;
  totalProjects = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2 , 5, 10];
  constructor(public projectService: ProjectService,
              public notificationService : NotificationService,
              private authService: AuthService) {}


  ngOnInit() {
    this.isLoading = true;
    this.projectService.getProject(this.postsPerPage, this.currentPage);
    this.projectsSub = this.projectService.getProjectUpdateListener()
      .subscribe(
        (projectData:{ projects : Project[] ,postCount : number } ) => {
          this.isLoading = false;
          this.totalProjects = projectData.postCount;
          this.projects = projectData.projects;
          this.buildMembers();
        });
    this.currentUser = this.authService.getcurrentUser();
  }
  onDelete(projectId: string) {

    this.isLoading = true;
    this.projectService.deleteProject(projectId).subscribe(() => {
      this.projectService.getProject(this.postsPerPage, this.currentPage);
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

    for (let i = 0; i < this.projects.length; i++) {
      for (let j = 0; j < this.membersList.length; j++) {
         if (this.projects[i].creator === this.membersList[j].id) {
          this.projects[i].creator = this.membersList[j].name;
         }
      }
    }


  }

  ngOnDestroy() {
    this.projectsSub.unsubscribe();
    this.memberSub.unsubscribe();
  }
  onChangePage( pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.projectService.getProject(this.postsPerPage, this.currentPage);
  }
}
