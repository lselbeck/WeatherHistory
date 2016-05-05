import { Injectable } from 'angular2/core';
import { HistoryData } from './history';
import { Jsonp, Response } from 'angular2/http'
import { Observable } from 'rxjs/Observable'

@Injectable()
export class HistoryService {
	private _historyUrl = 'https://api.forecast.io/forecast/4318856eb6e3a681dff9b5b353408807/';
	//rest of url ==  37.8267,-122.423, 2013-05-06T12:00:00?callback=JSONP_CALLBACK'
	constructor (private _jsonp: Jsonp) {}

	// getHistoryArray(): HistoryData[] {
	// 	var latitude = 37.8267;
	// 	var longitude = -122.423;
	// 	var url = this._historyUrl + latitude + "," + longitude;
	// 	var historyArray = new HistoryData[10];
	// 	for (var i = 0; i < 10; i++) {
	// 		var dataPoint = this.getHistoryDataPoint(url + "," + "2013-05-06T12:00:00?callback=JSONP_CALLBACK");
	// 		var dailyData = dataPoint.daily.data;
	// 		historyArray[i] = new HistoryData(
	// 			dataPoint.latitude,
	// 			dataPoint.longitude,
	// 			dailyData.time,
	// 			dailyData.summary,
	// 			dailyData.icon,
	// 			0, 0,
	// 			dailyData.precipType,
	// 			dailyData.temperature,
	// 			dailyData.windSpeed);
	// 	}
	// 	return historyArray;
	// }

	getHistory(latitude: number, longitude: number): Observable<any> {
		var url = this._historyUrl + latitude + "," + longitude + ",2013-05-06T12:00:00?callback=JSONP_CALLBACK";
		return this._jsonp.get(url)
			.map((response: Response) => <any>response.json())
			.do(data => console.log('All: ' + JSON.stringify(data)))
			.catch(this.handleError);
	}

	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json().error || 'Server Error');
	}
}