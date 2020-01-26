import { Component, OnInit, OnDestroy } from '@angular/core';
import { AboutText } from '../aboutText.modal';
import { AboutTextService } from '../adminText.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from '../../auth/auth.service';
import { Member } from '../../admin-members/member.model';
import { NotificationService } from '../../header-admin/notifications.service';

@Component({
  selector: 'app-admin-list-about-text',
  templateUrl: './list-about.component.html',
  styleUrls: ['./list-about.component.scss']
})
export class AdminListAboutTextComponent implements OnInit, OnDestroy {
  aboutText: AboutText[] = [];
  currentUser: Member;
  membersList: Member[] = [];
  membersCount: number;
  private aboutTextSub: Subscription;
  private memberSub: Subscription;
  isLoading = false;
  totalAboutText = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2 , 5, 10];
  constructor(public aboutTextService: AboutTextService,
    private notificationService : NotificationService,
    private authService: AuthService) {}


  ngOnInit() {
    this.isLoading = true;
    this.aboutTextService.getAboutText(this.postsPerPage, this.currentPage);
    this.aboutTextSub = this.aboutTextService.getAboutTextUpdateListener()
      .subscribe(
        (aboutTextData:{ AboutText : AboutText[] ,postCount : number } ) => {
          this.isLoading = false;
          this.totalAboutText = aboutTextData.postCount;
          this.aboutText = aboutTextData.AboutText;
          this.buildMembers();
        });
    this.currentUser = this.authService.getcurrentUser();
  }
  onDelete(aboutTextId: string) {
    this.isLoading = true;
    this.aboutTextService.deleteAboutText(aboutTextId).subscribe(() => {
      this.aboutTextService.getAboutText(this.postsPerPage, this.currentPage);
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

    for (let i = 0; i < this.aboutText.length; i++) {
      for (let j = 0; j < this.membersList.length; j++) {
         if (this.aboutText[i].creator === this.membersList[j].id) {
          this.aboutText[i].creator = this.membersList[j].name;
         }
      }
    }


  }

  ngOnDestroy() {
    this.aboutTextSub.unsubscribe();
    this.memberSub.unsubscribe();
  }
  onChangePage( pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.aboutTextService.getAboutText(this.postsPerPage, this.currentPage);
  }
}
