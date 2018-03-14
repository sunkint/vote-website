<template>
  <div class="container">
    <WebsiteHeader></WebsiteHeader>
    <div class="row">
      <div class="col s12 xl8 offset-xl2">
        <div class="main">
          <div class="card grey lighten-5">
            <div class="card-content">
              <span class="card-title">正在登录…</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setCookie } from '../common/cookie';
export default {
  mounted () {
    let token = this.$route.params.token;
    this.$http.post('getAuth/xzwhome', {token}).then(res => {
      setCookie('vote_user_uid', res.body.uid);
      localStorage.setItem('vote_user_name', res.body.name);
      localStorage.setItem('vote_user_code', res.body.code);
      localStorage.setItem('vote_user_avatar', res.body.avatar);
      M.toast({html: '登录成功', displayLength: 2000});
      this.$router.replace('/');
    }).catch(err => {
      alert('授权失败，请重试！');
      this.$router.replace('/');
    });
  }
}
</script>

<style lang="less" scoped>
div.container {
  margin-top: 20px;
}
</style>
