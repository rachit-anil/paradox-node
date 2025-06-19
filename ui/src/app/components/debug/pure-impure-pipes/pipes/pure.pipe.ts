import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pure',
  standalone: true
})
export class PurePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return new Date().toLocaleTimeString();
  }
}
