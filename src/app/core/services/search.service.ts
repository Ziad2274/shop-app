import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTerm = new BehaviorSubject<string>('');//BehaviorSubject->holds latest search text
  getSearchTerm(): Observable<string> {
    return this.searchTerm;  
  }  

  setSearchTerm(term: string) {
    this.searchTerm.next(term);
  }
}
