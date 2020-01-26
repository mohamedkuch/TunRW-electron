import { Component, OnInit, OnDestroy } from '@angular/core';
import { Partner } from 'src/app/admin/admin-partners/partner.modal';
import { Subscription } from 'rxjs';
import { PartnerService } from 'src/app/admin/admin-partners/partners.service';

@Component({
  selector : 'app-partners',
  templateUrl : './partners.component.html',
  styleUrls : ['./partners.component.css']
})
export class PartnersComponent implements OnInit, OnDestroy {
  partners: Partner[] = [];
  private partnersSub: Subscription;
  postsPerPage = 100;
  currentPage = 1;
  totalpartners = 0;
  partnersRequested = 0;

  constructor(public partnersService: PartnerService) {
    this.partnersService.getPartner(this.postsPerPage, this.currentPage);
    this.partnersSub = this.partnersService.getPartnerUpdateListener()
      .subscribe(
        (data:{partners:  Partner[], postCount : number}) =>  {
          this.partners = data.partners;
          this.totalpartners = data.postCount;
        });
    if (this.totalpartners > 0 ) {
        this.partnersRequested += this.postsPerPage;
    }
  }

  ngOnInit() {


  }
  ngOnDestroy() {
    this.partnersSub.unsubscribe();

  }


}
