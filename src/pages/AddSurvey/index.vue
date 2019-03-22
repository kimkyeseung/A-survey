<template>
  <div class="addSurvey ">
    <div class="topBarWrap">
      <div class="container">
        <topBar
          :button-click="handleSaveSurvey"
          button-text="설문지 저장"
          button-icon="save"
        />
      </div>
    </div>

    <div class="container">
      <b-form>
        <div class="addSurveyController">
          <b-button-group>
            <b-button size="sm" @click="onSortModal = !onSortModal">순서 조정</b-button>
            <b-modal
              v-model="onSortModal"
              modal-title="순서 조정"
              @ok="handleOk.call(this)"
            >
              <b-list-group class="modalItemList" ref="modalItemList">
                <b-list-group-item
                  v-for="(question, index) in survey.questions"
                  :key="index"
                  draggable
                  :id="index"
                  class="modalItemListItem"
                >
                  {{question.ask}}
                </b-list-group-item>
              </b-list-group>
            </b-modal>
            <b-button
              v-if="!isNew"
              size="sm"
              variant="danger"
              @click="handleDeleteSurvey.call(this)"
            >
              삭제
            </b-button>
          </b-button-group>
        </div>
        
        <b-card class="addSurveyCard">
          <b-form-group
            label="제목"
            label-class="surveyTitleLabel"
            label-for="surveyTitle"
            :invalid-feedback="invalidFeedback(survey.title, 5)"
            :state="state"
          >
            <b-form-input
              id="surveyTitle"
              type="text"
              placeholder="설문지 제목을 입력하세요"
              v-model.trim="survey.title"
              required
            />
          </b-form-group>
        </b-card>

        <b-card
          v-for="(question, index) in survey.questions"
          :key="index"
          class="addSurveyCard"
        >
          <b-form-group
            :label="`질문 #${index + 1}`"
            label-class="surveyQuestionLabel"
            :label-for="`surveyQuestion-${index}`"
            :invalid-feedback="invalidFeedback(survey.questions[index].ask, 10)"
            :state="state"
          >
            <b-form-input
              :id="`surveyQuestion-${index}`"
              class="surveyQuestion"
              type="text"
              placeholder="질문 내용을 입력하세요"
              v-model.trim="survey.questions[index].ask"
              required
            />
          </b-form-group>
          <b-button
            variant="dark"
            @click="handleDeleteQuestion(index)"
            class="surveyDeleteButton"
            size="sm"
          >
            삭제
            <v-icon name="trash-2"/>
          </b-button>

          <b-form-group
            label="타입 : "
            class="surveyAnswerTypeGroup"
            label-cols-lg="3"
          >
            <b-form-radio-group
              :id="`surveyAnswerType-${index}`"
              class="surveyAnswerType"
              buttons
              button-variant="outline-secondary"
              size="sm"
              v-model.trim="survey.questions[index].type" 
              :options="answerType"
            />
          </b-form-group>

          <b-card class="surveySelectionCard" v-if="question.type === 'yesNo'">
            <b-form-group      
              label-cols-sm="14"
              label-cols-lg="3"
              label="Yes : "
              :invalid-feedback="invalidFeedback(survey.questions[index].selections[0].name)"
              :state="state"
              :label-for="`selection-${index}-yes`"
              class="selectionGroup"
            >
              <b-form-input
                :id="`selection-${index}-yes`"
                type="text"
                v-model.trim="survey.questions[index].selections[0].name"
                required
              />
            </b-form-group>
            <b-form-group
              label-cols-sm="14"
              label-cols-lg="3"
              label="No : "
              :invalid-feedback="invalidFeedback(survey.questions[index].selections[1].name)"
              :state="state"
              :label-for="`selection-${index}-no`"
              class="selectionGroup"
            >
              <b-form-input
                :id="`selection-${index}-no`"
                type="text"
                v-model.trim="survey.questions[index].selections[1].name"
                :formatter="stringTrimer"
                required
              />
            </b-form-group>
          </b-card>

          <b-card class="surveySelectionCard" v-if="question.type === 'chooseOne' || question.type === 'chooseMany'">
            <div
              v-for="(selection, selectIndex) in question.selections"
              :key="selectIndex"
              class="selectionGroup"
            >
              <b-form-group
                :label="`${selectIndex + 1}번 : `"
                :label-for="`selection-${index}-${selectIndex}`"
                :invalid-feedback="invalidFeedback(question.selections[selectIndex].name)"
                :state="state"
                label-cols-sm="14"
                label-cols-lg="3"
              >
                <b-form-input 
                  :id="`selection-${index}-${selectIndex}`"
                  v-model.trim="question.selections[selectIndex].name"
                  type="text"
                  required
                />
              </b-form-group>
              <b-button
                v-if="question.selections.length > 2"
                size="sm"
                variant="outline-secondary"
                class="selectionDeleteButton"
                @click="handelDeleteSelection(index, selectIndex)"
              >
                삭제
                <v-icon name="trash-2"/>
              </b-button>
            </div>
            <div class="addSelectionButton">
              <b-button size="sm" @click="handleAddSelection(index)">선택 항목 추가</b-button>
            </div>
          </b-card>
          
        </b-card>
        <div class="addQuestionButton">
          <b-button variant="dark" @click="handleAddQuestion">질문 추가</b-button>
        </div>
      </b-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import store, { Survey, AnswerType } from '@/store/index';
