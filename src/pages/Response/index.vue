<template>
  <div class="response container">
    <loading v-if="loading"/>
    <div v-else-if="!participantName" class="startResponse">
      <b-card class="startResponseCard" :title="survey.title">
        <b-form @submit.prevent="participate">
          <b-form-group
            label="이름"
            label-for="participantName"
            label-cols-sm="14"
            label-cols-lg="3">
            <b-form-input
              id="participantName"
              type="text"
              required/>
          </b-form-group>
          <b-button type="submit" variant="primary">설문조사 시작</b-button>
        </b-form>
      </b-card>

      <b-card
        v-if="participateError"
        bg-variant="danger"
        text-variant="white"
        class="participateError">
        <p class="card-text">{{participateError}}</p>
      </b-card>
    </div>
    <div v-else class="responseMain">
      <h3 v-if="participantDetail" class="responseHeader">{{participantName}}님의 설문조사 참여 내역입니다.</h3>
      <h3 v-else class="responseHeader">안녕하세요. {{participantName}}님 설문조사를 시작합니다.</h3>
      <b-form @submit.prevent="handleResponseSubmit">
        <b-card
          v-for="(question, index) in survey.questions"
          :key="index"
          class="responseQuestion">

          <b-form-group
            v-if="question.type === 'yesNo'"
            :label="question.ask"
            :label-for="`responseQuestion-${index}`"
            label-cols-sm="14"
            label-cols-lg="3">
            <b-form-text class="responseQuestionDescription">yes / no로 대답해 주세요.</b-form-text>
            <b-form-radio-group
              :id="`responseQuestion-${index}`"
              v-model="answers[index][0]"
              :disabled="participantDetail"
              required>
              <b-form-radio class="yes" value="0"><span class="yesNoSelection">YES : </span>{{question.selections[0].name}}</b-form-radio>
              <b-form-radio class="no" value="1"><span class="yesNoSelection">NO : </span>{{question.selections[1].name}}</b-form-radio>
            </b-form-radio-group>
          </b-form-group>

          <b-form-group
            v-if="question.type === 'chooseOne'"
            :label="question.ask"
            :label-for="`responseQuestion-${index}`"
            label-cols-sm="14"
            label-cols-lg="3">
            <b-form-radio-group
              :id="`responseQuestion-${index}`"
              v-model="answers[index][0]"
              :disabled="participantDetail"
              :options="question.selections.map((selection, index) => {
                return { text: selection.name, value: String(index) };
              })"
              required />
          </b-form-group>

          <b-form-group
            v-if="question.type === 'chooseMany'"
            :label="question.ask"
            :label-for="`responseQuestion-${index}`"
            label-cols-sm="14"
            label-cols-lg="3">
          <b-form-text class="responseQuestionDescription">여러 개 선택이 가능합니다.</b-form-text>
            <b-form-checkbox-group
              :id="`responseQuestion-${index}`"
              v-model="answers[index]"
              :disabled="participantDetail"
              :options="question.selections.map((selection, index) => {
                return { text: selection.name, value: String(index) };
              })"
              invalid />
          </b-form-group>
        </b-card>
        <b-button v-if="!participantDetail" type="submit" variant="primary">설문조사 완료</b-button>
      </b-form>
    </div>

    <b-modal hide-footer v-model="completeModal">
      <p>설문조사 참여가 완료되었습니다.</p>
      <b-button @click="completeModal = false">닫기</b-button>
    </b-modal>
  </div>
</template>

<script lang="ts">
import api from '../../api/api';
import { Vue, Component } from 'vue-property-decorator';
import { Loading } from '../../components/index';
import store, { Survey, Question } from '../../store/index';

@Component({ components: { Loading }})
export default class Response extends Vue {
  loading: boolean = true;
  participantDetail: boolean = false;
  participantName: string = '';
  participateError: string = '';
  survey: Survey = {
    _id: '',
    title: '',
    questions: []
  };
  answers: string[][] = [];
  completeModal: boolean = false;

  async participate(ev): Promise<void> {
    const result = await api.getResponseDetail(this.$route.params.id, ev.target.participantName.value);
    if (result.data.response) {
      this.participateError = '이미 참여하셨습니다.';
      this.participantName = '';
    } else {
      this.participantName = ev.target.participantName.value;
      this.participateError = '';
    }
  }

  handleResponseSubmit(): void {
    api.submitResponse({
      survey_id: this.$route.params.id,
      creation_date: new Date(),
      participant: this.participantName,
      answers: this.answers
    })
      .then((): void => {
        this.completeModal = true;
        this.participantName = '';
        this.participateError = '';
      });
  }

  async created() {
    const surveyDetail = await api.getSurveyDetail(this.$route.params.id);
    if (!surveyDetail.data.is_deployed) {
      alert('아직 배포되지 않은 설문지입니다.');
      this.$router.push('/');
    }
    this.survey._id = surveyDetail.data._id;
    this.survey.title = surveyDetail.data.title;
    this.survey.questions = surveyDetail.data.questions;
    this.answers = surveyDetail.data.questions.map((question: Question, index: number): string[][] => {
      return [];
    });
    if (this.$route.params.participant) {
      this.participantDetail = true;
      this.participantName = this.$route.params.participant;
      const responseResults = await api.getResponseDetail(this.$route.params.id, this.participantName);
      this.answers = responseResults.data.response.answers;
    }
    this.loading = false;
  }
}
</script>


<style lang="less">
  .response {
    .startResponse {
      max-width: 400px;
      margin: 0 auto;
      .startResponseCard {
        margin-top: 20%;
      }
      .participateError {
        margin-top: 20px;
      }
    }
    .responseMain {
      .responseHeader {
        margin-top: 10%;
      }
      .responseQuestion {
        margin: 20px 0;
        .responseQuestionDescription {
          margin-bottom: 10px;
        }
      }
      .yesNoSelection {
        color: red;
      }
    }
  }
</style>
