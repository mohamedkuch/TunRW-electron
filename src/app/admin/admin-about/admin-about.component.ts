import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AboutText } from './aboutText.modal';
import { AboutTextService } from './adminText.service';
@Component({
  selector: 'app-admin-about',
  templateUrl: './admin-about.component.html',
  styleUrls : ['./admin-about.component.scss']
})
export class AdminAboutComponent  implements OnInit , OnDestroy {
  aboutText: AboutText[] = [];
  private aboutTextSub: Subscription;
  isLoading = false;
  totalAboutText = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2 , 5, 10];
  constructor(public aboutTextService: AboutTextService) {}


  ngOnInit() {
    this.isLoading = true;
    this.aboutTextService.getAboutText(this.postsPerPage, this.currentPage);
    this.aboutTextSub = this.aboutTextService.getAboutTextUpdateListener()
      .subscribe(
        (aboutTextData:{ AboutText : AboutText[] ,postCount : number } ) => {
          this.isLoading = false;
          this.totalAboutText = aboutTextData.postCount;
          this.aboutText = aboutTextData.AboutText;
        });
  }
 

  ngOnDestroy() {
    this.aboutTextSub.unsubscribe();
  }

}
