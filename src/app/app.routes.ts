import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_guards/auth.guards';
import { RegistrationComponent } from './registration/registration.component';
import { TermsOfUseComponent } from './registration/terms-of-use/terms-of-use.component';
import { TestComponent } from './test/test.component';
import { AppComponent } from './app.component';


export const ROUTES: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, data: { title: 'Home' }, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, data: { title: 'Login' }},
  { path: 'registration', component: RegistrationComponent, data: { title: 'Registration' },
    children: [{ path: 'terms-of-use', component: TermsOfUseComponent }]},
  { path: 'classlist', loadChildren: './classlist/classlist.module#ClasslistModule', data: {title: 'Klassenliste'}, canActivate: [AuthGuard] },
  { path: 'chat',      loadChildren: './chat/chat.module#ChatModule', data: {title: 'Chat'}, canActivate: [AuthGuard] },

  // otherwise redirect to home
  { path: '**', redirectTo: 'home' }

];

