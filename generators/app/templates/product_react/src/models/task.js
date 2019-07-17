// import { actions } from 'mirrorx';

export default {
    name: 'task',

    initialState: {
        loading: false,
    },

    reducers: {
        setLoading(state, loading = true) {
            return {
                ...state,
                loading,
            };
        },
    },

    effects: {
        async getJobDetail() {
            const result = await G.api.getJobDetail({});
            console.log('result', result);
        },
    },
};
