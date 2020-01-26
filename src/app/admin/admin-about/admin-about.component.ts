import { Component, OnInit, OnDestroy } from '@angular/core';
import { TeamMembers } from './teamMeambers.modal';
import { Subscription } from 'rxjs';
import { TeamMembersService } from './teamMembers.service';
@Component({
  selector: 'app-admin-about',
  templateUrl: './admin-about.component.html',
  styleUrls : ['./admin-about.component.scss']
})
export class AdminAboutComponent implements OnInit , OnDestroy{
  teamMembers: TeamMembers[] = [];
  private teamMembersSub: Subscription;
  isLoading = false;
  totalTeamMembers = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2 , 5, 10];
  constructor(public teamMembersService: TeamMembersService) {}


  ngOnInit() {
    this.isLoading = true;
    this.teamMembersService.getTeamMembers(this.postsPerPage, this.currentPage);
    this.teamMembersSub = this.teamMembersService.getTeamMemberUpdateListener()
      .subscribe(
        (teamMembersData:{ teamMembers : TeamMembers[] ,postCount : number } ) => {
          this.isLoading = false;
          this.totalTeamMembers = teamMembersData.postCount;
          this.teamMembers = teamMembersData.teamMembers;
        });
  }

  ngOnDestroy(): void {
    this.teamMembersSub.unsubscribe();
  }
}
