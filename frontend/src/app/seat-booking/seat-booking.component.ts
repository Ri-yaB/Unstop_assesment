import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-seat-booking',
  templateUrl: './seat-booking.component.html',
  styleUrls: ['./seat-booking.component.css']
})
export class SeatBookingComponent implements OnInit {
  seatRows: number[][] = [];
  requestedSeats: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSeats();
  }

  loadSeats() {
    // Fetch seats availability from the backend
    this.http.get<any>('/api/seats').subscribe(response => {
      this.seatRows = this.splitIntoRows(response.seats);
    });
  }

  bookSeats(numSeats: number) {
    this.http.post<any>('/api/book', { seats: numSeats }).subscribe(response => {
      this.loadSeats();  
    });
  }

  splitIntoRows(seats: number[]): number[][] {
    let rows: number[][] = [];
    for (let i = 0; i < seats.length; i += 7) {
      rows.push(seats.slice(i, i + 7));
    }
    return rows;
  }
}
