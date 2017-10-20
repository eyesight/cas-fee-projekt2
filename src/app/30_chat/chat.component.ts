/**
 * Created by awedag on 12.10.17.
 */
import { Component, OnInit } from '@angular/core';
import { Klasse } from '../model/klasse.model';
import { MessageItemService } from '../services/messageItem.service';
import { MessageItem, Message} from '../model/messageItem.model';
import {formatMoment} from 'ngx-bootstrap/bs-moment/format';
import { dateFormat } from 'dateformat';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit {

  public messageItem: MessageItem[];
  //= new Array<MessageItem>(new MessageItem( new Date() ));
  public message: Message[];

  constructor( private messageItemService: MessageItemService) { }

  ngOnInit() {
    this.messageItemService.load()
      .subscribe((result) => {

        // TODO: refactoring
        this.message = result;
        //     this.message.sort(this.sortFunc)
        //     .forEach((x) => this.waveInGroup(x));
        /*this.messageItem = this.message.sort(this.sortFunc)
         .reduce((mia, x) => {
         // const mia = new Array<MessageItem>(new MessageItem( new Date() ));
         const mi = mia.find(t => t.dateGroup.toDateString() === new Date(x.createdAt).toDateString());
         if (!mi) {
         const miNew = new MessageItem(new Date(x.createdAt));
         miNew.messages = new Array<Message>(x);
         // mia.push(miNew);
         mia = [...mia, miNew];
         }else {
         mi.messages = [...mi.messages, x];
         }
         return mia;
         }, new Array<MessageItem>(new MessageItem( new Date() )));*/

        this.messageItem = this.message.sort(this.sortFunc)
          .reduce( this.reduceToGroup, new Array<MessageItem>(new MessageItem( new Date() )))
          .sort(this.sortFuncMi);

        //   this.messageItem.sort(this.sortFuncMi);
      });

  }

  public sortFunc(a: Message, b: Message) {
    // console.log('a:'+ a.createdAt + 'b:' + b.createdAt);
    const aa = new Date(a.createdAt).valueOf();
    const bb = new Date(b.createdAt).valueOf();
    return (aa - bb);

  }
  public sortFuncMi(a: MessageItem, b: MessageItem) {
    // console.log('a:'+ a.createdAt + 'b:' + b.createdAt);
    const aa = new Date(a.dateGroup).valueOf();
    const bb = new Date(b.dateGroup).valueOf();
    return (aa - bb);

  }

  public onSend(newText: Message) {
    console.log('onSend on chat.component:' + newText.createdAt);
    this.message.push(newText);
    //this.waveInGroup(newText);
    this.reduceToGroup(this.messageItem,newText);

  }
  private waveInGroup(x: Message ) {

    const dg = new Date(x.createdAt);
    const mi = this.messageItem.find(t => t.dateGroup.toDateString() === dg.toDateString());

    if (mi) {
      if (mi.messages) {
        mi.messages.push(x);
      }
      else{
        mi.messages = new Array<Message>(x);
      }
    }
    else {
      console.log('new mi');
      const mi: MessageItem = new MessageItem(new Date(x.createdAt));
      mi.messages = new Array<Message>(x);
      this.messageItem.push(mi);

    }
  }
  private reduceToGroup = (mia, x) => {

    const mi = mia.find(t => t.dateGroup.toDateString() === new Date(x.createdAt).toDateString());
    if (!mi) {
      const miNew = new MessageItem(new Date(x.createdAt));
      miNew.messages =  [x];
      mia = [...mia, miNew];
    }else {
      if (!mi.messages) {
        mi.messages =  [x];
      }else {
        mi.messages = [...mi.messages, x];
      }
    }
    return mia;
  }
}
