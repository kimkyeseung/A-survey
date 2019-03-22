<template>
  <div class="page404">
    <h2>404 Not Found..</h2>
    <b-button class="buttonToHome" @click="handleClickHome">홈으로</b-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import navigateModule from '@/store/navigate/module';

@Component
export default class Page404 extends Vue {
  handleClickHome() {
    navigateModule.requestRouterPush('/');
  }
}
</script>

<style lang="less">
  .page404 {
    h2 {
      margin-top: 10%;
    }
    .buttonToHome {
      margin-top: 20px;
    }
  }
</style>
