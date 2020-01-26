import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { AuthService } from '../../auth/auth.service';
import { Member } from '../../admin-members/member.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-list-members',
  templateUrl: './list-members.component.html',
  styleUrls: ['./list-members.component.css']
})
export class AdminMemberListComponent implements OnInit, OnDestroy {

  currentUser: Member;
  membersList: Member[] = [];
  membersCount: number;
  totalEvents = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2 , 5, 10, 1000];

  private MembersListSub: Subscription;
  isLoading = false;
  constructor( private authService: AuthService) {}


  ngOnInit() {
    this.isLoading = true;
    this.currentUser = this.authService.getcurrentUser();
    this.authService.getAllMembers(this.postsPerPage, this.currentPage);
    this.MembersListSub = this.authService.getMemberUpdateListener()
      .subscribe(
        (data:{postCount: number, Members: Member[]}) => {
          this.isLoading = false;
          this.membersCount = data.postCount;
          this.membersList = data.Members;
        });
  }
  onDelete(memberId: string) {
  }
  ngOnDestroy(){
  }
  onChangePage( pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.authService.getAllMembers(this.postsPerPage, this.currentPage);
  }
}
