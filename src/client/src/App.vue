<template>
  <div id="app">
    <Control />
  </div>
</template>

<script>
import Control from "@/components/Control";
export default {
  name: "app",
  components: {
    Control
  }
};
</script>
<style lang="stylus">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}

#app {
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
