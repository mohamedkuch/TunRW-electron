import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { TeamMembersService } from '../teamMembers.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TeamMembers } from '../teamMeambers.modal';
import { mimeType } from '../../mime-type.validator';
@Component ({
  selector : 'app-create-team-member',
  templateUrl : './create-team-member.component.html',
  styleUrls : ['./create-team-member.component.scss']
})


export class CreateTeamMemberComponent implements OnInit {
  title = '';
  position = '';
  image;
  mode = 'create';
  private teamMemberId: string;
  errorFlag = false;
  teamMembers: TeamMembers;
  isLoading = false;
  form: FormGroup;
  imagePreview: any;

  constructor(public teamMembersService: TeamMembersService,
              public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title : new FormControl(null, {validators: [Validators.required , Validators.minLength(0)]}),
      position: new FormControl(null, {validators: [Validators.required ]}),
      image: new FormControl(null, {
        validators: [Validators.required ] ,
        asyncValidators: [mimeType]
      }
        )
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('teamMemberId')) {
        this.mode = 'edit';
        this.teamMemberId = paramMap.get('teamMemberId');
        this.isLoading = true;
        this.teamMembersService.getSingleTeamMember(this.teamMemberId).subscribe(postData => {
          this.isLoading = false;
          this.teamMembers = {id: postData._id, title: postData.title , position: postData.position, imagePath: postData.imagePath , creator:postData.creator};
          this.form.setValue({title: this.teamMembers.title , position: this.teamMembers.position , image: this.teamMembers.imagePath});
        });
      } else {
        this.mode = 'create';
        this.teamMemberId = null;
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
  onSaveTeamMember() {
    if (this.form.invalid) {
      this.errorFlag = true;
      return;
    }
    this.isLoading = true;
    
    if (this.mode === 'create') {
      this.teamMembersService.addTeamMember( this.form.value.title,
        this.form.value.position,
        this.form.value.image
        );


    } else {

      this.teamMembersService.updateTeamMember(this.teamMemberId, this.form.value.title,
        this.form.value.position,
        this.form.value.image
        );
    }
    this.errorFlag = false;
    this.form.reset();
  }
}
