import { createApp } from "vue";
import App from "./App.vue";
// import com from "./components/index";
const app = createApp(App);
import Message from "./components/Message";
app.use({
  install(app) {
    app.component("Message", Message);
    app.config.globalProperties["$message"] = Message;
  },
});

app.mount("#app");
