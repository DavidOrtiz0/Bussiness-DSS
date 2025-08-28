import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:4000/api'; // Ajusta según tu API

  constructor(private http: HttpClient){}

  upload_file(file : File): Observable<any>{
  const formData = new FormData();
  formData.append('file', file)

  return this.http.post(`${this.apiUrl}/upload`, formData)
  }

  
}
