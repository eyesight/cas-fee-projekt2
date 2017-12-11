import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ClasslistItemComponent } from './classlist-item/classlist-item.component';
import { ClasslistListComponent } from './classlist-list/classlist-list.component';
import { ClasslistComponent } from './classlist.component';
import { ClasslistRoutesModule } from './classlist.routes';
import {ClasslistService} from "./service/classlist.service";
import {UserDetailComponent} from "./user-detail/user-detail.component";
import {UserResolverService} from "./service/user-resolver.service";
import {AlertComponent} from "./dialog/alert.component";
import {CanDeactivateClasslistService} from "./service/can-deactivate-classlist.service";

@NgModule({
  imports: [
    CommonModule, ClasslistRoutesModule
  ],
  declarations: [ClasslistListComponent, ClasslistComponent, UserDetailComponent, AlertComponent],
  providers: [ClasslistService, UserResolverService, CanDeactivateClasslistService]
})
export class ClasslistModule { }
