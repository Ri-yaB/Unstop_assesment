import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SeatBookingComponent } from './seat-booking/seat-booking.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, SeatBookingComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
