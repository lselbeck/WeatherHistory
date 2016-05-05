export interface IHistory {
	latitude: number;
	longitude: number;
	date: string;
	summary: string;
	icon: string;
	precipIntensity: number;
	precipProbability: number;
	precipType: string;
	temperature: number;
	windSpeed: number;
}

export class HistoryData implements IHistory {
	constructor(
		public latitude: number,
		public longitude: number,
		public date: string,
		public summary: string,
		public icon: string,
		public precipIntensity: number,
		public precipProbability: number,
		public precipType: string,
		public temperature: number,
		public windSpeed: number
	) {}
}