/**
 * Created by awedag on 18.11.17.
 */

import { Pipe, PipeTransform} from "@angular/core";
import * as moment from 'moment';

@Pipe({
  name: 'properTime'
})
export class ProperTimePipe implements PipeTransform {

  constructor(){}

  transform( date: string): string {
    // return time as 14:53
   // return moment((new Date(date.toDateString()))).calendar();
    // console.log('date:'+date);
    return moment(date).format('LTS');
  }

}