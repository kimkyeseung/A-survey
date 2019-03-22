<template>
  <div class="login">
    <background />
    <b-card class="loginCard" :title="title">
      <b-form @submit.prevent="handleLgoin" class="loginForm">
        <b-form-group
          label="ID"
          label-for="loginId"
          class="loginIdGroup">
          <v-icon name="user"/>
          <b-form-input
            id="loginId"
            type="text"
            required>
          </b-form-input>
        </b-form-group>

        <b-form-group
          label="PW"
          label-for="password"
          class="passwordGroup">
          <v-icon name="lock"/>
          <span class="passwordVisibleTrigger" @click="() => {passwordType = passwordType === 'password' ? 'text' : 'password'}">
            <v-icon v-if="passwordType === 'password'" name="eye-off"/>
            <v-icon v-else name="eye"></v-icon>
          </span>
          <b-form-input
            id="password"
            :type="passwordType"
            required/>
        </b-form-group>
        <b-button class="loginButton" block type="submit" variant="dark">로그인</b-button>
              
      </b-form>
    </b-card>

    <b-card
      v-if="loginErrorMessage"
      bg-variant="danger"
      text-variant="white"
      class="loginError">
      <p class="card-text">{{loginErrorMessage}}</p>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Background from './background.vue';
import api from '@/api/api';
import authenticateModule from '@/store/authenticate/module';

@Component({ components: { Background }})
export default class Login extends Vue {
  title: string = '설문조사 플랫폼 어드민';
  loginErrorMessage: string = '';

  passwordType = 'password';

  handleLgoin(ev): void {
    api.login({
      login_id: ev.target.loginId.value,
      password: ev.target.password.value
    }).then(res => {
      switch (res.data.message) {
        case 'noAccount':
          this.$nextTick(() => {
            this.loginErrorMessage = '아이디가 올바르지 않습니다.';
          });
          return;
        case 'incorrectPasswrd': 
          this.$nextTick(() => {
            this.loginErrorMessage = '비밀번호가 올바르지 않습니다.';
          });
          return;
        case 'success': 
          this.$nextTick(() => {
            this.loginErrorMessage = '';
            authenticateModule.requestLogIn({name: res.data.name, token: res.data.token});
          });
          return;
        default:
          this.$nextTick(() => {
            this.loginErrorMessage = '아이디가 올바르지 않습니다.';
          });
          return;
      }
    });
  }
}
</script>

<style lang='less' scoped>
  .login {
    max-width: 400px;
    margin: 0 auto;
    .loginCard {
      margin-top: 30%;
      background: rgba(255, 255, 255, 0.9);
      .loginForm {
        margin-top: 20px;
        text-align: left;
        .loginIdGroup {
          position: relative;
          .icon-user {
            bottom: 8px;
            left: 8px;
          }
          #loginId {
            text-indent: 24px;
          }
        }
        .passwordGroup {
          position: relative;
          .icon-lock {
            bottom: 8px;
            left: 8px;
          }
          #password {
            text-indent: 24px;
          }
          .passwordVisibleTrigger {
            position: absolute;
            width: 20px;
            color: black;
            right: 12px;
            bottom: 30px;
          }
        }
        .loginButton {
          padding: 10px;
        }
      }
    }
    .loginError {
      margin-top: 12px;
    }
  }

  .icon {
    position: absolute;
  }
</style>
