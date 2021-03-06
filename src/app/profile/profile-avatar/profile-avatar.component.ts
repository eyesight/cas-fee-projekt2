import {Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AlertService, UserService, AlertMessagesService} from '../../_services/index';
import {Avatar, UserAvatar} from '../../_models/user.model';

import {ImageCompressService, IImage} from 'ng2-image-compress';
import {Router} from '@angular/router';
import {UserContentService} from '../../_services/user-content.service';
import {avatarHeader} from '../../_helpers/avatar-header';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-profile-avatar',
  templateUrl: './profile-avatar.component.html'
})

export class ProfileAvatarComponent implements OnDestroy{
  public _previewUrl: string;

  @Input() set previewUrl(purl: string) {
    this._previewUrl = purl;
  }

  @Input() avatarFiletype: string;

  get previewUrl() {
    return avatarHeader(this.avatarFiletype) + this._previewUrl;
  }

  public form: FormGroup;
  public loading = false;

  public provFile = false;
  public provFileHideSubmitButton = true;
  private userAvatar = new UserAvatar;
  private av = new Avatar;
  private processedImage: any;
  private images: Array<IImage> = [];
  private userContentSub: Subscription = null;
  private compressSub: Subscription = null;
  private avatarSub: Subscription = null;

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private userContentService: UserContentService,
              private router: Router,
              private alertService: AlertService,
              private alertMessagesService: AlertMessagesService) {

    this.createForm();
  }

  public ngOnDestroy() {
    if (this.userContentSub) {
      this.userContentSub.unsubscribe();
    }
    if (this.compressSub) {
      this.compressSub.unsubscribe();
    }
    if (this.avatarSub) {
      this.avatarSub.unsubscribe();
    }
  }

  public createForm() {
    this.form = this.fb.group({
      avatar: null
    });
  }

  public onSubmit() {

    if (this.avatarSub) {
      this.avatarSub.unsubscribe();
    }
    this.avatarSub = this.userService.updateAvatar(this.userAvatar)
      .subscribe(
        data => {
          this.provFileHideSubmitButton = true;
          this.alertService.success(this.alertMessagesService.MessagesSuccess.imageSaved);
          if (this.userContentSub) {
            this.userContentSub.unsubscribe();
          }
          this.userContentSub = this.userContentService.getUserContent()
            .subscribe(content => {
              },
              error => {
                this.alertService.error(this.alertMessagesService.MessagesError.error, true);
              });
        },
        error => {
          this.provFile = false;

          console.log('profilAvazar: error:' + error);
          if (error.toString().match(/401/g)) {
            this.alertService.error(this.alertMessagesService.MessagesError.newlogin, false, 1000);
            setTimeout(() =>
              this.router.navigate(['relogin'], {queryParams: {returnUrl: this.router.url}}), 3500);
          }   else if (error.toString().match(/413/g)) {
            this.alertService.error(this.alertMessagesService.MessagesError.errorImageSize, false, 3500);

          } else {
            this.alertService.error(this.alertMessagesService.MessagesError.error, false, 500);
          }

        });

    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  public clearFile() {
    this.provFile = false;
  }

  public onFileChange(event) {
    if (event.target.files && event.target.files[0]) {

      const files = event.target.files[0];

      if (files.size > 190000) {
        this.alertService.error(this.alertMessagesService.MessagesError.imageSize, false, 500);
        this.provFile = false;
        this.provFileHideSubmitButton = true;
      } else if (files.type !== ('image/jpeg') && files.type !== ('image/png')) {
        this.alertService.error(this.alertMessagesService.MessagesError.dateType, false, 500);
        this.provFile = false;
        this.provFileHideSubmitButton = true;

      } else {
        this.provFileHideSubmitButton = false;

        // reset
        this.images = [];
        ImageCompressService.filesToCompressedImageSource(event.target.files).then(observableImages => {
          if (this.compressSub) {
            this.compressSub.unsubscribe();
          }
          this.compressSub = observableImages.subscribe((image) => {
            this.images.push(image);
          }, (error) => {
            this.alertService.error(this.alertMessagesService.MessagesError.error, false, 500);
            console.log('Error while converting');
          }, () => {
            this.processedImage = this.images[0];
            this.av.value = this.images[0].compressedImage.imageDataUrl.split(',')[1];
            this.av.filename = files.name;
            this.av.filetype = files.type;
            this.avatarFiletype = files.name.match(/[0-9a-z]+$/i)[0];
            this.av.filesize = files.size;
            this.userAvatar.avatar = this.av;

            this.provFile = true;
            this.previewUrl = this.images[0].compressedImage.imageDataUrl.split(',')[1];
          });
        });
      }
    }
  }
}




