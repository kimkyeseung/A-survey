import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import router from '../../router';

@Module({ dynamic: true, namespaced: true, name: 'navigateModule', store })
class NavigateModule extends VuexModule {
  @Action
  requestRouterPush(path: string) {
    router.push(path);
  }
}

export default getModule(NavigateModule)
