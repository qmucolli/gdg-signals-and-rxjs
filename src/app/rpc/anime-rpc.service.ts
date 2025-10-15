import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {delay, map, Observable, of} from 'rxjs';

// Define interfaces for strong typing from the API response
export interface Anime {
  mal_id: number;
  title: string;
  synopsis: string;
  score: number;
  images: {
    webp: {
      large_image_url: string;
    };
  };
}

interface JikanResponse {
  data: Anime[];
}


@Injectable({
  providedIn: 'root'
})
export class AnimeRpcService {
  private http = inject(HttpClient);
  private readonly JIKAN_API_URL = 'https://api.jikan.moe/v4';

  public getTopAnime(): Observable<Anime[]> {
    return this.http.get<JikanResponse>(`${this.JIKAN_API_URL}/anime`).pipe(
      // The API wraps the array in a 'data' property, so we extract it
      map(response => response.data),
      delay(1000)
    );
  }

  /**
   * Searches for anime based on a query string.
   * @param query The search term (e.g., "naruto", "one piece").
   */
  public searchAnime(query: string | undefined): Observable<Anime[]> {
    // If the search query is empty, return an empty array immediately
    // to avoid making an unnecessary API call.
    if (!query || !query.trim()) {
      return of([]); // 'of' creates an Observable that emits the value and completes.
    }

    // Using HttpParams is the recommended way to add URL parameters.
    // It automatically handles URL encoding for special characters.
    const params = new HttpParams().set('q', query);

    return this.http.get<JikanResponse>(`${this.JIKAN_API_URL}/anime`, { params }).pipe(
      map(response => response.data)
    );
  }
}
