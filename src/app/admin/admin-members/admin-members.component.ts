import { Component , OnInit, OnDestroy } from '@angular/core';
import { Member } from './member.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
@Component ({
  selector : 'app-members-admin',
  templateUrl : './admin-members.component.html',
  styleUrls : ['./admin-members.component.css']
})

export class MembersAdminComponent implements OnInit , OnDestroy {
  membersList: Member[] = [];
  membersCount: number;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2 , 5, 10, 1000];

  private MembersListSub: Subscription;
  isLoading = false;
  constructor( private authService: AuthService) {}

  
  ngOnInit() {
    this.isLoading = true;
    this.authService.getAllMembers(this.postsPerPage, this.currentPage);
    this.MembersListSub = this.authService.getMemberUpdateListener()
      .subscribe(
        (data:{postCount: number, Members: Member[]}) => {
          this.isLoading = false;
          this.membersCount = data.postCount;
          this.membersList = data.Members;
        });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.MembersListSub.unsubscribe();
  }

}
