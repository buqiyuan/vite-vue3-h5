<template>
  <van-popup v-model:show="isShow" position="right" :style="{ width: '100vw', height: '100vh' }">
    <van-nav-bar
      :title="tabTitles.slice(-1)[0]"
      left-text=""
      left-arrow
      @click-left="$router.back()"
      @click-right="isShowSearchPerson = true"
    >
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>
    <div style="height: calc(100vh - 50px)" class="overflow-auto">
      <van-tabs v-model:active="active">
        <van-tab v-for="id in tabIds" :key="id" title="" :name="id">
          <template v-for="item in orgObj[id]" :key="item.userId">
            <van-cell @click="clickCell(item)">
              <template #title>
                <van-image
                  v-if="item.userType == 1"
                  :src="item.avatar"
                  style="width: 20px; height: 20px; margin-right: 6px"
                  icon-size="20"
                  error-icon="/default_avatar.png"
                />
                <van-icon v-if="item.userType == 2" :name="'/wjj.png'" size="20" />
                {{ item.name }}
              </template>
              <template v-if="item.userType == 2" #right-icon>
                <van-icon name="arrow" />
              </template>
            </van-cell>
          </template>
        </van-tab>
      </van-tabs>
    </div>
  </van-popup>
  <search-person
    v-model:show="isShowSearchPerson"
    :selected="selected"
    :tips="tips"
    :title="searchTitle"
    @on-person-selected="clickCell"
  />
</template>

<script lang="ts">
  import { defineComponent, reactive, PropType, watch, nextTick, toRefs } from 'vue';
  import { useVModel } from '@vueuse/core';
  import { onBeforeRouteLeave } from 'vue-router';
  import { getWeworkUserDeptByKey } from '@/api/createApply';
  import { WorkUser } from '@/api/models/createApplyModel';
  import SearchPerson from '@/components/search-person.vue';
  import { Toast } from 'vant';

  export default defineComponent({
    name: 'PersonSelect',
    components: { SearchPerson },
    props: {
      show: {
        type: Boolean,
        default: false,
      },
      selected: {
        // 已选的
        type: Array as PropType<WorkUser[]>,
        default: () => [],
      },
      tips: {
        type: String,
        default: '',
      },
      title: {
        type: String,
        default: '选择审批人',
      },
      searchTitle: {
        type: String,
        default: '搜索审批人',
      },
    },
    emits: ['on-person-selected', 'update:show'],
    setup(props, { emit }) {
      const isShow = useVModel(props, 'show', emit);
      const state = reactive({
        // 这里定义响应式数据
        isShowSearchPerson: false,
        active: 0,
        tabIds: [0],
        tabTitles: [props.title],
        docTitle: document.title,
        orgObj: {
          0: [],
        },
      });

      watch(isShow, async (val) => {
        state.tabIds = [0];
        state.tabTitles = [props.title];
        state.orgObj = {
          0: [],
        };
        if (val) {
          // searchType=0 -----查询顶级部门 key 不用传
          // sreachType=1 -----查询部门和人 key=部门id
          //sreachType=2 -----查询顶级部门 key=搜索人名字
          const { data } = await getWeworkUserDeptByKey({
            searchType: 0,
          });
          state.orgObj['0'] = data;
          console.log('组织树：', data);
        }
        requestIdleCallback(() => (document.title = val ? props.title : state.docTitle), {
          timeout: 500,
        });
      });

      onBeforeRouteLeave((to, form, next) => {
        // console.log('离开了')
        if (!state.isShowSearchPerson) {
          if (!isShow.value) {
            return next(true);
          }
          if (state.tabIds.length > 1) {
            state.tabIds.pop();
            state.tabTitles.pop();
            state.active = state.tabIds.slice(-1)[0];
          } else {
            isShow.value = false;
          }
          next(false);
        } else {
          next(true);
        }
      });

      // 点击单元格
      const clickCell = async (item) => {
        if (item.userType == 2) {
          const { data } = await getWeworkUserDeptByKey({
            key: item.userId,
            searchType: 1,
          });
          state.tabIds.push(state.active + 1);
          state.tabTitles.push(item.name);
          nextTick(() => {
            state.active++;
            state.orgObj[state.active] = data;
          });
        } else {
          if (props.selected.some((n) => n.userId == item.userId)) {
            return Toast('该审批人已在' + props.tips + '中，不能重复选择！');
          }
          emit('on-person-selected', item);
          isShow.value = false;
        }
      };

      return {
        ...toRefs(state),
        isShow,
        clickCell,
      };
    },
  });
</script>

<style lang="scss" scoped>
  ::v-deep(.van-tabs__wrap) {
    display: none;
  }

  ::v-deep(.van-cell) {
    align-items: center;

    .van-cell__title {
      display: flex;
      align-items: center;

      .van-icon {
        margin-right: 6px;
      }
    }
  }
</style>
