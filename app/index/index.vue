<template>
  <div class="container">
    <WebsiteHeader></WebsiteHeader>
    <div class="row">
      <div class="col s12 xl8 offset-xl2">
        <div class="main">

          <div class="handle-panel">
            <router-link to="/add" class="waves-effect waves-light btn"><i class="material-icons left">add</i>添加投票</router-link>
            <div class="user-info right chip" v-if="!!user.name" @click="logout">
              <img :src="user.avatar"> {{user.name}}
            </div>
            <a class="waves-effect waves-light btn right blue" @click="$bus.$emit('startLoginModal')" v-else><i class="material-icons left">person</i>登录</a>
          </div>

          <div class="card-list">
            <VoteItem :voteData="n" v-for="(n, i) in voteList" :key="i" />
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="fixed-action-btn">
      <a class="btn-floating btn-large red">
        <i class="large material-icons">add</i>
      </a>
      <ul>
        <li><a class="btn-floating red"><i class="material-icons">insert_chart</i></a></li>
        <li><a class="btn-floating yellow darken-1"><i class="material-icons">format_quote</i></a></li>
        <li><a class="btn-floating green"><i class="material-icons">publish</i></a></li>
        <li><a class="btn-floating blue"><i class="material-icons">attach_file</i></a></li>
      </ul>
    </div> -->
  </div>
</template>

<script>
import { getCookie, delCookie } from '../common/cookie';
import VoteItem from './components/VoteItem.vue';
export default {
  data () {
    return {
      user: getCookie('vote_user_uid') ? {
        name: localStorage.getItem('vote_user_name'),
        code: localStorage.getItem('vote_user_code'),
        avatar: localStorage.getItem('vote_user_avatar'),
      }: {
        name: null,
        code: null,
        avatar: null,
      },
      maxId: 0,
      voteList: [],
      hasMore: true,
    };
  },
  methods: {
    loadVoteList () {
      this.$http.get('getVoteList?maxId=' + this.maxId).then(res => {
        this.voteList.push(...res.body.list);
        this.maxId = this.voteList[this.voteList.length - 1].id;
        this.hasMore = this.maxId > 1;
      });
    },
    logout () {
      if(confirm('确实要退出账号吗？')) {
        delCookie('vote_user_uid');
        this.user.name = this.user.code = this.user.avatar = null;
      }
    }
  },
  components: {VoteItem},
  created () {
    this.loadVoteList();
  },
  mounted () {
    // M.FloatingActionButton.init(document.querySelector('.fixed-action-btn'));
  }
}
</script>

<style lang="less" scoped>
div.main {
  margin-top: 20px;
}

div.handle-panel {
  margin: 0 0 15px 0;
}

div.user-info {
  margin-top: 2px;
}
</style>
