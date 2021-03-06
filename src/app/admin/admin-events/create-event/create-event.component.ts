import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { EventService } from '../events.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Event } from '../events.model';
import { mimeType } from '../../mime-type.validator';
@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
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
  form: any;
  imageInputCounter = 0;
  options = { year: 'numeric', month: 'short', day: 'numeric' };


  constructor(public eventsService: EventService,
    public route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(0)] }),
      adress: new FormControl(null, { validators: [Validators.required] }),
      date: new FormControl(null, { validators: [Validators.required] }),
      description: new FormControl(null, { validators: [Validators.required] }),
      image: new FormArray([new FormControl(null, { validators: [Validators.required] })])
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('eventId')) {
        this.mode = 'edit';
        this.eventId = paramMap.get('eventId');
        this.isLoading = true;
        this.eventsService.getSingleEvent(this.eventId).subscribe(postData => {
          this.isLoading = false;
          this.event = {
            id: postData._id, description: postData.description
            , date: postData.date, adress: postData.adress, title: postData.title, imagePath: postData.imagePath, creator: postData.creator
          };

          for (let index = 0; index < this.event.imagePath.length - 1; index++)
            this.onPlusClick();


          this.form.setValue({
            title: this.event.title, adress: this.event.adress,
            description: this.event.description, date: new Date(this.event.date),
            image: this.event.imagePath
          });

        });
      } else {
        this.mode = 'create';
        this.eventId = null;
      }
    });

  }
  onMinusClick() {
    if (this.imageInputCounter > 0) {
      this.form.controls['image'].removeAt(this.imageInputCounter);
      this.imageInputCounter -= 1;
    }
    this.errorFlag = false;

  }
  onPlusClick() {
    this.form.controls
      .image.push(new FormControl(null, { validators: [Validators.required] }));
    this.imageInputCounter += 1;

    this.errorFlag = false;
  }
  onSaveEvent() {
    if (this.form.invalid) {
      this.errorFlag = true;
      return;
    }
    if (this.mode === 'create') {
      this.eventsService.addEvent(this.form.value.title,
        this.form.value.date.toLocaleDateString('en-US', this.options),
        this.form.value.adress,
        this.form.value.description,
        this.form.value.image
      );
    } else {
      this.eventsService.updateEvent(this.eventId, this.form.value.title,
        this.form.value.date.toLocaleDateString('en-US', this.options),
        this.form.value.adress,
        this.form.value.description,
        this.form.value.image
      );
    }
    this.errorFlag = false;
  }
}
