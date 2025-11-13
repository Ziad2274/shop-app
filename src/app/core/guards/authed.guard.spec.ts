import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authedGuard } from './authed.guard';

describe('authedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
