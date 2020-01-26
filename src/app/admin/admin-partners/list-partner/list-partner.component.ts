import { Component, OnInit, OnDestroy } from '@angular/core';
import { Partner } from '../partner.modal';
import { PartnerService } from '../partners.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from '../../auth/auth.service';
import { Member } from '../../admin-members/member.model';
import { NotificationService } from '../../header-admin/notifications.service';

@Component({
  selector: 'app-admin-list-partner',
  templateUrl: './list-partner.component.html',
  styleUrls: ['./list-partner.component.scss']
})
export class AdminListPartnersComponent implements OnInit, OnDestroy {
  partners: Partner[] = [];
  currentUser: Member;
  membersList: Member[] = [];
  membersCount: number;
  private partnersSub: Subscription;
  private memberSub: Subscription;
  isLoading = false;
  totalPartners = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2 , 5, 10];
  constructor(public partnersService: PartnerService,
    public notificationService: NotificationService,
    private authService: AuthService) {}


  ngOnInit() {
    this.isLoading = true;
    this.partnersService.getPartner(this.postsPerPage, this.currentPage);
    this.partnersSub = this.partnersService.getPartnerUpdateListener()
      .subscribe(
        (partnerData:{ partners : Partner[] ,postCount : number } ) => {
          this.isLoading = false;
          this.totalPartners = partnerData.postCount;
          this.partners = partnerData.partners;
          this.buildMembers();
        });
    this.currentUser = this.authService.getcurrentUser();
  }
  onDelete(partnerId: string) {
    this.isLoading = true;
    this.partnersService.deletePartner(partnerId).subscribe(() => {
      this.partnersService.getPartner(this.postsPerPage, this.currentPage);
      this.notificationService.getNotification(5,1);
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

    for (let i = 0; i < this.partners.length; i++) {
      for (let j = 0; j < this.membersList.length; j++) {
         if (this.partners[i].creator === this.membersList[j].id) {
          this.partners[i].creator = this.membersList[j].name;
         }
      }
    }


  }

  ngOnDestroy() {
    this.partnersSub.unsubscribe();
    this.memberSub.unsubscribe();
  }
  onChangePage( pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.partnersService.getPartner(this.postsPerPage, this.currentPage);
  }
}
