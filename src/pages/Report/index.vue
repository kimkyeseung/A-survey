<template>
  <div class="report">
    <div class="topBarWrap">
      <div class="container">        
        <topBar />
      </div>
    </div>

    <div class="container">
      <b-card class="reportCard">
        <b-row>
          <b-col cols="8">
            <h2>{{survey.title}} 리포트</h2>
          </b-col>
          <b-col>
            <div class="reportParticipantCount">
              <div>
                <h3>
                  총 참여자
                  <span>{{participantTotal}} 명</span>
                </h3>
              </div>
              <div>
                <h3>
                  오늘 참여자
                  <span>{{participantToday}} 명</span>
                </h3>
              </div>
            </div>
          </b-col>
        </b-row>

        <loading v-if="loading"/>
        <div v-else>
          <template v-if="participantTotal">
            <b-card
              v-for="(question, index) in survey.questions"
              :key="index"
              class="responseResultCard"
            >
              <b-row>
                <b-col cols="4">
                  <b-card-sub-title>{{`질문 #${index + 1}`}}</b-card-sub-title>
                  <b-card-title>
                    {{question.ask}}
                  </b-card-title>
                  <b-radio-group
                    @change="handleChartSelect(index)"
                    v-model="survey.questions[index].displayType"
                    class="chartSelect"
                    buttons
                    button-variant="outline-secondary"
                    size="sm"
                  >
                    <b-form-radio value="pie">
                      <v-icon name="pie-chart"/>                      
                      파이차트
                    </b-form-radio>
                    <b-form-radio value="bar">
                      <v-icon name="bar-chart-2"/>
                      컬럼차트
                    </b-form-radio>
                  </b-radio-group>

                  <b-table
                    class="responseResultTable"
                    :items="survey.questions[index].selections.map((selection, i, array) => {
                      return {
                        selection: selection.name,
                        count: selection.value,
                        ratio: selection.value / survey.questions[index].totalValue * 100
                      };
                    })"
                    :fields="tableFields"
                    tbodyTrClass="responseResultTableRow"
                  />
                </b-col>
                <b-col>
                  <div class="responseResult" ref="responseResult">
                  </div>
                </b-col>
              </b-row>
            </b-card>
          </template>
          <div v-else>아직 참여자가 아무도 없습니다.</div>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import store, { Survey, Field, Question, SelectionData, Response } from '@/store/index';
import { Loading, TopBar } from '@/components/index';
import surveyModule from '@/store/survey/module';
import authenticateModule from '@/store/authenticate/module';
import navigateModule from '@/store/navigate/module';
import echarts from 'echarts';
import api from '@/api/api';

@Component({ components: { Loading, TopBar } })
export default class Report extends Vue {
  loading: boolean = true;
  participantTotal: number = 0;
  participantToday: number = 0;
  survey: Survey = {
    _id: '',
    title: '',
    questions: []
  };
  tableFields: Field[] = [
    {
      key: 'selection',
      label: '항목이름',
      tdClass: 'responseResultTableTd',
      thClass: 'responseResultTableTh'
    }, {
      key: 'count',
      label: '응답자수',
      tdClass: 'responseResultTableTd',
      thClass: 'responseResultTableTh'
    }, {
      key: 'ratio',
      label: '응답비율',
      formatter(value: number): string {
        return value.toFixed(2) + '%';
      },
      tdClass: 'responseResultTableTd',
      thClass: 'responseResultTableTh'
    }
  ];

  drawChart(type: echarts.EChartsSeriesType, index: number): void {
    let chart;
    echarts.dispose(this.$refs.responseResult[index]);
    chart = echarts.init(this.$refs.responseResult[index]);
    switch (type) {
      case 'pie':
        chart.setOption({
          series: [{
            type,
            data: this.survey.questions[index].selections,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'red' // color at 0% position
                }, {
                  offset: 1, color: 'blue' // color at 100% position
                }],
                globa: false
              },
              shadowColor: 'rgba(255, 255, 255, 0.5)'
            }
          }]
        });
        return;
      case 'bar':
        chart.setOption({
          xAxis: { data: this.survey.questions[index].selections.map((selection) => selection.name) },
          yAxis: {},
          series: [{
            type,
            data: this.survey.questions[index].selections
          }]
        });
        return;
    }
  }
  
  handleChartSelect(index: number): void {
    this.$nextTick((): void => {
      this.drawChart(this.survey.questions[index].displayType!, index);
    });
  }

  async mounted() {
    const surveyDetail = await api.getSurveyDetail(this.$route.params.id);
    this.survey = {...surveyDetail.data};
    this.survey.questions = surveyDetail.data.questions.map((question): Question => {
      return {
        ...question,
        displayType: 'pie',
        selections: question.selections.reduce((accom, selection: string, index): SelectionData => {
          if (question.type !== 'yesNo' || index < 2) {
            accom.push(selection);
          }
          return accom;
        }, []),
        totalValue: 0
      };
    });
    let responseResult;
    try {
      responseResult = await api.getResponseResult(this.$route.params.id);
    } catch (error) {
      authenticateModule.expiredLogginSession();
    }
    const results = responseResult.data.slice();
    this.participantTotal = results.length;
    results.forEach((result: Response) => {
      let yesterday = new Date(new Date(new Date(new Date().setDate(new Date().getDate())).setHours(0)).setMinutes(0));
      if (new Date(result.creation_date) > yesterday) {
        this.participantToday++;
      }
      for (let i = 0; i < result.answers.length; i++) {
        this.survey.questions[i].selections[Number(result.answers[i])].value++;
        this.survey.questions[i].totalValue!++;
      }
    });
    this.loading = false;
    if (this.participantTotal) {
      for (let i = 0; i < this.survey.questions.length; i++) {
        this.$nextTick(() => {
          this.drawChart(this.survey.questions[i].displayType!, i);
        });
      }
    }
  }
}
</script>

<style lang="less">
  .report {
    .topBarWrap {
      background: white;
      padding-bottom: 4px;
      box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .1);
    }
    .reportCard {
      margin: 20px 0;
      background: rgba(255, 255, 255, .9);
      box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .1);
      h2 {
        font-size: 20px;
        font-weight: 400;
        margin-bottom: 40px;
        text-align: left;
        padding-top: 4px;
      }
      .reportParticipantCount {
        border-left: 1px solid #dcdcdc;
        text-align: left;
        padding: 4px 10px;
        h3 {
          font-size: 16px;
          span {
            text-align: right;
          }
        }
      }
      .responseResultCard {
        margin: 20px 0;
        box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .1);;
        text-align: left;
        .card-subtitle {
          margin-top: 4px;
          font-size: 18px;
        }
        .card-title {
          margin-top: 10px;
          font-size: 20px;
          font-weight: bold
        }
        .chartSelect {
          width: 100%;
        }
        .responseResultTable {
          border-top: 1px solid #dcdcdc;
          margin-top: 30px;
          border-collapse: separate;
          border-spacing: 0 6px;
          .responseResultTableTh {
            border: 0;
            padding-top: 10px;
          }
          .responseResultTableTd {
            border: 0;
            border-right: 1px solid #dcdcdc;
            padding: 6px 12px;
            &:last-child {
              border: 0;
            }
          }
          .responseResultTableRow {
            background: white;
            box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .1);
          }
        }
        .responseResult {
          width: 520px;
          height: 100%;
          margin: 0 auto;
        }
      }
    }
  }
</style>
