import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import {MockBackend} from '@angular/http/testing';
import {BaseRequestOptions, ConnectionBackend, Http, ResponseOptions} from '@angular/http';
import {HttpWrapperServiceMock} from '../_services/http-wrapper.service.mock';
import {UserAuthServiceMock} from '../_services/user-auth.service.mock';
import {UserAuthService} from '../_services/user-auth.service';
import {HttpWrapper} from '../_services/http-wrapper.service';
import {AuthenticationService} from '../_services/authentication.service';
import {ChatComponent} from './chat.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ProperTimePipe} from './services/proper-time.pipe';
import {ChatAddmessageComponent} from './chat-addmessage/chat-addmessage.component';
import {ChatDateComponent} from './chat-date/chat-date.component';
import {ChatMessageComponent} from './chat-message/chat-message.component';
import {FromNowPipe} from '../_pipes/from-now.pipe';
import {ChatService} from '../_services/chat.service';
import {SocketWrapper} from '../_services/socket-wrapper.service';
import {AppConfigClass} from '../_helpers/app.config';
import {PersonalDetailsContainerComponent} from '../personal-details-container/personal-details-container.component';
import {AppScrollBottomDirective} from '../_directives/scroll-bottom.directive';
import {DbServiceUserContent, UserContentService} from '../_services/user-content.service';
import {StorageService} from '../_services/storage.service';
import {AlertService} from '../_services/alert.service';
import {AlertMessagesService} from '../_services/alert-messages.service';
import {ClasslistAvatarService} from '../_services/user-classlist-avatars.service';
import {ClasslistAvatarServiceMock} from '../_services/user-classlist-avatars.service.mock';
import {UserContentServiceMock} from '../_services/user-content.service.mock';
import {EmojiToUnicode} from '../_services/emoji-to-unicode';

fdescribe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChatComponent, ProperTimePipe, FromNowPipe, ChatDateComponent, ChatMessageComponent, ChatAddmessageComponent,
        PersonalDetailsContainerComponent, AppScrollBottomDirective],
      providers: [AuthenticationService, MockBackend, BaseRequestOptions, ChatService,
        SocketWrapper, AppConfigClass, StorageService, AlertService, AlertMessagesService, DbServiceUserContent, EmojiToUnicode,
        {provide: HttpWrapper, useClass: HttpWrapperServiceMock},
        {provide: UserAuthService, useClass: UserAuthServiceMock},
        {provide: UserContentService, useClass: UserContentServiceMock},
        {provide: ClasslistAvatarService, useClass: ClasslistAvatarServiceMock },
        {provide: ConnectionBackend, useClass: MockBackend},
        {
          provide: Http, useFactory: (mockBackend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
          return new Http(mockBackend, defaultOptions);
        }, deps: [MockBackend, BaseRequestOptions]
        }
      ],
      imports: [RouterTestingModule.withRoutes([])]

    })
      .compileComponents();
  }));

  let mockBackend = MockBackend;
  let chatService = ChatService;
  let connectionBackend = MockBackend;
//  let chatComponent  = ChatComponent;
  beforeEach(inject([MockBackend, ChatService, ConnectionBackend], (_MB, _CS, _CB) => {
      mockBackend = _MB;
      chatService = _CS;
      connectionBackend = _CB;
      //  chatComponent = _CC;
      //   this.backend = this.injector.get(ConnectionBackend) as MockBackend;
      //   connectionBackend = this.injector.get(ConnectionBackend) as MockBackend;

    })
  );


  it('should create', () => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should response ', (() => {
    const msgs = [{email: 'es@com.ex', message: 'bla', sent_at: '2017-10-05T08:15:30-00:00'}];

//    const backend = this.injector.get(ConnectionBackend) as MockBackend;

    /* connectionBackend.connections.subscribe(connection => {
     const response = new ResponseOptions({body: JSON.stringify(msgs)});
     connection.mockRespond(new Response(response));
     });*/
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component).toBeTruthy();
  }));
});
