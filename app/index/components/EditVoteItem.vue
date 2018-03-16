<template>
  <div class="vote-edit-item">
    <div class="sub-title" v-show="allowSubTitle">
      <p class="group-title vote-index">子投票 {{index}}</p>
      <TextInput v-model.trim="title" label="子投票标题" placeholder="……？" :maxlength="60" ref="title"></TextInput>
      <TextInput v-model.trim="description" label="子投票描述（选填）" :maxlength="120" multiline></TextInput>
    </div>
    <div class="option-list">
      <p class="group-title">投票选项（至少2项，至多26项）：</p>
      <TextInput v-for="(n, i) in options" ref="inputs" :key="i" v-model.trim="options[i]" :label="`选项${i+1}`" :maxlength="40"></TextInput>
      <button class="btn waves-effect right white black-text" @click="addOption" v-if="options.length < 26"><i class="material-icons left">add</i>添加选项</button>
      <br clear="all">
    </div>
    <div class="multi-option">
      <label><input type="checkbox" v-model="multiSelect"> <span>允许多选</span></label>
    </div>
    <div class="input-field" v-show="multiSelect" style="margin-top: 24px">
      <select v-model="maxSelectedCount" ref="multiSelect">
        <option :value="0">不设限制</option>
        <option v-for="n in multiSelectList" :key="n" :value="n">{{n}}</option>
      </select>
      <label>最多可选个数</label>
    </div>
  </div>
</template>

<script>
import TextInput from '../../common/components/TextInput.vue';
export default {
  props: {
    allowSubTitle: Boolean,
    index: {
      type: Number,
      default: 0,
    }
  },
  data () {
    return {
      title: '',
      description: '',
      options: ['', ''],
      maxSelectedCount: 1,
    }
  },
  computed: {
    multiSelect: {
      get () {return this.maxSelectedCount !== 1},
      set (v) {
        if(v === true) {
          if(this.maxSelectedCount === 1) this.maxSelectedCount = 0;
          this.$nextTick(() => {
            M.Select.init(this.$refs.multiSelect);
          });
        }else {
          if(this.maxSelectedCount !== 1) this.maxSelectedCount = 1;
        }
      }
    },
    multiSelectList () {
      let list = [];
      for(let i = 2; i <= this.options.length; i++) {
        list.push(i);
      }
      return list;
    }
  },
  watch: {
    multiSelectList () {
      this.$nextTick(() => {
        M.Select.init(this.$refs.multiSelect);
      });
    }
  },
  methods: {
    addOption () {
      this.options.push('');
      this.$nextTick(() => {
        this.$refs.inputs[this.$refs.inputs.length - 1].focus();
      });
    },
    getData () {
      return {
        title: this.allowSubTitle ? this.title : '',
        description: this.allowSubTitle ? this.description : '',
        options: this.options,
        maxSelectedCount: this.maxSelectedCount,
      }
    }
  },
  components: {TextInput},
  mounted () {
    M.Select.init(this.$refs.multiSelect);
  }
}
</script>

<style lang="less" scoped>
div.multi-option {
  margin-bottom: .5em;
}
p.group-title {
  margin-bottom: 24px;
  margin-top: 16px;
}
p.vote-index {
  font-size: 1.2em;
  font-weight: bold;
  padding-bottom: 8px;
  border-bottom: 1px dashed #d6d6d6;
}
</style>