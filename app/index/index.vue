<template>
  <div class="container">
    <WebsiteHeader></WebsiteHeader>
    <div class="row">
      <div class="col s12 xl8 offset-xl2">
        <div class="main">

          <div class="handle-panel">
            <a href="javascript:;" class="waves-effect waves-light btn" @click="addVote"><i class="material-icons left">add</i>添加投票</a>
            <div class="user-info right chip" v-if="!!user.name" @click="logout">
              <img :src="user.avatar"> {{user.name}}
            </div>
            <a class="waves-effect waves-light btn right blue" @click="$bus.$emit('startLoginModal')" v-else><i class="material-icons left">person</i>登录</a>
          </div>

          <div class="card-list">
            <VoteItem :voteData="n" v-for="(n, i) in voteList" :key="i" />
          </div>
          <div class="loading-tip">
            <span v-if="isComplete">全部加载结束</span>
            <span v-if="!isComplete && isLoading">正在加载…</span>
            <a href="javascript:;" v-if="!isComplete && !isLoading" @click="loadVoteList">点此继续加载</a>
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
      isLoading: false,
      isComplete: false,
      maxId: 0,
      voteList: [],
    };
  },
  methods: {
    loadVoteList () {
      if(this.isLoading || this.isComplete) return;
      this.isLoading = true;
      this.$http.get('getVoteList?maxId=' + this.maxId).then(res => {
        this.voteList.push(...res.body.list);
        if(this.voteList.length == 0) this.maxId = -1;
        else this.maxId = this.voteList[this.voteList.length - 1].id;
        this.isComplete = res.body.complete;
        this.isLoading = false;
      }).catch(err => {
        M.toast({html: '加载失败'});
        this.isLoading = false;
      });
    },
    logout () {
      if(confirm('确实要退出账号吗？')) {
        delCookie('vote_user_uid');
        this.user.name = this.user.code = this.user.avatar = null;
      }
    },
    addVote () {
      if(this.user.name === null) {
        M.toast({html: '请先登录', displayLength: 2000});
        this.$bus.$emit('startLoginModal');
      }else {
        this.$router.push('/add');
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

div.loading-tip {
  text-align: center;
}
</style>
