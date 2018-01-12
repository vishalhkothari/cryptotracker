import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HoldingsPage } from './holdings';

@NgModule({
  declarations: [
    HoldingsPage,
  ],
  imports: [
    IonicPageModule.forChild(HoldingsPage),
  ],
})
export class HoldingsPageModule {}
