<template>
  <div class="container">
    <WebsiteHeader></WebsiteHeader>
    <div class="row">
      <div class="col s12 xl8 offset-xl2">
        <div class="main">
          <TextInput v-model.trim="form.title" label="投票标题" placeholder="……？" :maxlength="60" ref="title"></TextInput>
          <TextInput v-model.trim="form.description" label="投票描述（选填）" :maxlength="300" multiline></TextInput>
          <div class="subvote-option">
            <label><input type="checkbox" v-model="isGroup"> <span>创建投票组</span></label>
          </div>
          <div class="sub-vote-list" :class="{group: isGroup}">
            <EditVoteItem :allowSubTitle="isGroup" v-for="i in subVoteCount" :index="i" :key="i" ref="subVotes"></EditVoteItem>
          </div>
          <p class="subvote-add" v-if="isGroup && subVoteCount < 10">
            <button class="btn waves-effect waves-light white black-text" @click="addSubVote"><i class="material-icons left">add</i>添加子投票</button>
          </p>
          <p v-show="subVoteCount >= 10">最多只能创建 10 组子投票</p>
          <div class="input-field" style="margin-top: 24px">
            <select v-model="form.deadline" ref="deadline">
              <option :value="0">不设限制</option>
              <option :value="3*60*60">3小时后</option>
              <option :value="24*60*60">1天后</option>
              <option :value="7*24*60*60">1周后</option>
              <option :value="-1">自定义</option>
            </select>
            <label>截止时间</label>
          </div>
          <div class="row">
            <div class="col s6">
              <div class="input-field" v-show="form.deadline === -1">
                <input type="text" class="datepicker" v-model="form.deadlineDate" @change="form.deadlineDate = $event.target.value" ref="customDeadlineDate">
              </div>
            </div>
            <div class="col s6">
              <div class="input-field" v-show="form.deadline === -1">
                <input type="text" class="timepicker" v-model="form.deadlineTime" @change="form.deadlineTime = $event.target.value" ref="customDeadlineTime">
              </div>
            </div>
          </div>
          <p>
            <button class="btn waves-effect waves-light teal lighten-1" @click="submit" :disabled="isBusy">发布<i class="material-icons right">send</i></button>
            <transition><span class="chip error-tip" v-if="!!errorTip">{{errorTip}}</span></transition>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TextInput from '../common/components/TextInput.vue';
import EditVoteItem from './components/EditVoteItem.vue';
export default {
  data () {
    let date = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return {
      isBusy: false,
      errorTip: '',
      isGroup: false,
      subVoteCount: 1,
      form: {
        title: '',
        description: '',
        subVotes: [],
        deadline: 0,
        deadlineDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        deadlineTime: `${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`,
      }
    };
  },
  methods: {
    submit () {
      let form = Object.assign({}, this.form);
      if(form.title.length === 0) {
        this.errorTip = '投票标题不能为空';
        this.$refs.title.focus();
        return;
      }

      form.subVotes = [];
      for(let subVote of this.$refs.subVotes) {
        form.subVotes.push(subVote.getData());
      }

      for(let subVote of form.subVotes) {
        if(this.isGroup) {
          if(subVote.title === '') {
            this.errorTip = '子投票标题不能为空';
            return;
          }
        }
        let options = [];
        subVote.options.map(v => {
          if(v !== '') options.push(v);
        });
        subVote.options = options;
        if(new Set(options).size !== options.length) {
          this.errorTip = '存在重复的选项，请检查';
          return;
        }
        if(options.length < 2) {
          this.errorTip = '投票应至少有2个选项';
          return;
        }
        if(options.length > 26) {
          this.errorTip = '投票应至多有26个选项';
          return;
        }
        if(subVote.maxSelectedCount > options.length) {
          subVote.maxSelectedCount = options.length;
        }
      }

      if(form.deadline === -1) {
        let expDate = new Date(`${form.deadlineDate} ${form.deadlineTime}`);
        if(expDate.getTime() < Date.now() + 60 * 60 * 1000) {
          this.errorTip = '投票截止时间不能短于1个小时';
          return;
        }
      }

      console.log(form);
      // return;

      // 提交投票
      this.isBusy = true;
      this.errorTip = '';
      this.$http.post('addVote', form).then(res => {
        M.toast({html: '发布投票成功'});
        this.$router.push('/');
      }, err => {
        this.isBusy = false;
        if(typeof err.body === 'object' && err.body != null && err.body.msg) {
          this.errorTip = err.body.msg;
        }else {
          alert('投票提交失败，请检查！');
        }
      });
    },
    addSubVote () {
      this.subVoteCount ++;
    }
  },
  watch: {
    isGroup (isGroup) {
      if(isGroup) {
        this.subVoteCount = 2;
      }else {
        this.subVoteCount = 1;
      }
    },
    errorTip (errorTip) {
      if(errorTip !== '') console.error(errorTip);
    }
  },
  components: {
    TextInput,
    EditVoteItem,
  },
  mounted () {
    M.Select.init(this.$refs.deadline);
    M.Datepicker.init(this.$refs.customDeadlineDate, {
      format: 'yyyy-mm-dd',
      firstDay: 1,
      minDate: new Date(),
      maxDate: new Date('2099-12-31'),
    });
    M.Timepicker.init(this.$refs.customDeadlineTime, {
      twelveHour: false,
      i18n: {clear: '清空', cancel: '取消', done: '好'}
    });
  }
}
</script>

<style lang="less" scoped>
div.main {
  margin-top: 20px;
}

div.sub-vote-list {
  &.group>div {
    border: 1px dashed #ccc;
    padding: 6px 12px;
    margin-left: -6px;
    margin-right: -6px;
    background-color: fade(#FFF, 20%);

    &:not(:last-child) {
      border-bottom: none;
    }
  }
}

div.subvote-option {
  margin-bottom: .5em;
}

p.subvote-add {
  margin-bottom: 36px;
}

span.error-tip {
  position: relative;
  top: 2px;
  margin-left: 6px;
  opacity: 1;

  &.v-enter-active, &.v-leave-active {
    transition: all .3s;
  }

  &.v-enter, .v-leave-to {
    opacity: 0;
  }
}
</style>