import { TopBar } from '@/components';
import surveyModule from '@/store/survey/module';
import authenticateModule from '@/store/authenticate/module';
import navigateModule from '@/store/navigate/module';
import api from '@/api/api';
import { validator } from '@/helpers/global';
import { AxiosResponse, AxiosPromise } from 'axios';

@Component({ components: { TopBar } })
export default class AddSurvey extends Vue {
  $refs!: {
    modalItemList: HTMLElement
  }

  isNew: boolean = false;
  survey: Survey = {
    _id: '',
    title: '',
    questions: [{
      ask: '',
      type: 'yesNo',
      selections: [
        { name: '', value: 0 },
        { name: '', value: 0 }
      ]
    }],
    is_deployed: false
  };
  answerType: AnswerType[] = [
    { text: 'Yes / No', value: 'yesNo'},
    { text: '한 개 선택', value: 'chooseOne'},
    { text: '여러개 선택', value: 'chooseMany'}
  ];
  onSortModal: boolean = false;
  state: boolean = false;

  invalidFeedback(input: string, length: number = 0): string {
    if (input.length === 0) {
      return '';
    }
    if (input.length < length) {
      return `${length} 글자 이상이어야 합니다.`
    }
    return validator(input) ? '' : '유효하지 않은 입력입니다.';
  }
  
  stringTrimer(value: string): string {
    return value === ' ' 
    ? '' 
    : value.split('  ').filter(word => !!word).join(' ');
  }

  handleAddQuestion(): void {
    const newQuestion = {
      ask: '',
      type: 'yesNo',
      selections: [
        { name: '', value: 0 },
        { name: '', value: 0 }
      ]
    };
    this.survey.questions.push(newQuestion);
  }

  handleSaveSurvey(ev): void {
    ev.preventDefault();
    const result: Promise<AxiosResponse> = this.isNew
    ? api.createSurvey(this.survey)
    : api.modifySurvey(this.survey);
    result.then(() => {
      this.$router.push({
        path: '/survey'
      });
    })
    .catch(err => {
      authenticateModule.expiredLogginSession();
    });
  }

  handleDeleteSurvey(): void {
    const result = api.deleteSurvey(this.survey._id);
    result.then(() => {
      this.$router.push({
        path: '/survey'
      });
    });
  }

  handleAddSelection(index: number): void {
    this.survey.questions[index].selections.push({ name: '', value: 0 });
  }

  handleOpenSortModal(): void {
    this.onSortModal = true;
  }

  handleDeleteQuestion(index: number): void {
    this.survey.questions.splice(index, 1);
  }

  handelDeleteSelection(questionIndex: number, selectionIndex: number): void {
    this.survey.questions[questionIndex].selections.splice(selectionIndex, 1);
  }

  handleItemDrop(target, item): void {
    this.$refs.modalItemList.insertBefore(target, item);
  }

  handleDragStart(ev): void {
    ev.dataTransfer.setData('question', ev.target.id);
  }

