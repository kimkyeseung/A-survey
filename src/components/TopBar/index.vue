<template>
  <div class="topBar">
		<b-navbar>
			<b-navbar-brand @click="handleRoute('/')">{{title}}</b-navbar-brand>
			<b-nav-form class="topBarUtil">
				<b-nav-text>{{user.name}}님 안녕하세요.</b-nav-text>
				<b-button size="sm" variant="link" @click="handleLogout">로그아웃</b-button>
			</b-nav-form>
		</b-navbar>
		
		<div class="topBarNavWrap">
			<Breadcrumb  class="topBarNav" />
			<b-button
				v-if="buttonClick"
				size="sm"
				type="submit"
				@click="buttonClick"
				class="topBarButton"
				variant="dark"
			>
				<v-icon :name="buttonIcon"></v-icon>
				{{buttonText}}
			</b-button>
		</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import store from '@/store/index';
import Breadcrumb from './Breadcrumb.vue';
import { Survey, User } from '@/store/interface';
import surveyModule from '@/store/survey/module';
import navigateModule from '@/store/navigate/module';
import authenticateModule from '@/store/authenticate/module';

@Component({ components: { Breadcrumb }})
export default class TopBar extends Vue {
	@Prop({ default: null }) private buttonClick!: () => void;
	@Prop({ default: '' }) private buttonText!: string;
	@Prop({ default: null }) private buttonIcon!: SVGElement;

  title = '설문조사 관리자';

  get surveys(): Survey[] {
    return surveyModule.surveys;
  }
	
	get user(): User {
		return authenticateModule.user;
	}

  handleRoute(path: string): void {
		navigateModule.requestRouterPush(path);
  }

  handleLogout(): void {
		authenticateModule.requestLogOut();
  }
}
</script>

<style lang="less">
	.topBar {
		position: relative;
		background: white;
		.topBarUtil {
			position: absolute;
			right: 0;
		}
		.topBarNavWrap {
			position: relative;
			.topBarNav {
				font-size: 16px;
			}
			.topBarButton {
				position: absolute;
				top: 10px;
				right: 10px;
				color: white;
				.icon {
					width: 16px;
					margin-bottom: 2px;
				}
			}
		}
	}
</style>
