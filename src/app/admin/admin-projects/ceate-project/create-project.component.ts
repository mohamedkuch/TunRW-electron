import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from '../../mime-type.validator';
import { Project } from '../projects.modal';
import { ProjectService } from '../projects.service';
@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
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
  form: any;

  imageInputCounter = 0;
  options = { year: 'numeric', month: 'short', day: 'numeric' };

  constructor(public projectService: ProjectService,
    public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(0)] }),
      adress: new FormControl(null, { validators: [Validators.required] }),
      date: new FormControl(null, { validators: [Validators.required] }),
      description: new FormControl(null, { validators: [Validators.required] }),
      image: new FormArray([new FormControl(null, { validators: [Validators.required] })])
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('projectId')) {
        this.mode = 'edit';
        this.projectId = paramMap.get('projectId');
        this.isLoading = true;
        this.projectService.getSingleProject(this.projectId).subscribe(postData => {
          this.isLoading = false;
          this.project = {
            id: postData._id, description: postData.description
            , date: postData.date, adress: postData.adress, title: postData.title, imagePath: postData.imagePath, creator: postData.creator
          };

          for (let index = 0; index < this.project.imagePath.length - 1; index++)
            this.onPlusClick();

          this.form.setValue({
            title: this.project.title,
            adress: this.project.adress,
            description: this.project.description,
            date: new Date(this.project.date),
            image: this.project.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.projectId = null;
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

  onSaveProject() {
    if (this.form.invalid) {
      this.errorFlag = true;
      return;
    }
    if (this.mode === 'create') {
      this.projectService.addProject(this.form.value.title,
        this.form.value.date.toLocaleDateString('en-US', this.options),
        this.form.value.adress,
        this.form.value.description,
        this.form.value.image
      );
    } else {
      this.projectService.updateProject(this.projectId, this.form.value.title,
        this.form.value.date.toLocaleDateString('en-US', this.options),
        this.form.value.adress,
        this.form.value.description,
        this.form.value.image
      );
    }
    this.errorFlag = false;

  }
}
