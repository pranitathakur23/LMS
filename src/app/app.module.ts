import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  // Add this import
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule

@NgModule({
  declarations: [
 
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,  
    HttpClientModule  // Add this to the imports array
  ],
  providers: [],
  bootstrap: []
})
export class AppModule {}
