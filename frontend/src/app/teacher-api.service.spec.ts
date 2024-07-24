import { TestBed } from '@angular/core/testing';

import { TeacherApiService } from './teacher-api.service';

describe('TeacherApiService', () => {
  let service: TeacherApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
