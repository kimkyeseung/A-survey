<template>
  <h1 class="loading">{{word}}</h1>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Loading extends Vue {
  word: string = '로딩중';

  mounted(): void {
   setInterval((): void => {
     this.word += '.'
   }, 100); 
  }
}
</script>

<style lang="less">
  .loading {
    margin-top: 20px;
  }
</style>
