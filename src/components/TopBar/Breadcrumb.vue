<template>
  <b-breadcrumb>
    <b-breadcrumb-item
      v-for="(item, index) in breadcrumbItems"
      :key="index"
      @click="handleItemClick(item.path)"
      :text="item.meta.prefix
      ? `${item.meta.prefix} ${item.meta.title}`
      : item.meta.title" 
      :active="breadcrumbItems.length - 1 === index" />
  </b-breadcrumb>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { RouteRecord } from 'vue-router';
import navigateModule from '@/store/navigate/module';

@Component
export default class Breadcrumb extends Vue {
  private breadcrumbItems: RouteRecord[] = [];

  handleItemClick(path) {
    navigateModule.requestRouterPush(path);
  }

  created() {
    let matched: RouteRecord[] = this.$route.matched.filter(item => item.name);
    
    const first = matched[0];
    if (first && first.name !== 'SurveyLists') {
      matched = [{ meta: { title: '설문지 목록' }, path: '/survey' } as RouteRecord].concat(matched);
    }
    this.breadcrumbItems = matched.filter(item => item.meta && item.meta.title);
  }
}
</script>
