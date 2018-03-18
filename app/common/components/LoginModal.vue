<template>
  <div id="modal-login" ref="modal" class="modal">
    <div class="modal-content">
      <h4>登录</h4>
      <div class="row">
        <div class="col s6 login-item">
          <div class="waves-effect" @click="loginFromXzwhome">
            <img src="../../assets/xzw_128.png" alt="骁之屋">
            <p>骁之屋账号</p>
          </div>
        </div>
        <div class="col s6 login-item">
          <div class="waves-effect" @click="loginFromWeChat">
            <img src="../../assets/wechat_128.png" alt="微信">
            <p>微信账号</p>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <a class="modal-action modal-close waves-effect waves-green btn-flat">取消</a>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    loginFromXzwhome () {
      if(this.$isProduction) {
        location = 'https://www.ybusad.com/user/authorize/vote.php';
      }else {
        location = 'http://home.me/user/authorize/vote.php';
      }
    },
    loginFromWeChat () {
      M.toast({html: '微信登录建设中', displayLength: 2500});
    }
  },
  mounted () {
    let instance = M.Modal.init(this.$refs.modal);
    this.$bus.$on('startLoginModal', () => {
      if(!instance.isOpen) instance.open();
    })
  }
}
</script>

<style lang="less" scoped>
div#modal-login {
  max-width: 600px;

  div.row {
    margin-bottom: 0;
    margin-top: 36px;
  }

  .login-item {
    text-align: center;

    &>div {
      display: block;
      padding: 40px 0;
    }

    img {
      display: inline-block;
      width: 96px;
      height: 96px;
    }
  }
}
</style>