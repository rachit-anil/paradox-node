import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'impure',
  standalone: true,
  pure: false
})
export class ImpurePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    // console.log('Impure pipe executed');
    return new Date().toLocaleTimeString();
  }

}
