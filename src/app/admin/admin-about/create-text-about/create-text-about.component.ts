import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from '../../mime-type.validator';
import { AboutText } from '../aboutText.modal';
import { AboutTextService } from '../adminText.service';
@Component ({
  selector : 'app-create-text-about',
  templateUrl : './create-text-about.component.html',
  styleUrls : ['./create-text-about.component.scss']
})


export class CreateAboutTextComponent implements OnInit {
  text = '';
  mode = 'create';
  private aboutTextId: string;
  errorFlag = false;
  aboutText: AboutText;
  isLoading = false;
  form: FormGroup;

  constructor(public aboutTextService: AboutTextService,
              public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      text : new FormControl(null, {validators: [Validators.required , Validators.minLength(0)]})
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('aboutTextId')) {
        this.mode = 'edit';
        this.aboutTextId = paramMap.get('aboutTextId');
        this.isLoading = true;
        this.aboutTextService.getSingleAboutText(this.aboutTextId).subscribe(postData => {
          this.isLoading = false;
          this.aboutText = {id: postData._id, text: postData.text , creator:postData.creator};
          this.form.setValue({text: this.aboutText.text });
        });
      } else {
        this.mode = 'create';
        this.aboutTextId = null;
      }
    });
  }
  onSaveAboutText() {
    if (this.form.invalid) {
      this.errorFlag = true;
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.aboutTextService.addAboutText( this.form.value.text );
    } else {
      this.aboutTextService.updateAboutText(this.aboutTextId, this.form.value.text);
    }
    this.errorFlag = false;
    this.form.reset();
  }
}
