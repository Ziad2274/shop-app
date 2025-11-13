import { join } from 'node:path';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trim',
  standalone: true
})
export class TrimPipe implements PipeTransform {

  transform(value: string,end:number): string {
      if (!value || end <= 0) {
      return '';
    }

   const words = value.split(' ');

   if (words.length>end) {
      return words.slice(0, end).join(' ') + '...';
    
   }
      return value;

    }
  
}
