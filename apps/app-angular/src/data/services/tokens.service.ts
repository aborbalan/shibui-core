import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '@env/environment';
import { ApiEnvelope } from '@data/models/api.models';
import { DesignTokenDto, TokenCategory } from '@data/models/tokens.models';

@Injectable({ providedIn: 'root' })
export class TokensService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  getAll(): Observable<DesignTokenDto[]> {
    return this.http
      .get<ApiEnvelope<DesignTokenDto[]>>(`${this.base}/api/v1/tokens`)
      .pipe(map((r) => r.data), catchError(() => of([])));
  }

  getByCategory(category: TokenCategory): Observable<DesignTokenDto[]> {
    return this.http
      .get<ApiEnvelope<DesignTokenDto[]>>(`${this.base}/api/v1/tokens/category/${category}`)
      .pipe(map((r) => r.data), catchError(() => of([])));
  }
}
