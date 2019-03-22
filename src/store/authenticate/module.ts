import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { User } from '../index';
import router from '@/router';

@Module({ dynamic: true, namespaced: true, name: 'authenticateModule', store })
class AuthenticateModule extends VuexModule {
  public user: User = {
    name: ''
  };

  @Mutation
  private logIn({ name, token }: User) {
    this.user.name = name;
    if (token) localStorage.setItem('user', JSON.stringify({ name, token }));
    router.push('/');
  }

  @Mutation
  private logOut() {
    localStorage.removeItem('user');
    this.user.name = '';
    router.push('/login');
  }

  @Action
  requestLogIn({ name, token }: User): void {
    this.context.commit('logIn', { name, token });
  }

  @Action
  requestLogOut() {
    this.context.commit('logOut');
  }

  @Action
  expiredLogginSession() {
    alert('로그인 세션이 만료되었습니다.');
    this.context.commit('logOut');
  }
}

export default getModule(AuthenticateModule)
