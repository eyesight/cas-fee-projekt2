/**
 * Created by awedag on 11.10.17.
 */

import { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ChatComponent } from './30_chat/chat.component';


export const ROUTES: Routes = [
  { path: '', redirectTo: 'AppComponent', pathMatch: 'full' },
  { path: 'chat', component: ChatComponent, data: { title: 'Chat' } },
];


/*
 export const ROUTES: Routes = [
 { path: '', redirectTo: 'home', pathMatch: 'full' },
 { path: 'home', component: HomeComponent, data: { title: 'Home' } },
 { path: '10_profile', loadChildren: './+todo-advanced-directive#TodoAdvancedDirectiveModule', data: { title: 'ClassList' } },
 {
 path: 'chat', loadChildren: './+todo-advanced-errorhandling#TodoAdvancedErrorhandlingModule',
 data: { title: 'Errorhandling' }
 },
 {
 path: 'chat', loadChildren: './+todo-advanced-errorhandling#TodoAdvancedErrorhandlingModule',
 data: { title: 'Errorhandling' }
 },
 { path: '**', component: NoContentComponent },
 ];
 */
