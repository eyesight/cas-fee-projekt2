/**
 * Created by awedag on 17.10.17.
 */


import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { MessageJson } from '../_models/message.model';
import { appConfig } from '../_helpers/app.config';

// need to import explicitly the map function of Rx!
import 'rxjs/Rx';

import { MessageItem, Message } from '../_models/message.model';
import {AuthenticationService} from "./authentication.service";

@Injectable()
export class ChatService {

  public message: Message[];
  public socket: any;
  public userName: string;
  public mm: string;
  private url = 'localhost:3020';
  private testbearer = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
    '.eyJuYW1lIjoiTmV1ZXJVU0VyVXNlcjEyMzg4MkFAZXhhbXBsLmNvbSIsImlhdCI6MTUwOTU2MDcxNywi' +
    'ZXhwIjoxNTEwMTY1NTE3LCJhdWQiOiJzZWxmIiwiaXNzIjoic2Nob29sIn0' +
    '.AY2BgNdczwQKzjsKAkO4oqWTdqLC_f6UKTVYYTXKM5Y';

  // see https://www.dev6.com/Angular2-WebSockets
  // TODO: handle dis/reconnect
  // TODO: read initial complete messagethread using api/chat/getall

  constructor(private http: Http, private authService: AuthenticationService) {
    this.userName = 'testuser';
    console.log('getCurentUserJwt :' + this.authService.getCurrentUserJwt());
    this.socket = io(this.url, { upgrade: true, query: 'token=' + this.authService.getCurrentUserJwt()});

  }

  public load(): Observable<MessageJson[]> {
    console.log('load OBservable message');
    return  this.http
      //.get('/assets/mock/messageJson.json')
      .get(appConfig.apiUrl + '/api/chat/getall')
      .map((result ) => result.json());

    //this.socket.on('chatMessageFromSocketServer',)

  }
  public authentication(): Observable<any> {
    const observable = new Observable(observer => {
      this.socket.on("error", function (error) {
        console.dir('error' + error);

        if (error == 'Not authorized'){
          observer.next(error);
        //  this.router.navigate(['login']);
        }
        else if (error.data){
          if (error.data.type == 'UnauthorizedError' || error.data.code == 'invalid_token') {
            // redirect user to login page perhaps?
            observer.next('User Token has expired');
          //  this.router.navigate(['login']);

          }
        }
        console.log("authetication: " + error);
      });
      // observable is disposed
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }


  // TODO: generics to type MessageItem
  public readMessages(): Observable<any> {

    const observable = new Observable(observer => {
      this.socket.on('broadcastToAll_chatMessage', (data) => {

        //console.log('broadcastToAll_chatMessage: msg received' + data.text);
        //console.dir('show all data:' + data);
        observer.next(data);
      });
      // observable is disposed
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }


  public sendMessage(msg: string){

    const messageJson = new MessageJson();
    messageJson.message = msg;
    messageJson.sent_at = Date.now().toString();
    const reference = this;
    console.log('send message :' + msg);
    this.socket.emit('chatMessageToSocketServer', messageJson, function(respMsg, username){
      reference.mm = respMsg;
      reference.userName = username;
      console.log('sendmessage callback called:' + respMsg , username);
    });

  }


}




