import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from '../../mime-type.validator';
import { Project } from '../projects.modal';
import { ProjectService } from '../projects.service';
@Component ({
  selector : 'app-create-project',
  templateUrl : './create-project.component.html',
  styleUrls : ['./create-project.component.css']
})

export class CreateProjectComponent implements OnInit {
  title = '';
  date = '';
  adress = '';
  description = '';
  image;
  mode = 'create';
  private projectId: string;
  errorFlag = false;
  project: Project;
  isLoading = false;
  form: FormGroup;
  imagePreview: any;

  constructor(public projectService: ProjectService,
              public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title : new FormControl(null, {validators: [Validators.required , Validators.minLength(0)]}),
      adress: new FormControl(null, {validators: [Validators.required ]}),
      date: new FormControl(null, {validators: [Validators.required ]}),
      description: new FormControl(null, {validators: [Validators.required ]}),
      image: new FormControl(null, {
        validators: [Validators.required ] ,
        asyncValidators: [mimeType]
      }
        )
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('projectId')) {
        this.mode = 'edit';
        this.projectId = paramMap.get('projectId');
        this.isLoading = true;
        this.projectService.getSingleProject(this.projectId).subscribe(postData => {
          this.isLoading = false;
          this.project = {id: postData._id, description: postData.description
                        , date: postData.date , adress: postData.adress, title: postData.title, imagePath: postData.imagePath , creator:postData.creator};
          this.form.setValue({title: this.project.title , adress: this.project.adress ,
                                      description: this.project.description , date: this.project.date, image: this.project.imagePath});
        });
      } else {
        this.mode = 'create';
        this.projectId = null;
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
  onSaveProject() {
    if (this.form.invalid) {
      this.errorFlag = true;
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.projectService.addProject( this.form.value.title,
        this.form.value.date,
        this.form.value.adress,
        this.form.value.description,
        this.form.value.image
        );


    } else {
      this.projectService.updateProject(this.projectId, this.form.value.title,
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
