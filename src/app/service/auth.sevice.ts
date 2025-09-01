import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    id: string;
    username: string;
    email: string;
    access_token: string;
    role: string;
    token_type: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) { }

    private apiUrl = environment.apiBaseUrl;

    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(this.apiUrl + 'auth/login', request);
    }

    // Method to save the token
    saveToken(token: string): void {
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem('access_token', token);
        }
    }

    getToken(): string | null {
        if (typeof window !== 'undefined' && window.localStorage) {
            return window.localStorage.getItem('access_token');
        }
        return null;
    }

    logout(): void {
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.removeItem('access_token');
        }
    }
}