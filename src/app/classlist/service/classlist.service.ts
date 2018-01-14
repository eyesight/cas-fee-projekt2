import { Injectable } from '@angular/core';
import {User, UserApprove} from '../../_models/user.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {HttpWrapper} from '../../_services/http-wrapper.service';


@Injectable()
export class ClasslistService {

  private classlistCache: User[] = null;
  constructor(
    private httpWrp: HttpWrapper) {
  }

  public getClasslist(): Observable<User[]>  {

   // instead of json use JSON.strinfiy
    return this.httpWrp.get('/api/classlist/all')
      .map((result) => {this.classlistCache = result.classlist; return result.classlist; });
  }


  public getUserDetail(id): User {
    console.log('getUserDetail:' + id);

    if (!this.classlistCache) {
      return null;
    }

    const user  = this.classlistCache
      .filter(x =>  x.id === Number.parseInt(id))[0];
    console.log('user:' + user.id);
    return user;
  }

  public approveUser( user: User, approve: number): Observable<any>  {

    const userApprove: UserApprove = new UserApprove;
    userApprove.email = user.email;
    userApprove.approve = approve;
// instead of json use JSON.strinfiy
    // TODO: use correct REST API Syntac: provide the user as parameter in the url like on delete
    return this.httpWrp.put('/api/user/approve', userApprove)
      .map((x) => x);
  }

  public deleteUser(key: number): Observable<any>  {
    console.log('classlistservice:' + key);
// instead of json use JSON.strinfiy
    return this.httpWrp.delete('/api/user/' + key)
      .map((x) => x);
  }
}
