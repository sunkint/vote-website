<template>
  <div class="card grey lighten-5" :class="{hoverable: !isExpired && !isExpanded, expand: isExpanded, expired: isExpired}" @click="expand">
    <div class="card-content">
      <span class="card-title">
        <span class="new badge teal lighten-2" data-badge-caption="" v-if="isVoted">已参与</span>
        <span class="new badge" :class="[isExpired ? 'grey' : 'pink lighten-2']" data-badge-caption="" v-else>{{isExpired ? '已截止' : '进行中'}}</span>
        {{title}}
      </span>
      <div class="summary" v-if="!isExpanded">
        <p class="summary" v-if="!isGroup">
          <ol>
            <li v-for="(n, i) in sVote.options" :key="i">{{n.value}}</li>
          </ol>
        </p>
        <p class="summary" v-else></p>
      </div>
      <div class="vote-area" v-else>
        <div class="vote-on" v-if="!isShowingResult">
          <p class="vote-desc">{{description}}</p>
          <div class="vote-item-list">
            <div class="vote-item" v-for="(v, i) in votes" :key="i">
              <p class="vote-sub-title" v-if="isGroup">{{v.title || title}}</p>
              <p class="vote-sub-desc" v-if="isGroup && !!v.description">{{v.description}}</p>
              <ul class="vote-options">
                <li v-for="n in v.options" :key="n.guid">
                  <label>
                    <input type="checkbox" :value="n.guid" v-model="selectedOptions[i]" v-if="sVote.isMultiSelect" :disabled="selectedOptions[i].length >= v.max_selected_count && selectedOptions[i].indexOf(n.guid) < 0">
                    <input type="radio" :value="n.guid" v-model="selectedOptions[i]" class="with-gap" :name="`group${id}`" v-else>
                    <span class="vote-label">{{n.value}}</span>
                  </label>
                </li>
              </ul>
              <p class="vote-count-tip" v-if="v.max_selected_count > 1 && v.max_selected_count < v.options.length">至多可选{{v.max_selected_count}}项</p>
            </div>
          </div>
          <div class="submit-box">
            <button class="btn waves-effect" @click="submitVote" :disabled="isBusy">投票</button>
          </div>
        </div>
        <div class="vote-off" v-else>
          <div class="vote-item" v-for="(v, i) in votes" :key="i">
            <p class="vote-sub-title" v-if="isGroup">{{v.title || title}}</p>
            <p class="vote-sub-desc" v-if="isGroup && !!v.description">{{v.description}}</p>
            <ul class="vote-options">
              <li v-for="(n, i) in v.options" :key="i">
                <span class="vote-label">{{n.value}} <span v-show="getIfVoted(n.guid)">(已选)</span></span>
                <span class="vote-percent right">{{getPercentText(n.guid)}}</span>
                <div class="vote-percent-graph"><transition><span v-if="isShowingResult" :style="{width: getPercent(n.guid) + '%'}"></span></transition></div>
              </li>
            </ul>
          </div>
        </div>
        <div class="info-box">
          <span class="user"><i class="material-icons">person</i> {{author}}</span>
          <span class="deadline"><i class="material-icons">access_time</i> {{deadline}} 截止</span>
          <span class="packup right" @click.stop="packup"><i class="material-icons">keyboard_arrow_up</i> 收起</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'underscore';
