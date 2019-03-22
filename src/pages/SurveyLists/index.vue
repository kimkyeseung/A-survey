<template>
  <div class="surveyLists">
    <div class="topBarWrap">
      <div class="container">
        <topBar
          :button-click="handleRoute.bind(this, `/survey/${id}`)"
          button-text="설문지 추가"
          button-icon="plus"
        />
      </div>
    </div>
    
    <div class="container">
      <b-card class="surveyListsTableCard">
        <b-table
          :items="questions"
          :fields="fields"
          :busy="loading"
          class="surveyListsTable"
          tbodyTrClass="surveyListsTableRow"
        >
          <template slot="title" slot-scope="data">
            <div class="deployedMarker">
              <span v-if="data.item.is_deployed" class="deployedMarkerDeploy">
                <v-icon name="check-circle"/>
                deployed
              </span>
              <span v-else class="deployedMarkerUndeploy">
                <v-icon name="circle"/>
                undeployed
              </span>
            </div>
            {{data.item.title}}
          </template>

          <template slot="modify" slot-scope="data">
            <b-button
              size="sm"
              @click="handleRoute(`/survey/${data.item._id}`)"
              :disabled="data.item.is_deployed"
              class="surveyListsTableButton"
            >
              수정하기
              <v-icon name="edit"/>
            </b-button>
          </template>

          <template slot="report" slot-scope="data">
            <b-button
              size="sm"
              @click="handleRoute(`/report/${data.item._id}`)"
              :disabled="!data.item.is_deployed"
              class="surveyListsTableButton"
            >
              리포트
              <v-icon name="file-text"/>
            </b-button>
          </template>
          
          <template slot="log" slot-scope="data">
            <b-button
              size="sm"
              @click="handleRoute(`/log/${data.item._id}`)"
              :disabled="!data.item.is_deployed"
              class="surveyListsTableButton"
            >
              참여자 로그
              <v-icon name="users"/>
            </b-button>
          </template>
          
          <template slot="deploy" slot-scope="data">
            <b-button
              size="sm"
              @click="handleDeployButton(data.item._id, data.item.is_deployed)"
              class="surveyListsTableButton"
            >
              배포주소

              <v-icon v-if="data.item.is_deployed" name="send"/>
              <v-icon v-else name="share"/>
            </b-button>
          </template>

          <div slot="table-busy">
            <loading v-if="loading" />
          </div>
        </b-table>
      </b-card>

      <b-modal v-model="onDeployModal.on" @ok="handleDeploy(onDeployModal.deploySurveyId)">
        <div>
          <p>설문지를 배포하시겠습니까?<br>배포 후에는 더 이상 수정할 수 없습니다.</p>
        </div>
      </b-modal>
      <b-modal ref="deployedModal" hide-footer >
        <p>클립보드에 복사되었습니다</p> 
        <p>
          <b-button
            variant="link"
            @click="handleLinkClick(`${CLIENT}/response/${onDeployModal.deploySurveyId}`)">
            {{`${CLIENT}/response/${onDeployModal.deploySurveyId}`}}
          </b-button>
        </p>
        <b-button @click="handleHideDeployedModal">닫기</b-button>
      </b-modal>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Modal } from 'bootstrap-vue';
import api from '@/api/api';
import { Field, Survey, User } from '@/store';
import { Loading, TopBar } from '@/components';
import { CLIENT } from '@/store/const';
import  { idGenerator } from '@/helpers/global';
import surveyModule from '@/store/survey/module';
import authenticateModule from '@/store/authenticate/module';
import navigateModule from '@/store/navigate/module';
import router from '@/router';

@Component({ components: { Loading, TopBar }})
export default class SurveyLists extends Vue {
  $refs!: {
    deployedModal: Modal;
  }

  id: string = idGenerator();
  loading: boolean = true;
  fields: Field[] = [
    {
      key: 'title',
      label: '설문지이름',
      tdClass: 'surveyListsTableTd',
      thClass: 'surveyListsTableTh'
    }, {
      key: 'length',
      label: '질문 갯수',
      tdClass: 'surveyListsTableTd',
      thClass: 'surveyListsTableTh'
    }, {
      key: 'modify',
      label: '설문지수정',
      tdClass: 'surveyListsTableTd',
      thClass: 'surveyListsTableTh'
    }, {
      key: 'report',
      label: '리포트',
      tdClass: 'surveyListsTableTd',
      thClass: 'surveyListsTableTh'
    }, {
      key: 'log',
      label: '로그',
      tdClass: 'surveyListsTableTd',
      thClass: 'surveyListsTableTh'
    }, {
      key: 'deploy',
      label: '설문지배포',
      tdClass: 'surveyListsTableTd',
      thClass: 'surveyListsTableTh'
    }
  ];
  onDeployModal = {
    on: false,
    deploySurveyId: ''
  };
  CLIENT: string = CLIENT;

  get questions() {
    return surveyModule.surveys.map((survey) => {
      return {
        title: survey.title,
        length: survey.questions.length,
        _id: survey._id,
        is_deployed: survey.is_deployed
      };
    });
  }

  async handleDeploy(id: string): Promise<void> {
    await api.requestDeploySurvey(id);
    window.open(`${CLIENT}/response/${id}`);
    this.$nextTick(() => {
      surveyModule.fetchSurveyList();
    });
  }

  handleDeployButton(id: string, is_deployed:boolean = false): void {
    this.onDeployModal.deploySurveyId = id;
    if (is_deployed) {
      let clipboard = document.createElement('textarea');
      clipboard.value = `${CLIENT}/response/${id}`;
      document.body.appendChild(clipboard);
      clipboard.select();
      document.execCommand('copy');
      document.body.removeChild(clipboard);
      this.$refs.deployedModal.show();
    } else if (!this.onDeployModal.on) {
      this.onDeployModal.on = true;
    } else {
      this.onDeployModal.on = false;
      this.onDeployModal.deploySurveyId = '';
    }
  }

  handleHideDeployedModal(): void {
    this.$refs.deployedModal.hide();
  }
  
  handleLinkClick(link: string): void {
    window.open(link);
  }

  handleRoute(path: string): void {
		navigateModule.requestRouterPush(path);
  }

  async mounted() {
    await surveyModule.fetchSurveyList();
    this.$nextTick(() => {
      this.loading = false;
    });
  }

}
</script>

<style lang="less">
.surveyLists {
  .topBarWrap {
    background: white;
    padding-bottom: 4px;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .1);
  }
  .surveyListsTableCard {
    margin: 20px 0;
    background: rgba(255, 255, 255, .9);
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .1);
    .surveyListsTable {
      border-collapse: separate;
      border-spacing: 0 10px;
      .surveyListsTableTh {
        border: 0;
        padding-top: 0;
      }
      .surveyListsTableTd {
        border: 0;
        border-right: 1px solid #dcdcdc;
        &:last-child {
          border: 0;
        }
      }
      .surveyListsTableRow {
        background: white;
        border-radius: 4px;
        box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .1);
      }
      .surveyListsTableButton {
        font-size: 0;
        padding: 6px;
        border-radius: 16px;
        .icon {
          width: 16px;
        }
      }
      .deployedMarker {
        float: left;
        width: 80px;
        text-align: left;
        font-size: 8px;
        margin-top: 5px;
        .deployedMarkerDeploy, .deployedMarkerDeploy .icon {
          color: #28a745;
        }
        .deployedMarkerUndeploy, .deployedMarkerUndeploy .icon {
          color: #dcdcdc;
        }
        &:after {
          content: "";
          clear: both;
        }
      }
    }
  }
}
</style>
