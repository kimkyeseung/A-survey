<template>
  <div class="background" @mousemove="backgroundEffect">
    <img src="@/assets/background.jpg" ref="backgroundImage" :style="{ marginLeft: `${xPosition}px`, marginTop: `${yPosition}px`}">
    <div class="backgroundCover"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component
export default class LoginBackground extends Vue {
  $refs!: {
    backgroundImage: HTMLImageElement
  }

  xPosition: number = 0;
  yPosition: number = 0;

  show = true;

  backgroundEffect(ev): void {
    const verticalHalf = window.innerHeight / 2;
    const horizontalHalf = window.innerWidth / 2;
    this.xPosition = Number(((horizontalHalf - ev.clientX) * 0.05).toFixed(2));
    this.yPosition = Number(((verticalHalf - ev.clientY) * 0.05).toFixed(2));
  }
}
</script>

<style lang="less">
  .background {
    min-height: 100%;
    min-width: 100%;
    img {
      position: fixed;
      top: 0;
      left: 0;
      min-width: inherit;
      min-height: inherit;
      transition: .2s;
      transform: scale(1.2);
    }
    .backgroundCover {
      min-width: inherit;
      min-height: inherit;
      background: black;
      opacity: .7;
      position: fixed;
      top: 0;
      left: 0;
    }
  }
</style>

