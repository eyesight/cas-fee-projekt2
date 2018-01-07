import {Component, OnDestroy, OnInit} from '@angular/core';
import {Route, Router} from '@angular/router';
import {ROUTES} from '../../app.routes';
import {User} from '../../_models/user.model';
import {UserContentService} from '../../_services/user-content.service';
import {avatarHeader} from '../../_helpers/avatar-header';
import {AuthenticationService} from '../../_services/index';
import {ClasslistAvatarService} from '../../_services/user-classlist-avatars.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html'
})

export class NavComponent implements OnInit, OnDestroy {
  public navItems: Route[];
  public userContent: User;
  public userAvatar: string;
  private userContentSub: Subscription = null;

  constructor(private userContentService: UserContentService,
              private authenticationService: AuthenticationService,
              private classlistAvatarService: ClasslistAvatarService,
              private router: Router  ) {
    this.navItems = ROUTES.filter((route) => route.data);
  }

  ngOnInit() {
    console.log('nav.component ngOnInit');
    this.userContent = null;
    this.userContentSub = this.userContentService.getCurrentUserObserver().subscribe((userContent) => {
      console.log('nav.component ngOnInit inside observer');
      this.userContent = userContent;
     // this.userAvatar = 'data:image/png;base64,' + this.userContent.user_avatar;
      if (this.userContent.user_avatar) {
        this.userAvatar =  avatarHeader(this.userContent.avatar_filetype) + this.userContent.user_avatar;
        console.log('avatar yes');
      } else {
        console.log('avatar no');
      }

    }, (error) => {
      console.log('observer error on nav.component.getCurrentUserObserver:' + error );
    });
  }

  ngOnDestroy() {
    if (this.userContentSub) {
      this.userContentSub.unsubscribe();
    }
  }

  public logout() {
    this.authenticationService.logout();
    this.userContentService.clear();
    this.classlistAvatarService.clear();
    this.router.navigate(['login']);
  }
}
