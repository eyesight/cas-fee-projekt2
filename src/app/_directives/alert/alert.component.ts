import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../_services/index';

@Component({
  selector: 'alert',
  templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit {
  hidden: boolean = true;
  message: any;

  constructor(private alertService: AlertService) { }


  ngOnInit() {
    this.alertService.getMessage().subscribe(message => {
      console.log('ddd');
      this.message = message;
      this.hidden = false;
      setTimeout(() => {
        this.hidden = true;
      }, 7000);
      setTimeout(() => {
        this.message = '';
      }, 8000);
    });
  }
}

