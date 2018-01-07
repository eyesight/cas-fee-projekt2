import {Component, Input, OnInit} from '@angular/core';
import { User } from '../../_models/user.model';
import {overlayAnimation} from '../../_animation/overlay.animation';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  animations: [overlayAnimation],
  host: { '[@overlayAnimation]': ''}
})
export class UserDetailComponent implements OnInit {
  hidden = true;

  public user: User = null;

  constructor(private activatedRoute: ActivatedRoute) {
     this.user = activatedRoute.snapshot.data.user;
  }
  ngOnInit() {
  }

}
