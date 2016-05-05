import { Injectable } from 'angular2/core';
import { IHistory } from './history';
import { Jsonp, Response } from 'angular2/http'
import { Observable } from 'rxjs/Observable'

@Injectable()
export class HistoryService {
	private _historyUrl = 'https://api.forecast.io/forecast/4318856eb6e3a681dff9b5b353408807/37.8267,-122.423, 2013-05-06T12:00:00?callback=JSONP_CALLBACK';
	constructor (private _jsonp: Jsonp) {}

	getHistory(): Observable<IHistory[]> {
		return this._jsonp.get(this._historyUrl)
					.map((response: Response) => <any[]>response.json())
					.map((input: Array<any>) => {
						let result: Array<IHistory> = [];
						if (input) {
							input.forEach((data) => {
								result.push(new IHistory());
							})
						}
						return result;
					}
					.do(data => console.log('All: ' + JSON.stringify(data)))
					.catch(this.handleError);
	}

	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json().error || 'Server Error');
	}
}