import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ApiEnvelope } from '@data/models/api.models';
import { CategoryWithComponentsDto, ComponentDto } from '@data/models/components.models';

@Injectable({ providedIn: 'root' })
export class ComponentsService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  getCategoriesWithComponents(): Observable<CategoryWithComponentsDto[]> {
    return this.http
      .get<ApiEnvelope<CategoryWithComponentsDto[]>>(`${this.base}/api/v1/categories/with-components`)
      .pipe(map((r) => r.data));
  }

  getBySlug(slug: string): Observable<ComponentDto> {
    return this.http
      .get<ApiEnvelope<ComponentDto>>(`${this.base}/api/v1/components/slug/${slug}`)
      .pipe(map((r) => r.data));
  }
}
