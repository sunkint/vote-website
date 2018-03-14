<template>
  <div class="container">
    <WebsiteHeader></WebsiteHeader>
    <div class="row">
      <div class="col s12 xl8 offset-xl2">
        <div class="main">
          <TextInput v-model.trim="form.title" label="投票标题" placeholder="……？" :maxlength="60" ref="title"></TextInput>
          <TextInput v-model.trim="form.description" label="投票描述（选填）" :maxlength="300" multiline></TextInput>
          <div class="option-list">
            <p class="group-title">投票选项（至少2项，至多26项）：</p>
            <TextInput v-for="(n, i) in form.options" :key="i" v-model.trim="form.options[i]" :label="`选项${i+1}`" :maxlength="40"></TextInput>
            <button class="btn waves-effect right" id="btnAddOption" @click="addOption" v-if="form.options.length < 26"><i class="material-icons left">add</i>添加选项</button>
            <br clear="all">
          </div>
          <p><label><input type="checkbox" v-model="form.multiSelect"> <span>允许多选</span></label></p>
          <div class="input-field" v-show="form.multiSelect" style="margin-top: 24px">
            <select v-model="form.maxSelectedCount" ref="multiSelect">
              <option :value="0">不设限制</option>
              <option v-for="n in multiSelectList" :key="n" :value="n">{{n}}</option>
            </select>
            <label>最多可选个数</label>
          </div>
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
import SwitchInput from '../common/components/SwitchInput.vue';
export default {
  data () {
    let date = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return {
      isBusy: false,
      errorTip: '',
      form: {
        title: '',
        description: '',
        options: ['', ''],
        multiSelect: false,
        maxSelectedCount: 0,
        deadline: 0,
        deadlineDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        deadlineTime: `${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`,
      }
    };
  },
  computed: {
    multiSelectList () {
      let list = [];
      for(let i = 2; i <= this.form.options.length; i++) {
        list.push(i);
      }
      return list;
    }
  },
  methods: {
    addOption () {
      this.form.options.push('');
    },
    submit () {
      let form = Object.assign({}, this.form);
      if(form.title.length === 0) {
        this.errorTip = '投票标题不能为空';
        this.$refs.title.focus();
        return;
      }
      let options = [];
      for(let o of form.options) {
        if(o !== '') options.push(o);
      }
      form.options = options;
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
      if(form.multiSelect && form.maxSelectedCount > options.length) {
        form.maxSelectedCount = options.length;
      }
      if(form.deadline === -1) {
        let expDate = new Date(`${form.deadlineDate} ${form.deadlineTime}`);
        if(expDate.getTime() < Date.now() + 60 * 60 * 1000) {
          this.errorTip = '投票截止时间不能短于1个小时';
          return;
        }
      }
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
    }
  },
  watch: {
    multiSelectList () {
      this.$nextTick(() => {
        M.Select.init(this.$refs.multiSelect);
      });
    }
  },
  components: {
    TextInput,
    SwitchInput,
  },
  mounted () {
    M.Select.init(this.$refs.multiSelect);
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
p.group-title {
  margin-bottom: 24px;
  margin-top: 16px;
}
#btnAddOption {
  background-color: white;
  color: #212121;
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