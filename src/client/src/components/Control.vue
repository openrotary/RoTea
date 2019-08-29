<template>
  <section class="main">
    <header>
      <span class="title">RoTea</span>
      <span>图标</span>
    </header>
    <section class="dashbroad">
      <ul class="log">
        <li v-for="item in getLogs" :key="item.times"></li>
      </ul>
      <ul class="tips">
        <li v-for="(item, index) in getTips" :key="index"></li>
      </ul>
    </section>
  </section>
</template>
<script>
import io from "socket.io-client";

export default {
  name: "Control",
  data: () => ({ logs: [], tips: [] }),
  computed: {
    getLogs() {
      return this.logs;
    },
    getTips() {
      return this.tips.length < 10 ? this.tips : this.tips.slice(0, -10);
    }
  },
  beforeMount() {
    const socket = io("ws://127.0.0.1:4190");
    socket.on("connection", () => {
      socket.emit("new", "client is connect");
      socket.on("news", msg => {
        console.log(msg);
      });
    });
  }
};
</script>
<style lang="stylus" scoped>
.main {
  height: 100%;
  display: flex;
  flex-direction: column;

  header {
    flex-shrink: 0;
    height: 60px;
    background: #44617b;
    box-shadow: 0 0 15px rgba(68, 97, 123, 0.6);
    color: #f1f1f1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 50px;

    .title {
      font-size: 28px;
      font-weight: 800;
      font-family: 'Trebuchet Ms', '文泉驿等宽微米黑';
    }
  }

  .dashbroad {
    flex: 1;
    background-image: url('../assets/texture.png');
    background-color: rgba(105, 138, 171, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;

    .log {
      width: 500px;
      height: 80%;
      border: 2px solid #f1f1f1;
      border-radius: 6px;
      box-shadow: 0 0 10px #f1f1f1;
      background: rgba(68, 97, 123, 0.6);
      margin: 0 10px;
    }

    .tips {
      width: 250px;
      height: 80%;
      margin: 0 10px;

      li {
        background: #788;
        border-radius: 6px;
        border: 1px solid #f1f1f1;
      }
    }
  }
}
</style>