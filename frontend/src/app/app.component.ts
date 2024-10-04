import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Seat Booking System';
  
  totalSeats: number = 80;
  seats: boolean[] = new Array(this.totalSeats).fill(false);
  
  bookSeats(requestedSeats: number): void {
    if (requestedSeats < 1 || requestedSeats > 7) {
      alert('You can book between 1 to 7 seats only.');
      return;
    }

    let bookedSeats: number[] = [];
    
    for (let i = 0; i < this.seats.length; i++) {
      if (this.checkAvailableSeats(i, requestedSeats)) {
        for (let j = 0; j < requestedSeats; j++) {
          this.seats[i + j] = true;
          bookedSeats.push(i + j + 1); 
        }
        alert(`Successfully booked seats: ${bookedSeats.join(', ')}`);
        return;
      }
    }

    if (bookedSeats.length === 0) {
      bookedSeats = this.bookNearbySeats(requestedSeats);
      if (bookedSeats.length > 0) {
        alert(`Successfully booked nearby seats: ${bookedSeats.join(', ')}`);
      } else {
        alert('Not enough seats available.');
      }
    }
  }

  private checkAvailableSeats(startIndex: number, count: number): boolean {
    for (let i = 0; i < count; i++) {
      if (startIndex + i >= this.seats.length || this.seats[startIndex + i]) {
        return false;
      }
    }
    return true;
  }

  private bookNearbySeats(requestedSeats: number): number[] {
    let bookedSeats: number[] = [];
    for (let i = 0; i < this.seats.length && bookedSeats.length < requestedSeats; i++) {
      if (!this.seats[i]) {
        this.seats[i] = true;
        bookedSeats.push(i + 1);
      }
    }
    return bookedSeats;
  }
}
