import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ProjectService } from 'src/app/admin/admin-projects/projects.service';
import { Project } from 'src/app/admin/admin-projects/projects.modal';
import { Subscription } from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export interface DialogData {
  project: Project;
}

@Component({
  selector : 'app-projects',
  templateUrl : './projects.component.html',
  styleUrls : ['./projects.component.css']
})
export class ProjectsComponent implements OnInit, OnDestroy{
  projects: Project[] = [];
  private projectsSub: Subscription;
  postsPerPage = 6;
  currentPage = 1;
  totalProjects = 0;
  isLoading = false;

  constructor(public dialog: MatDialog,
              public projectService: ProjectService) {
  }

  ngOnInit(): void {
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
    this.projectsSub.unsubscribe();
  }

  openDialog(tmp): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '450px',
      maxHeight: '90vh',
      data: {project: tmp}
    });

    dialogRef.afterClosed().subscribe(result => {
      var navbar = document.getElementsByClassName("navbar")[0].classList.remove("hidden");
    });
  }
}


@Component({
  selector: 'app-projects-dialog',
  templateUrl : './projects-dialog.component.html',
  styleUrls : ['./projects-dialog.component.scss']
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      if(document.getElementsByClassName("navbar")[0]) {
        document.getElementsByClassName("navbar")[0].classList.add("hidden");
      }else {
        document.getElementsByClassName("mainNavbarContainer")[0].classList.add("hidden");
      }

      dialogRef.afterClosed().subscribe(result => {
        document.getElementsByClassName("mainNavbarContainer")[0].classList.remove("hidden");
        document.getElementsByClassName("navbar")[0].classList.remove("hidden");

      });
      
    }

  onNoClick(): void {
    this.dialogRef.close();
    document.getElementsByClassName("mainNavbarContainer")[0].classList.remove("hidden");

  }

}
