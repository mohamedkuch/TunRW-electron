import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import { EventService } from '../events.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Event } from '../events.model';
import { mimeType } from '../../mime-type.validator';
@Component ({
  selector : 'app-create-event',
  templateUrl : './create-event.component.html',
  styleUrls : ['./create-event.component.css']
})

export class CreateEventComponent implements OnInit {
  title = '';
  date = '';
  adress = '';
  description = '';
  image;
  mode = 'create';
  private eventId: string;
  errorFlag = false;
  event: Event;
  isLoading = false;
  form: FormGroup;
  imagePreviewList: any;

  constructor(public eventsService: EventService,
              private formBuilder: FormBuilder,
              public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title : new FormControl(null, {validators: [Validators.required , Validators.minLength(0)]}),
      adress: new FormControl(null, {validators: [Validators.required ]}),
      date: new FormControl(null, {validators: [Validators.required ]}),
      description: new FormControl(null, {validators: [Validators.required ]}),
      image: new FormControl(null, this.formBuilder.array([])
        )
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('eventId')) {
        this.mode = 'edit';
        this.eventId = paramMap.get('eventId');
        this.isLoading = true;
        this.eventsService.getSingleEvent(this.eventId).subscribe(postData => {
          this.isLoading = false;
          this.event = {id: postData._id, description: postData.description
                        , date: postData.date , adress: postData.adress, title: postData.title, imagePath: postData.imagePath , creator:postData.creator};
          this.form.setValue({title: this.event.title , adress: this.event.adress ,
                                      description: this.event.description , date: this.event.date, image: this.event.imagePath});
          console.log("zz", this.form);
          this.imagePreviewList = this.event.imagePath;
        });
      } else {
        this.mode = 'create';
        this.eventId = null;
        this.imagePreviewList = [];
      }
    });
  }
  onImagePicked(event) {
    let files = event.target.files;
    this.form.patchValue({image: files});
    if (files) {
      for (let file of files) {
         let reader = new FileReader();
         reader.onload = (e: any) => {
              this.imagePreviewList.push(reader.result.toString());
          }
          reader.readAsDataURL(file);
      }
    }
    console.log("zaab", this.imagePreviewList);

 
  
  }
  onSaveEvent() {
    if (this.form.invalid) {
      this.errorFlag = true;
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.eventsService.addEvent( this.form.value.title,
      this.form.value.date,
      this.form.value.adress,
      this.form.value.description,
      this.form.value.image
    );


    } else {
      this.eventsService.updateEvent(this.eventId, this.form.value.title,
        this.form.value.date,
        this.form.value.adress,
        this.form.value.description,
        this.form.value.image
        );
    }
    this.errorFlag = false;
    this.form.reset();
  }
}
