import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { PartnerService } from '../partners.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Partner } from '../partner.modal';
import { mimeType } from '../../mime-type.validator';
@Component ({
  selector : 'app-create-partner',
  templateUrl : './create-partner.component.html',
  styleUrls : ['./create-partner.component.scss']
})

export class CreatePartnerComponent implements OnInit {
  title = '';
  image;
  mode = 'create';
  private partnerId: string;
  errorFlag = false;
  partner: Partner;
  isLoading = false;
  form: FormGroup;
  imagePreview: any;

  constructor(public partnersService: PartnerService,
              public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title : new FormControl(null, {validators: [Validators.required , Validators.minLength(0)]}),
      image: new FormControl(null, {
        validators: [Validators.required ] ,
        asyncValidators: [mimeType]
      }
        )
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('partnerId')) {
        this.mode = 'edit';
        this.partnerId = paramMap.get('partnerId');
        this.isLoading = true;
        this.partnersService.getSinglePartner(this.partnerId).subscribe(postData => {
          this.isLoading = false;
          this.partner = {id: postData._id,  title: postData.title, imagePath: postData.imagePath , creator:postData.creator};
          this.form.setValue({title: this.partner.title , image: this.partner.imagePath});
        });
      } else {
        this.mode = 'create';
        this.partnerId = null;
      }
    });
    this.imagePreview = '';
  }
  onImagePicked(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
    this.imagePreview = this.imagePreview.toString();
  
  }
  onSavePartner() {
    if (this.form.invalid) {
      this.errorFlag = true;
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {

      this.partnersService.addPartner( this.form.value.title,
        this.form.value.image
        );


    } else {
      this.partnersService.updatePartner(this.partnerId, this.form.value.title,
        this.form.value.image
        );
    }
    this.errorFlag = false;
    this.form.reset();
  }
}
