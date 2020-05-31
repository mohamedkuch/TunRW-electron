import { Component , OnInit, OnDestroy } from '@angular/core';
import { Partner } from './partner.modal';
import { Subscription } from 'rxjs';
import { PartnerService } from './partners.service';
import { NotificationService } from '../header-admin/notifications.service';
@Component ({
  selector : 'app-partners-admin',
  templateUrl : './admin-partners.component.html',
  styleUrls : ['./admin-partners.component.scss']
})

export class AdminPartnersComponent implements OnInit, OnDestroy {
  partners: Partner[] = [];
  private partnersSub: Subscription;
  isLoading = false;
  totalPartners = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2 , 5, 10];
  constructor(public partnersService: PartnerService,
    public notificationService: NotificationService) {}
  

  ngOnInit() {
    this.isLoading = true;
    this.partnersService.getPartner(this.postsPerPage, this.currentPage);
    this.partnersSub = this.partnersService.getPartnerUpdateListener()
      .subscribe(
        (partnerData:{ partners : Partner[] ,postCount : number } ) => {
          this.isLoading = false;
          this.totalPartners = partnerData.postCount;
          this.partners = partnerData.partners;
        });
  }

  ngOnDestroy() {
    this.partnersSub.unsubscribe();
  }
}
