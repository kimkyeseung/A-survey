import Vue from 'vue';
import Router from 'vue-router';
import { SurveyLists, Log, Report, AddSurvey, Response, Login, Page404 } from '../pages/index';
import api from '@/api/api';
import authenticateModule from '@/store/authenticate/module';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/survey'
    }, {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: (to, from, next) => {
        const auth = localStorage.getItem('user');
        auth ? next('/survey') : next();
      }
    }, {
      path: '/survey',
      name: 'SurveyLists',
      meta: {
        title: '설문지 목록'
      },
      component: SurveyLists
    }, {
      path: '/survey/:id',
      name: 'addSurvey',
      meta: {
        title: '설문지 추가'
      },
      component: AddSurvey
    }, {
      path: '/response/:id',
      name: 'response',
      component: Response
    }, {
      path: '/report/:id',
      name: 'report',
      meta: {
        title: '리포트'
      },
      component: Report,
      beforeEnter: async (to, from, next) => {
        try {
          const { data } = await api.getSurveyDetail(to.params.id);
          to.meta.prefix = data.title;
          next();
        } catch (error) {
          next('/404')
        }
      }
    }, {
      path: '/log/:id',
      name: 'log',
      meta: {
        title: '참여자 로그'
      },
      component: Log,
      beforeEnter: async (to, from, next) => {
        try {
          const { data } = await api.getSurveyDetail(to.params.id);
          to.meta.prefix = data.title;
          next();
        } catch (error) {
          next('/404')
        }
      }
    }, {
      path: '/log/:id/:participant',
      name: 'particiapantDetail',
      component: Response
    },
    { path: '*', redirect: '/404' },
    { path: '/404', component: Page404 }
  ]
});

router.beforeEach((to, from, next) => {
  const publicPages = ['response', 'login'].includes(to.path.split('/')[1]);
  const auth = localStorage.getItem('user');

  if (auth) {
    to.path === '/login' ? next('/') : next();
  } else {
    publicPages ? next() : next('/login');
  }
});

export default router;
