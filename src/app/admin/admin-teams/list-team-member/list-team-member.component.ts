import { Component, OnInit, OnDestroy } from '@angular/core';
import { TeamMembers } from '../teamMeambers.modal';
import { TeamMembersService } from '../teamMembers.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from '../../auth/auth.service';
import { Member } from '../../admin-members/member.model';
import { NotificationService } from '../../header-admin/notifications.service';

@Component({
  selector: 'app-admin-list-team-member',
  templateUrl: './list-team-member.component.html',
  styleUrls: ['./list-team-member.component.scss']
})
export class AdminListTeamMembersComponent implements OnInit, OnDestroy {
  teamMembers: TeamMembers[] = [];
  currentUser: Member;
  membersList: Member[] = [];
  membersCount: number;
  private teamMembersSub: Subscription;
  private memberSub: Subscription;
  isLoading = false;
  totalTeamMembers = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2 , 5, 10];
  constructor(public teamMembersService: TeamMembersService,
    private notificationService : NotificationService,
    private authService: AuthService) {}


  ngOnInit() {
    this.isLoading = true;
    this.teamMembersService.getTeamMembers(this.postsPerPage, this.currentPage);
    this.teamMembersSub = this.teamMembersService.getTeamMemberUpdateListener()
      .subscribe(
        (teamMemberData:{ teamMembers : TeamMembers[] ,postCount : number } ) => {
          this.isLoading = false;
          this.totalTeamMembers = teamMemberData.postCount;
          this.teamMembers = teamMemberData.teamMembers;
          this.buildMembers();
        });
    this.currentUser = this.authService.getcurrentUser();
  }
  onDelete(teamMeambersId: string) {
    this.isLoading = true;
    this.teamMembersService.deleteTeamMember(teamMeambersId).subscribe(() => {
      this.teamMembersService.getTeamMembers(this.postsPerPage, this.currentPage);
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

    for (let i = 0; i < this.teamMembers.length; i++) {
      for (let j = 0; j < this.membersList.length; j++) {
         if (this.teamMembers[i].creator === this.membersList[j].id) {
          this.teamMembers[i].creator = this.membersList[j].name;
         }
      }
    }


  }

  ngOnDestroy() {
    this.teamMembersSub.unsubscribe();
    this.memberSub.unsubscribe();
  }
  onChangePage( pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.teamMembersService.getTeamMembers(this.postsPerPage, this.currentPage);
  }
}
