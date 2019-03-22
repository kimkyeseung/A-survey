import echarts from 'echarts';
export interface Survey {
  _id: string;
  is_deployed?: boolean;
  questions: Question[];
  title: string;
  length?: number;
}

export interface Question {
  ask: string;
  selections: SelectionData[];
  type?: string;
  displayType?: echarts.EChartsSeriesType;
  totalValue?: number;
}

export interface SelectionData {
  name: string;
  value: number;
}

export interface User {
  name: string;
  token?: string;
}

export interface Response {
  survey_id: string;
  creation_date: Date;
  participant: string;
  answers: string[][];
}

export interface Result {
  title: string;
  participants: Participant[];
}

export interface Participant {
  participant: string;
  particapteTime: Date;
}

export interface Field {
  key: string;
  label: string;
  tdClass?: string | Array<string>;
  thClass?: string | Array<string>;
  formatter? (value: number | string | Date , key?: string, item?: string) :string;
}

export interface AnswerType {
  text: string;
  value: string;
}
