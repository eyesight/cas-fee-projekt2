/**
 * Created by awedag on 12.10.17.
 */
import { Component, OnInit, ElementRef } from '@angular/core';
import { Klasse } from '../_models/klasse.model';
import { ChatService } from '../_services/chat.service';
import { MessageItem, Message} from '../_models/message.model';
import {formatMoment} from 'ngx-bootstrap/bs-moment/format';
import { dateFormat } from 'dateformat';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit {

  public messageItem: MessageItem[] = [new MessageItem(new Date)];
  public message: Message[] ;

  constructor( private messageItemService: ChatService, private el: ElementRef) { }

  ngOnInit() {
    console.log('ngOnInit in chatcOmponetn');
    this.messageItemService.load()
      .subscribe((result) => {
        this.message = result;
        this.messageItem = this.message.sort(this.sortFunc)
          .reduce( this.reduceToGroup,  [new MessageItem(new Date)] )  // pass in a new MessageItem with a new date -> today
          .sort(this.sortFuncMi);
      });

  }

  public sortFunc(a: Message, b: Message): number {
    // console.log('a:'+ a.createdAt + 'b:' + b.createdAt);
    const aa = new Date(a.createdAt).valueOf();
    const bb = new Date(b.createdAt).valueOf();
    return (aa - bb);

  }
  public sortFuncMi(a: MessageItem, b: MessageItem): number {
    // console.log('a:'+ a.createdAt + 'b:' + b.createdAt);
    const aa = new Date(a.dateGroup).valueOf();
    const bb = new Date(b.dateGroup).valueOf();
    return (aa - bb);

  }

  public onSend(newText: Message) {
    if (this.message) {
      this.message = [...this.message, newText];
    }
    else {
      this.message = [newText];
    }
    this.messageItem = this.reduceToGroup(this.messageItem, newText);
    /*const scrollPane: any = this.el
      .nativeElement.querySelector('.msg-container-base');
    scrollPane.scrollTop = scrollPane.scrollHeight;*/

  }
  private reduceToGroup(mia, x): MessageItem[] {

    const mi = mia.find(t => t.dateGroup.toDateString() === new Date(x.createdAt).toDateString());
    if (!mi) {
      const miNew = new MessageItem(new Date(x.createdAt));
      miNew.messages =  [x];
      mia = [...mia, miNew];
    }else {
      mi.messages = [...mi.messages || [], x];
    }
    return mia;
  }
}
