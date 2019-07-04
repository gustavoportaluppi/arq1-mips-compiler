import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { TestOneComponent } from './test-one/test-one.component';
import { TestTwoComponent } from './test-two/test-two.component';

@NgModule({
  declarations: [
    AppComponent,
    TestOneComponent,
    TestTwoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