import {getCookie} from '../../common/cookie';
let formatDate = function (date) {
  if(!_.isObject(date)) date = new Date(date);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} `
    + `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:`
    + `${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`
};

export default {
  props: {
    voteData: Object
  },
  data () {
    return {
      isExpanded: false,
      isExpired: this.voteData.is_expired,
      isVoted: false,
      isBusy: true,

      selectedOptions: this.voteData.votes.map(v => v.max_selected_count > 1 ? [] : ''),
      statData: {},

      id: this.voteData.id,
      title: this.voteData.title,
      description: this.voteData.description,
      isGroup: this.voteData.vote_group,
      data: this.voteData.votes,
      author: this.voteData.author,
      deadline: formatDate(new Date(this.voteData.deadline)),
    }
  },
  computed: {
    sVote () {
      let sVote = this.voteData.votes[0]
      let vote = Object.assign({}, sVote);
      vote.title = this.voteData.title;
      vote.description = this.voteData.description;
      vote.isMultiSelect = sVote.max_selected_count > 1;
      return vote;
    },
    votes () {
      return this.voteData.votes;
    },
    isShowingResult () {
      return this.isExpired || this.isVoted;
    }
  },
  methods: {
    expand () {
      if(this.isExpanded || this.isBusy) return;
      this.isExpanded = true;
    },
    packup () {
      this.isExpanded = false;
    },
    getPercentText (guid) {
      if(this.statData[guid] === undefined) return "0票 0%";
      return `${this.statData[guid].count}票 ${this.statData[guid].percent}%`;
    },
    getPercent (guid) {
      if(this.statData[guid] === undefined) return 0;
      return this.statData[guid].percent;
    },
    getIfVoted (guid) {
      if(this.statData[guid] === undefined) return false;
      return this.statData[guid].voted;
    },
    submitVote () {
      if(!getCookie('vote_user_uid')) {
        M.toast({html: '请先登录', displayLength: 2000});
        this.$bus.$emit('startLoginModal');
        return;
      }
      for(let os of this.selectedOptions) {
        if(os.length === 0) {
          M.toast({html: '你没有选择任何选项', displayLength: 2000});
          return;
        }
      }
      this.isBusy = true;
      this.$http.post('vote', {id: this.id, options: this.selectedOptions}).then(res => {
        M.toast({html: '投票成功', displayLength: 2000});
        this.statData = res.body.data;
        this.isVoted = true;
        this.isBusy = false;
      }).catch(err => {
        this.isBusy = false;
        if(_.isObject(err.body) && err.body.msg) {
          M.toast({html: err.body.msg});
        }else {
          M.toast({html: '投票失败，请检查'});
        }
      });
    },
    getStatData () {
      this.$http.get('getStatData', {params: {id: this.id}}).then(data => {
        let body = data.body;
        this.isVoted = body.voted;
        this.statData = body.data;
        this.isBusy = false;
      }).catch(() => {
        this.isBusy = false;
      });
    }
  },
  created () {
    this.getStatData();
  }
}
</script>

<style lang="less" scoped>
.card {
  &:not(.expand) {
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
  }

  &.expired {
    
  }
}

p.summary {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #707070;

  ol {
    list-style-type: upper-alpha;
    list-style-position: inside;
    padding: 0;
    margin: 10px 0 0 0;
  }

  li {
    float: left;

    &.selected {
      color: #303030;
      font-weight: 500;
    }
  }

  li + li {
    margin-left: 1em;
  }
}

span.card-title {
  span.badge {
    margin-left: .5em;
  }
}

div.vote-area {
  div.vote-item {
    padding-bottom: 12px;

    &:not(:first-child) {
      padding-top: 12px;
    }

    &:not(:last-child) {
      border-bottom: 1px dashed #ccc;
    }
  }

  p.vote-desc, p.vote-sub-desc {
    white-space: pre-wrap;
  }

  ul.vote-options {
    margin-bottom: 6px;

    li + li {
      margin-top: 4px;
    }

    input:checked + span {
      color: #696969;
    }

    label {
      display: block;
      cursor: pointer;
    }

    span.vote-percent {
      vertical-align: bottom;
      color: #5c5c5c;
      font-size: 12px;
    }

    div.vote-percent-graph {
      margin-top: 4px;
      border: 1px solid #ddd;

      &>span {
        display: block;
        height: 4px;
        background-color: #ac8475;

        &.v-enter-active, &.v-leave-active {
          transition: width .4s;
        }

        &.v-enter, &.v-leave-to {
          width: 0%;
        }
      }
    }
  }

  p.vote-count-tip {
    font-size: 12px;
    color: gray;
  }

  div.submit-box {
    margin-bottom: 14px;
    
    span {
      display: inline-block;
      line-height: 36px;
      vertical-align: bottom;
      margin-left: 8px;
    }
  }

  div.info-box {
    font-size: 14px;
    color: fade(#000, 60%);

    i {
      font-size: 15px;
      vertical-align: -2px;
    }

    &>span + span {
      margin-left: 4px;
    }

    span.packup {
      cursor: pointer;
    }
  }
}
</style>
