import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(value: any[], searchedWord: string): any[] {
    if (!value || !Array.isArray(value)) return [];

    const normalizedTerm = searchedWord?.toLowerCase().trim();

    if (!normalizedTerm) return value;

    return value.filter((item) => item.title?.toLowerCase().includes(normalizedTerm));
  }
}