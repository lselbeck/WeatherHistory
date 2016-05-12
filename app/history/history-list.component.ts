import { Component, Directive, OnChanges, Input } from 'angular2/core';
import { HistoryService } from './history.service';
import { CHART_DIRECTIVES, Highcharts } from 'angular2-highcharts';

@Component({
	selector: 'wh-history',
	templateUrl: 'app/history/history-list.component.html',
	directives: [CHART_DIRECTIVES],
	styleUrls: ['app/history/history-list.component.css']
})

export class HistoryListComponent implements OnChanges {
	//chart data
	chart: Object;
	options: Object;
	initLatitude: number = 47.61;
	initLongitude: number = -122.23;
	@Input() latitude: number = this.initLatitude;
	@Input() longitude: number = this.initLongitude;
	historyLength: number = 30; //how many days back the chart goes
	tickAmount: number = 40; //how many data points there are in the chart
	chartCreated: boolean = false;

	//table data
	history: Array<any> = new Array<any>();
	columns: string[] = ['Date', 'Summary', 'Precipitation', 'High', 'Low', 'Wind Speed'];
	showTable: boolean = false;

	//time selector data
	timeOptions: string[] = ['Month', 'Year', 'Decade', 'Century'];

	constructor(private _historyService: HistoryService) {

		//options for highcharts chart
		this.options = {
			chart: {
				zoomType: 'xy',
				style: {
					margin: '0 auto'
				}
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
				type: 'datetime',
				crosshair: true,
				labels: {
					formatter: function() {
						return Highcharts.dateFormat('%b %Y', this.value);
					}
				}
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
				shared: true,
				xDateFormat: '%b %e, %Y',
				valueDecimals: 2
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
	}

	//captures chart instance when it is initially created and creates initial chart
	saveInstance(chartInstance) {
		this.chart = chartInstance;
		this.chartCreated = true;
		this.getHistory();
	}

	//redraw chart when new location is selected
	ngOnChanges(): void {
		if (this.chartCreated) {
			this.getHistory();
		} else {
			this.latitude = this.initLatitude;
			this.longitude = this.initLongitude;
		}
	}

	//calls dark ski api to get weather history for a given location, and redraws the chart
	//NOTE:
	//Unfortunately, developer.forcast.io only provides data for a single day per api call.
	//Thus, a lot of calls are made.
	getHistory(): void {
		var incrementBy = Math.ceil(this.historyLength / this.tickAmount);
		var day = new Date(new Date().setDate(new Date().getDate() - this.historyLength));

		this.initializeChart();

		for (var i = 0, j = 0; i < this.historyLength; i+=incrementBy, j++) {
			this._historyService.getHistory(this.latitude, this.longitude, day)
			.subscribe(
				history => {
					this.history.push(history.daily.data[0]);
					this.chart['series'][0].addPoint([history.daily.data[0].time * 1000, (history.daily.data[0].precipIntensity * 24)]);
					this.chart['series'][1].addPoint([history.daily.data[0].time * 1000, history.daily.data[0].temperatureMax]);
					this.chart['series'][2].addPoint([history.daily.data[0].time * 1000, history.daily.data[0].temperatureMin]);
				}
				);
			day.setDate(day.getDate() + incrementBy);
		}
	}

	//reset if overwriting a previous chart, otherwise initialize stuff
	initializeChart(): void {
		if (this.chart) {
			this.clearData();
			this.chart['setTitle']({ text: this.getTitle() });
		} else {
			this.latitude = this.initLatitude;
			this.longitude = this.initLongitude;
		}		
	}

	//clears chart and table data
	clearData(): void {
		for (var i = 0; i < this.chart['series'].length; i++) {
			this.chart['series'][i].setData([]);
		}

		this.history = new Array<any>();
	}

	getTitle(): string {
		return 'History from '
			+ (this.latitude >= 0 ? '+' : '') + this.latitude.toFixed(3)
			+ (this.longitude >= 0 ? ', +' : ', ') + this.longitude.toFixed(3);
	}

	toggleTable(): void {
		this.showTable = !this.showTable;
	}

	onTimeChange(newTime): void {
		switch(newTime) {
			case 'Month':
				this.historyLength = 30;
				break;
			case 'Decade':
				this.historyLength = 3650;
				break;
			case 'Century':
				this.historyLength = 36500;
				break;
			default:
				this.historyLength = 365;
		}

		this.getHistory();
	}
}
