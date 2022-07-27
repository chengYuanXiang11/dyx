import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
import user from "./modules/user";
import tagsView from "./modules/tagsView";
import permission from "./modules/permission";
import modelSelect from "./modules/modelSelect";
import flow from "./modules/flow";
import scheduling from './modules/scheduling'
import getters from "./getters";
Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        app,
        user,
        tagsView,
        permission,
        modelSelect,
        flow,
        scheduling

    },
    getters
});

export default store;
