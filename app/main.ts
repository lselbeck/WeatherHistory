import { bootstrap } from 'angular2/platform/browser';
import {enableProdMode} from 'angular2/core';
import { AppComponent } from './app.component';
import {ANGULAR2_GOOGLE_MAPS_PROVIDERS} from 'angular2-google-maps/core';

enableProdMode();
bootstrap(AppComponent, [ANGULAR2_GOOGLE_MAPS_PROVIDERS]);