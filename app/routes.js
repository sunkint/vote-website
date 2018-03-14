import Index from './index/index.vue'
import AddVote from './index/AddVote.vue'
import AuthFromXzwhome from './auth/AuthFromXzwhome.vue'

export default [
  {path: '/', component: Index},
  {path: '/add', component: AddVote, name: 'add'},
  {path: '/auth/xzw/:token', component: AuthFromXzwhome},
]