  handleDragOver(ev: DragEvent): void {
    ev.preventDefault();
  }

  handleDragEnter(ev): void {
    if (ev.target.classList.contains('modalItemListItem')) {
      if (ev.offsetY < ev.target.offsetHeight / 2) {
        ev.target.style.borderTop = '1px solid blue';
      } else {
        ev.target.style.borderbottop = '1px solid green';
      }
    }
  }
  
  handleDragLeave(ev): void {
    if (ev.target.classList.contains('modalItemListItem')) {
      ev.target.style.border = '';
    }
  }

  handleDrop(ev) {
    if (ev.target.classList.contains('modalItemListItem')) {
      ev.target.style.border = '';
      const data = ev.dataTransfer.getData('question');
      if (ev.offsetY < ev.target.offsetHeight / 2) {
        this.$refs.modalItemList && this.$refs.modalItemList.insertBefore(document.getElementById(data), ev.target);
      } else {
        this.$refs.modalItemList && this.$refs.modalItemList.insertBefore(ev.target, document.getElementById(data));
      }
    }
  }

  handleOk() {
    const newOrder = Array.prototype.slice.call(this.$refs.modalItemList.children, 0).map(item => this.survey.questions[Number(item.id)]);
    this.survey.questions = newOrder;
  }

  mounted() {
    this.survey._id = this.$route.params.id;
    api.getSurveyDetail(this.survey._id)
      .then((res: AxiosResponse): void => {
        this.survey = {...this.survey, ...res.data};
      })
      .catch((err: Error): void => {
        this.isNew = true;
      });
    document.addEventListener('dragstart', this.handleDragStart.bind(this));
    document.addEventListener('dragover', this.handleDragOver.bind(this));
    document.addEventListener('dragenter', this.handleDragEnter.bind(this));
    document.addEventListener('dragleave', this.handleDragLeave.bind(this));
    document.addEventListener('drop', this.handleDrop.bind(this));
  }

  beforeDestroy(): void {
    this.isNew = false;
  }
}
</script>

<style lang='less'>
@darkGray: #6c757d;
.addSurvey {
  text-align: left;
  .topBarWrap {
    background: white;
    padding-bottom: 4px;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .1);
  }
  .addSurveyController {
    text-align: right;
    .modalItemList {
      .modalItemListItem {
        box-sizing: border-box;
        &:hover {
          background: #fefefe
        }
      }
    }
  }
  .addSurveyCard {
    margin: 20px 0;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .1);
    position: relative;
    .surveyTitleLabel {
      margin-top: 10px;
      padding-bottom: 10px;
      font-size: 20px;
      font-weight: bold;
    }
    #surveyTitle {
      border: 0;
      border-bottom: 4px solid @darkGray;
      border-radius: 0;
      background-color: rgba(255, 255, 255, 0);
    }

    .surveyAnswerTypeGroup {
      margin-top: 40px;
      font-size: 18px;
      font-weight: bold;
      .surveyAnswerType {
        width: 100%;
        float: left;
        border: 0;
        &:after {
          clear: both;
        }
      }
    }

    .surveyQuestionLabel {
      margin-top: 10px;
      padding-bottom: 10px;
      font-size: 18px;
      font-weight: bold;
    }
    .surveyQuestion {
      border: 0;
      border-bottom: 3px solid @darkGray;
      border-radius: 0;
      background-color: rgba(255, 255, 255, 0);
    }
    .surveyDeleteButton {
      position: absolute;
      top: 24px;
      right: 24px;
      height: 38px;
      font-size: 0;
      border-radius: 25px;
      opacity: .8;
      .icon {
        width: 20px;
      }
    }
    .surveySelectionCard {
      box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .1);
      .addSelectionButton {
        display: block;
        margin: 0 auto;
      }
      .selectionGroup {
        position: relative;
        .selectionDeleteButton {
          font-size: 0;
          position: absolute;
          bottom: 4px;
          right: 4px;
          border: 0;
          border-radius: 100%;
          padding: 6px;
          .icon {
            width: 20px;
          }
        }
      }
      .addSelectionButton {
        text-align: center;
      }
    }
  }
  .addQuestionButton {
    text-align: center;
  }
}
</style>