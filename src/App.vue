<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
@import (css) 'https://fonts.googleapis.com/css?family=Noto+Sans+KR';
@iconColor: #dcdcdc;
@darkGray: #6c757d;
#app {
  font-family: 'Noto Sans KR', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  transition: .2s;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.icon {
  width: 20px;
  color: @iconColor;
}
</style>
