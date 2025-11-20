<script setup>
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  width: 100%;
}

#app {
  min-height: 100vh;
  width: 100vw;
  max-width: 100vw;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* 重置默认样式 */
* {
  box-sizing: border-box;
}

/* 确保所有元素都没有默认的margin和padding */
* {
  margin: 0;
  padding: 0;
}

/* 防止横向滚动条 */
body {
  overflow-x: hidden;
}

/* 确保所有元素都不会超出容器宽度 */
* {
  box-sizing: border-box;
  max-width: 100%;
}

/* 防止任何元素超出视窗宽度 */
*:not(:defined) {
  margin: 0;
  padding: 0;
}
</style>