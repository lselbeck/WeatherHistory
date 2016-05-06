import { Component, OnInit } from 'angular2/core';
import { HistoryService } from './history.service';
import { HistoryData } from './history';
import { CHART_DIRECTIVES, Highcharts } from 'angular2-highcharts';

@Component({
	selector: 'wh-history',
	templateUrl: 'app/history/history-list.component.html',
	directives: [CHART_DIRECTIVES]
})

export class HistoryListComponent {
	history: Array<any> = new Array<any>();
	columns: string[] = ['Date', 'Summary', 'Precipitation', 'High', 'Low', 'Wind Speed'];
	errorMessage: string;
	latitude: number = 37.8267;
	longitude: number = -122.423;
	options: Object;
	chart: Object;
	xDates: Array<string> = new Array<string>();

	constructor(private _historyService: HistoryService) {

		this.options = {
			chart: {
				zoomType: 'xy'
			},
			title: {
				text: this.getTitle()
			},
			subtitle: {
            text: 'Source: developer.forecast.io'
			},
			legend: {
            layout: 'vertical',
            verticalAlign: 'top',
            align: 'right',
            x: 0,
            y: 100,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
			},
			xAxis: {
				categories: this.xDates,
				crosshair: true
			},
			yAxis: [{
				labels: {
					format: '{value}°F',
					style: {
						color: Highcharts.getOptions().colors[1]
					}
            },
				title: {
					text: 'Temperature',
					style: {
						color: Highcharts.getOptions().colors[1]
					}
				}
			}, {
				title: {
					text: 'Precipitation',
					style: {
						color: Highcharts.getOptions().colors[0]
					}
				},
				labels: {
					format: '{value} in',
					style: {
						color: Highcharts.getOptions().colors[0]
					}
				},
				opposite: true
			}],
			tooltip: {
				shared: true
			},
			series: [{
            name: 'Rainfall',
            type: 'column',
            yAxis: 1,
            data: new Array(),
            tooltip: {
					valueSuffix: ' in'
            }
         }, {
				name: 'Snowfall',
				type: 'column',
				data: new Array(),
				tooltip: {
					valueSuffix: ' in'
				}
			}, {
				name: 'Max Temp',
				type: 'spline',
				data: new Array(),
				tooltip: {
					valueSuffix: '°F'
				}
			}, {
				name: 'Min Temp',
				type: 'spline',
				data: new Array(),
				tooltip: {
					valueSuffix: '°F'
				}
			}]
		};

		// setInterval(() =>	this.chart.series[0].setData(
		// 		this.history.map(function(val) {
		// 			return val.precipIntensity;
		// 		}), true, true
		// ), 1000);
	}

	saveInstance(chartInstance) {
		this.chart = chartInstance;
		this.getHistory();
	}

	getTitle(): string {
		return 'History from '
				+ (this.latitude >= 0 ? '+' : '') + this.latitude
				+ (this.longitude >= 0 ? ', +' : ', ') + this.longitude;
	};

	getHistory(): void {
		var day = new Date();
		for (var i = 0; i < 10; i++) {
			this._historyService.getHistory(this.latitude, this.longitude, day)
				.subscribe(
				history => {
					this.history.push(history.daily.data[0]);
					this.chart['series'][0].addPoint(history.daily.data[0].precipIntensity * 24);
					this.chart['series'][1].addPoint(history.daily.data[0].precipAccumulation || 0);
					this.chart['series'][2].addPoint(history.daily.data[0].temperatureMax);
					this.chart['series'][3].addPoint(history.daily.data[0].temperatureMin);
				},
					error => this.errorMessage = <any>error,
					() => console.log(this.history)
				);
			this.xDates[i] = day.toDateString();
			day.setDate(day.getDate() - 1);
		}
	}
}
