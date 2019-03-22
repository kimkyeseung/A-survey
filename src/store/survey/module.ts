import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { Survey } from '../index';
import api from '@/api/api';
import store from '@/store';
import authenticatedModule from '@/store/authenticate/module';

@Module({ dynamic: true, namespaced: true, name: 'surveyModule', store })
class SurveyModule extends VuexModule {
  public surveys: Survey[] = [];

  @Mutation
  private mapSurveysToState(surveys: Survey[]) {
    this.surveys.splice(0, this.surveys.length);
    surveys.forEach((survey: Survey): void => {
      this.surveys.push(survey);
    });
  }

  @Mutation
  private addSurvey(item: Survey): void {
    this.surveys.push(item);
  }

  @Action
  fetchSurveyList() {
    api.getSurveyList()
      .then(res => {
        this.context.commit('mapSurveysToState', res.data);
      })
      .catch(() => {
        authenticatedModule.expiredLogginSession();
      });
  }

  @Action
  requestAddSurvey(item: Survey) {
    this.context.commit('addSurvey', item);
  }
}

export default getModule(SurveyModule)
