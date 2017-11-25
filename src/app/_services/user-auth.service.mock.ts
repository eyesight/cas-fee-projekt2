/**
 * Created by awedag on 22.11.17.
 */
/**
 * Created by awedag on 20.11.17.
 */

import { Injectable } from '@angular/core';
import { StorageService, StorageKeys } from './storage.service';

import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { appConfig } from '../_helpers/app.config';
import {User, UserAuth} from '../_models/user.model';


@Injectable()
export class UserAuthServiceMock {

  private userAuthCache: UserAuth = null;


  public saveCurrentUser(data: UserAuth){
    this.userAuthCache = data;

  }

  public removeCurrentUser(){
  }

  private getCurrentUser(): UserAuth {
    if (!this.userAuthCache) {

    } else {
      return this.userAuthCache;
    }
  }
  public getCurrentUserJwt(): string {
    const userAuth = this.getCurrentUser();

    if (!userAuth) {
      console.log('userAuth is null -> return null');
      return null;
    }
    // console.dir(userAuth);
    return userAuth.token;
  }

  public getCurrentUsername(): string {
    const userAuth = this.getCurrentUser();

    if (!userAuth) {
      console.log('userAuth is null');
      return null;
    }
    // console.dir(userAuth);
    return userAuth.email;
  }

  public saveUserAuth(ua: UserAuth) {
    this.saveCurrentUser(ua);
  }

}