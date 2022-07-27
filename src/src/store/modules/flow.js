const state = {
    form_fields:[]
};

const mutations = {
    SET_FIELDS: (state, data) => {
        state.form_fields = data;
    },
};

const actions = {
    commit_fields({
        commit
    }, data) {
        commit("SET_FIELDS", data);
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
