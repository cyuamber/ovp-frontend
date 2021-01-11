const login = {
  state: {
    account: '',
    AUTHORITY: 'admin'
  },
  mutations: {
    //set user info
    setUser(state, value) {
      state.account = value.username
      localStorage.setItem('user', JSON.stringify(value))
    },
    //remove user info
    removeUser(state) {
      state.account = null
      localStorage.removeItem('user')
    }
  },
  getters: {
    getuserAuth: state => {
      return state.AUTHORITY
    }
  },
  actions: {}
}

export default login
