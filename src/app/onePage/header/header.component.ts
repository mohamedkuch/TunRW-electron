import { Component, HostListener, ElementRef } from '@angular/core';

@Component({
  selector : 'app-header',
  templateUrl : './header.component.html',
  styleUrls : ['./header.component.css']
})
export class HeaderComponent{

  constructor(public el: ElementRef) { }
  @HostListener('window:scroll', ['$event'])
    checkScroll() {
      const componentPosition = this.el.nativeElement.offsetTop
      const scrollPosition = window.pageYOffset
      console.log(scrollPosition)
    }
}
