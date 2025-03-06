import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {jwtDecode} from "jwt-decode";
import {CommonModule} from "@angular/common";
import {JWTService} from "../../services/jwt.service";
import {fromEvent, Observable} from "rxjs";

@Component({
  selector: 'app-token-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './token-counter.component.html',
  styleUrl: './token-counter.component.scss'
})
export class TokenCounterComponent implements OnInit, OnDestroy {
  token = ''; // Input property to accept the JWT token
  remainingTime: number = 0; // Remaining time in seconds
  private intervalId: any;

  constructor(private  jwtService: JWTService) {
  }

  ngOnInit(): void {
    this.createLocalStorageObservable('jwtToken').subscribe(token => {
      this.token = token as string;
      console.log("token changed");
      clearInterval(this.intervalId);
      this.updateValue();
    });
    this.token = this.jwtService.getToken() || ''; // Input property to accept the JWT token
  }

  updateValue(){
    if(this.token){
      this.token = this.jwtService.getToken() || '';
      // Decode the JWT token to get the expiration time
      const decodedToken: any = jwtDecode(this.token);
      const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds

      // Update the remaining time every second
      this.intervalId = setInterval(() => {
        const currentTime = Date.now();
        this.remainingTime = Math.max(0, Math.floor((expirationTime - currentTime) / 1000)); // Convert to seconds
      }, 1000);
    }else {
      this.token = this.jwtService.getToken() || '';
      clearInterval(this.intervalId);
    }
  }

  createLocalStorageObservable(key: string) {
    return new Observable(subscriber => {
      // Helper function to notify when the value changes
      const notifyChange = () => {
        const value = localStorage.getItem(key);
        subscriber.next(value);
      };

      // Emit the current value of the key when subscription starts
      notifyChange();

      // We need to intercept changes in localStorage by wrapping `setItem`
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = (keyToSet, value) => {
        originalSetItem.call(localStorage, keyToSet, value);

        // If the changed key matches, we notify the observer
        if (keyToSet === key) {
          notifyChange();
        }
      };

      // Cleanup: Restore the original localStorage.setItem
      return () => {
        localStorage.setItem = originalSetItem;
      };
    });
  }

  formatTime(seconds: number) {
    if (seconds < 60) {
      return `${seconds} s`;
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    let result = '';

    if (hours > 0) {
      result += `${hours}H:`;

      if (minutes > 0 || remainingSeconds > 0) {
        result += ' ';
      }
    }

    if (minutes > 0) {
      result += `${minutes}:`;

      if (remainingSeconds > 0) {
        result += ' ';
      }
    }

    if (remainingSeconds > 0) {
      result += `${remainingSeconds}s`;
    }

    return result;
  }

  ngOnDestroy(): void {
    // Clean up the interval when the component is destroyed
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}