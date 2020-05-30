import { Component, OnInit, OnDestroy } from '@angular/core';
import { Project } from './projects.modal';
import { Subscription } from 'rxjs';
import { ProjectService } from './projects.service';
@Component({
  selector: 'app-admin-projects',
  templateUrl: './admin-projects.component.html',
  styleUrls : ['./admin-projects.component.css']
})
export class AdminProjectsComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  membersCount: number;
  private projectsSub: Subscription;
  isLoading = false;
  totalProjects = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2 , 5, 10];
  constructor(public projectService: ProjectService) {}

  ngOnInit() {
    this.isLoading = true;
    this.projectService.getProject(this.postsPerPage, this.currentPage);
    this.projectsSub = this.projectService.getProjectUpdateListener()
      .subscribe(
        (projectData:{ projects : Project[] ,postCount : number } ) => {
          this.isLoading = false;
          this.totalProjects = projectData.postCount;
          this.projects = projectData.projects;
        });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.projectsSub.unsubscribe();
  }
}
