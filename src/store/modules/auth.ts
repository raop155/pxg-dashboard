interface Module {
  username: string;
  name: string;
  lastname: string;
  status: boolean;
}

function defaultState() {
  return {
    username: '',
    name: '',
    lastname: '',
    status: false,
  };
}

function getState(option = 'default'): object {
  if (option === 'sessionStorage') {
    if (sessionStorage.getItem('authData')) {
      const authData: object = JSON.parse(sessionStorage.getItem('authData')!);
      return authData;
    }
  }

  return {
    username: '',
    name: '',
    lastname: '',
    status: false,
  };
}

export default {
  namespaced: true,
  state: getState('sessionStorage'),
  getters: {
    state: (state: Module) => state,
    userame: (state: Module) => state.username,
    name: (state: Module) => state.name,
    lastname: (state: Module) => state.lastname,
    status: (state: Module) => state.status,
  },
  mutations: {
    LOG_IN(state: Module, userData: any) {
      console.log('LOG_IN');

      state.username = userData.username;
      state.name = userData.name;
      state.lastname = userData.lastname;
      state.status = userData.status;

      sessionStorage.setItem('authData', JSON.stringify(state));
    },
    LOG_OUT(state: Module) {
      console.log('LOG_OUT');
      Object.assign(state, defaultState());
    },
  },
  actions: {
    logIn({ commit }: any, userData: any) {
      commit('LOG_IN', userData);
    },
  },
};
