import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../_models/user.model';
import { overlayAnimation } from '../../_animation/overlay.animation';
import { UserContentService } from '../../_services/user-content.service';
import { UserContentDbService } from '../../_services/user-content-db.service';
import { Router } from '@angular/router';
import { UserAuthService } from '../../_services/user-auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../_validation/custom.validators';
import { AlertService, UserService } from '../../_services/index';


@Component({
  selector: 'app-profile-details-child',
  templateUrl: './profile-details-child.component.html',
  animations: [overlayAnimation],
  host: { '[@overlayAnimation]': ''}
})


// TODO: use input directives and get usercontent passed over from profile.component (or use a resolver to pass it)
export class ProfileDetailsChildComponent implements OnInit {
  public user: User;
  public userContent: User = null;
//  public currentUser: User = null;
  public childDetailsForm: FormGroup;
  public formModel: User;
  public userObject = new User;

  constructor(
    private UserContentDbService: UserContentDbService,
    private router: Router,
    private userAuthService: UserAuthService,
    private UserContentService: UserContentService,
    private alertService: AlertService,
    private userService: UserService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.userContent = this.UserContentDbService.getCurrentUser();
    //this.currentUser = this.userContent['user_attributes'];
    console.log(this.userContent);

    this.buildForm();
  }

  get formChildGender() {
    return this.childDetailsForm.get('child_gender');
  }

  get formCFirstname() {
    return this.childDetailsForm.get('child_forename');
  }

  get formCLastname() {
    return this.childDetailsForm.get('child_surname');
  }

  get formCBirthday() {
    return this.childDetailsForm.get('child_date_of_birth');
  }

  update() {
    this.formModel = this.childDetailsForm.value;
    this.userContent.child_forename = this.formModel.child_forename;
    this.userContent.child_surname = this.formModel.child_surname;
    console.log(this.userObject);

    this.userObject.adress = this.userContent.adress;
    this.userObject.child_date_of_birth = this.userContent.child_date_of_birth;
    this.userObject.child_forename = this.userContent.child_forename;
    this.userObject.child_gender = this.userContent.child_gender;
    this.userObject.child_surname = this.userContent.child_surname;
    this.userObject.class_id = this.userContent.class_id;
    this.userObject.email = this.userContent.email;
    this.userObject.id = this.userContent.id;
    this.userObject.is_teacher = this.userContent.is_teacher;
    this.userObject.parent_forename = this.userContent.parent_forename;
    this.userObject.parent_gender = this.userContent.parent_gender;
    this.userObject.parent_language = this.userContent.parent_language;
    this.userObject.place = this.userContent.place;
    this.userObject.tel_office = this.userContent.tel_office;
    this.userObject.tel_private = this.userContent.tel_private;
    this.userObject.zip = this.userContent.zip;
  //  this.userObject.user_avatar = this.userContent.user_avatar;
  //  this.userObject.user_can = this.userContent.user_can;
    /*
        this.userObject = this.UserContentService.generateUpdatedUser(this.currentUser);
    */
    console.log(this.userObject);

    this.userService.update(this.userObject)
      .subscribe(
        data => {
          console.log('update Child success');
          this.router.navigate(['/profile']);
        });
    /*error => {
          console.log  ('update Child error');
          this.alertService.error(error);
        });*/
  }

  buildForm() {
    this.childDetailsForm = this.fb.group({
      child_gender: [this.userContent.child_gender, [Validators.required]],
      child_forename: [this.userContent.child_forename, [Validators.required, Validators.minLength(2)]],
      child_surname: [this.userContent.child_surname, [Validators.required, Validators.minLength(2)]],
      child_date_of_birth: [this.userContent.child_date_of_birth, [Validators.required, CustomValidators.dateFormat]]
    });
  }
}

/*{
  "adress" : "ssss",
  "child_date_of_birth" : "1999-10-09T22:00:00.000Z",
  "child_forename" : "sss",
  "child_gender" : "m",
  "child_surname" : "ssss",
  "class_id" : "2",
  "email" : "test@test.com",
  "user_name" : "test@test.com",
  "id" : "4",
  "is_teacher" : "0",
  "parent_forename":"test",
  "parent_gender":"w",
  "parent_language":"de",
  "parent_surname":"test",

  "place":"Zürich",
  "tel_office":"20 000 000 00 00",
  "tel_private":"20 000 000 00 00",
  "zip":"8000",
  "user_avatar": "user_avatar",
  "user_can": "ss"
}*/
