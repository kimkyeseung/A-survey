<template>
  <div class="log">
    <div class="topBarWrap">
      <div class="container">
        <topBar />
      </div>
    </div>

    <div class="container">
      <b-card class="logTableCard">
        <loading v-if="loading"/>
        <b-table
          v-else-if="result.participants.length"
          :fields="fields"
          :items="result.participants"
          class="logTable"
          tbodyTrClass="logTableRow"
        >
          <template slot="participant" slot-scope="data">
            <b-button
              variant="link"
              @click="handleParticipantDetail(data.item.participant)"
              class="participantDetailButton"
            >
              {{data.item.participant}}
            </b-button>
          </template>
        </b-table>
        <div v-else>아직 참여자가 아무도 없습니다.</div>
      </b-card>
    </div>
  </div>
</template>

<script lang="ts">
import api from '@/api/api';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Loading, TopBar } from '@/components/index';
import store, { Field, Result, Participant } from '@/store';
import surveyModule from '@/store/survey/module';
import authenticateModule from '@/store/authenticate/module';
import navigateModule from '@/store/navigate/module';
import { CLIENT } from '@/store/const';

@Component({ components: { Loading, TopBar }})
export default class Log extends Vue {
  loading: boolean = true;
  fields: Field[] = [
    {
      key: 'participant',
      label: '참여자',
      tdClass: 'logTableTd',
      thClass: 'logTableTh'
    }, {
      key: 'particapteTime',
      label: '참여시각',
      tdClass: 'logTableTd',
      thClass: 'logTableTh',
      formatter(value: Date): string {
        const date = new Date(value);
        return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
      }
    }
  ];
  result: Result = {
    title: '',
    participants: []
  };

  handleParticipantDetail(participant: string): void {
    window.open(`${CLIENT}/log/${this.$route.params.id}/${participant}`);
  }

  async created(): Promise<void> {
    let responseResults;
    try {
      responseResults = await api.getResponseResult(this.$route.params.id);
    } catch (error) {
      authenticateModule.expiredLogginSession();
    }
    const results = responseResults.data.slice();
    this.result.participants = results.map((result: any): Participant => {
      return {
        participant: result.participant,
        particapteTime: result.creation_date
      };
    });
    
    const survey = await api.getSurveyDetail(this.$route.params.id);
    this.result.title = survey.data.title;
    this.loading = false;
  }
}
</script>

<style lang="less">
.log {
  .topBarWrap {
    background: white;
    padding-bottom: 4px;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .1);
  }
  .logTableCard {
    margin: 20px 0;
    background: rgba(255, 255, 255, .9);
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .1);
    .logTable {
      border-collapse: separate;
      border-spacing: 0 10px;
      .logTableTh {
        border: 0;
        padding-top: 0;
      }
      .logTableTd {
        border: 0;
        border-right: 1px solid #dcdcdc;
        &:last-child {
          border: 0;
        }
      }
      .logTableRow {
        background: white;
        border-radius: 4px;
        box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .1);
      }
      .participantDetailButton {
        padding: 0;
      }
    }
  }
}
</style>
