<template>
  <section class="main">
    <header>
      <span class="title">RoTea</span>
      <span class="handle">
        <i
          v-for="item in icons"
          :key="item.name"
          :class="['icon']"
          :style="{backgroundImage:`url(${getImg(item.name)})`}"
          @click="handleClickIcon(item.name)"
        ></i>
      </span>
    </header>
    <section class="dashbroad">
      <ul class="log">
        <li v-for="(item, index) in getLogs" :key="index">
          <span>Time: {{item.times | timeFormat}}</span>
          <span>事件类型: {{item.eventType }}</span>
          <span>内容：{{item.value}}</span>
          <span v-if="item.xpath">xpath: {{item.xpath }}</span>
        </li>
      </ul>
      <ul class="tips">
        <li v-for="(item, index) in getTips" :key="index">{{item | eventFilter}}</li>
      </ul>
    </section>
  </section>
</template>
<script>
import io from "socket.io-client";
import dayjs from "dayjs";

let Socket;

const eventHash = new Map()
  .set("click", "点击了元素")
  .set("change", "修改了元素")
  .set("select", "选择了文本");

export default {
  name: "Control",
  data: () => ({
    icons: [
      { name: "play" },
      // { name: "rec" },
      { name: "save" },
      { name: "screen" }
    ],
    allowIcon: [],
    logs: [],
    tips: []
  }),
  computed: {
    getLogs() {
      return this.logs;
    },
    getTips() {
      return this.tips.length < 10 ? this.tips : this.tips.slice(-15);
    },
    getAllowIcon() {
      if (!this.logs.length) {
        return this.icons.filter(({ name }) => name !== "play");
      }
    }
  },
  filters: {
    timeFormat(time) {
      return dayjs(time).format("YYYY-MM-DD hh:mm:ss");
    },
    eventFilter(data) {
      if (typeof data === "string") {
        return data;
      }
      return `你${eventHash.get(data.eventType)} ${data.target}`;
    }
  },
  methods: {
    getImg(name) {
      return require(`../assets/icon-${name}.svg`);
    },
    handleConnectSocket() {
      Socket = io.connect("ws://127.0.0.1:4190");
      this.tips.push("开始监听");
      Socket.on("log", data => {
        this.logs.push(data);
        this.tips.push(data);
      });
    },
    handleScreen() {
      const data = { eventType: "$screen", times: Date.now() };
      this.logs.push(data);
      this.tips.push("记录了截图断点");
    },
    handleClickIcon(name) {
      switch (name) {
        case "play":
          this.handleConnectSocket();
          break;
        case "screen":
          this.handleScreen();
        default:
          break;
      }
    }
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

    .handle {
      display: flex;

      .icon {
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 60%;
        display: flex;
        height: 50px;
        width: 50px;
        cursor: pointer;
        border-radius: 6px;

        &:active {
          box-shadow: 0 0 5px #fff;
        }
      }
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
      height: 80vh;
      max-height: 80vh;
      border: 2px solid #f1f1f1;
      border-radius: 6px;
      box-shadow: 0 0 10px #f1f1f1;
      background: rgba(68, 97, 123, 0.6);
      margin: 0 10px;
      padding: 15px;
      overflow-y: auto;

      li {
        list-style: none;
        width: 100%;
        overflow: auto;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin: 3px 0;

        span {
          font-size: 14px;
          color: #fff;
        }
      }
    }

    .tips {
      width: 250px;
      height: 80vh;
      margin: 0 10px;

      li {
        list-style: none;
        margin: 8px 0;
        padding: 5px 0;
        color: #fff;
        font-size: 14px;
        background: #788;
        border-radius: 6px;
        border: 1px solid #f1f1f1;
      }
    }
  }
}
</style>
