import { Injectable } from '@angular/core';
import { Jsonp, Response } from '@angular/http'
import { Observable } from 'rxjs/Observable'

@Injectable()
export class HistoryService {
	private _historyUrl = 'https://api.forecast.io/forecast/4318856eb6e3a681dff9b5b353408807/';
	constructor (private _jsonp: Jsonp) {}

	getHistory(latitude: number, longitude: number, date: Date): Observable<any> {
		var url = this._historyUrl + latitude + "," + longitude + "," + date.toJSON().slice(0, 10) + "T12:00:00?callback=JSONP_CALLBACK";
		return this._jsonp.get(url)
			.map((response: Response) => <any>response.json())
			.catch(this.handleError);
	}

	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json().error || 'Server Error');
	}
}