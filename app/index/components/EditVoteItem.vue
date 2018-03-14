<template>
  <div class="vote-edit-item">
    <div class="sub-title" v-show="allowSubTitle">
      <TextInput v-model.trim="title" label="子投票标题" placeholder="……？" :maxlength="60" ref="title"></TextInput>
      <TextInput v-model.trim="description" label="子投票描述（选填）" :maxlength="120" multiline></TextInput>
    </div>
    <div class="option-list">
      <p class="group-title">投票选项（至少2项，至多26项）：</p>
      <TextInput v-for="(n, i) in options" ref="inputs" :key="i" v-model.trim="options[i]" :label="`选项${i+1}`" :maxlength="40"></TextInput>
      <button class="btn waves-effect right" id="btnAddOption" @click="addOption" v-if="options.length < 26"><i class="material-icons left">add</i>添加选项</button>
      <br clear="all">
    </div>
  </div>
</template>

<script>
import TextInput from '../common/components/TextInput.vue';
import SwitchInput from '../common/components/SwitchInput.vue';
export default {
  props: {
    allowSubTitle: Boolean
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
      get () {return this.maxSelectedCount > 1},
      set (v) {
        if(v === true) {
          if(this.maxSelectedCount === 1) this.maxSelectedCount = 2;
        }else {
          if(this.maxSelectedCount > 1) this.maxSelectedCount = 1;
        }
      }
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
  components: {TextInput, SwitchInput},
}
</script>

<style lang="less" scoped>

</style>

