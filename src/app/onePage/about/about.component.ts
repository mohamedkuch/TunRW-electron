import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { TeamMembers } from 'src/app/admin/admin-about/teamMeambers.modal';
import { Subscription } from 'rxjs';
import { TeamMembersService } from 'src/app/admin/admin-about/teamMembers.service';
import { AboutText } from 'src/app/admin/admin-about/aboutText.modal';
import { AboutTextService } from 'src/app/admin/admin-about/adminText.service';

@Component({
  selector : 'app-about',
  templateUrl : './about.component.html',
  styleUrls : ['./about.component.scss']
})

export class AboutComponent implements AfterViewInit, OnInit, OnDestroy{

  @ViewChild('slickModal', {static: false}) slickModal: SlickCarouselComponent;
  title = 'ngSlick';
  teamMembers: TeamMembers[] = [];
  aboutText: AboutText[] = [];
  private teamMembersSub: Subscription;
  private aboutTextSub: Subscription;
  isLoading = false;
  totalTeamMembers = 0;
  totalAboutText = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2 , 5, 10];
 

 
  slideConfig = {
    "slidesToShow": 3, 
    "slidesToScroll": 1,
    "dots":true,
    "autoplay":true, "autoplaySpeed": 1800,
    "infinite": true,
    "arrows": false,
    "responsive": [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 540,
        settings: {
          slidesToShow: 1
        }
      }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  };
  constructor(public teamMembersService:TeamMembersService,
              private aboutTextService: AboutTextService){
   
  }
  ngOnInit() {
    this.isLoading = true;
    this.teamMembersService.getTeamMembers(this.postsPerPage, this.currentPage);
    this.teamMembersSub = this.teamMembersService.getTeamMemberUpdateListener()
      .subscribe(
        (teamMemberData:{ teamMembers : TeamMembers[] ,postCount : number } ) => {
          this.isLoading = false;
          this.totalTeamMembers = teamMemberData.postCount;
          this.teamMembers = teamMemberData.teamMembers;
          console.log("teamMembers", this.teamMembers);
        });
    this.aboutTextService.getAboutText(100,1);
    this.aboutTextSub = this.aboutTextService.getAboutTextUpdateListener()
      .subscribe(
        (AboutTextData:{ AboutText : AboutText[] ,postCount : number } ) => {
          this.isLoading = false;
          this.totalAboutText = AboutTextData.postCount;
          this.aboutText = AboutTextData.AboutText;
          console.log("teamMembers", this.aboutText);
        });
  }
  ngOnDestroy() {
    this.teamMembersSub.unsubscribe();
  }
  ngAfterViewInit(): void {
    //this.slickModal.slickGoTo(3);
  }
  addSlide() {
    //this.slides.push({img: "http://placehold.it/350x150/777777"})
  }
  
  removeSlide() {
    //this.slides.length = this.slides.length - 1;
  }
  
  slickInit(e) {
    // console.log('slick initialized');
  }
  
  breakpoint(e) {
    //console.log('breakpoint');
  }
  
  afterChange(e) {
    //console.log('afterChange');
  }
  
  beforeChange(e) {
    //console.log('beforeChange');
  }
 
}

