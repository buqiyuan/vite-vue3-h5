<template>
  <van-popup v-model:show="isShow" position="right" :style="{ width: '100vw', height: '100vh' }">
    <van-sticky>
      <van-search v-model.trim="keyword" :placeholder="title" @update:model-value="onChange" />
    </van-sticky>
    <div class="person-list">
      <template v-for="personItem in personList" :key="personItem.userId">
        <van-cell clickable :label="personItem.deptName" @click="selectPerson(personItem)">
          <template #icon>
            <van-image
              width="40"
              height="40"
              style="margin-right: 10px"
              lazy-load
              :src="$appendRandomQueryStr(personItem.avatar)"
              error-icon="/default_avatar.png"
            />
          </template>
          <template #title>
            <div v-highlight="{ personItem, keyword }"></div>
          </template>
        </van-cell>
      </template>
      <van-empty v-if="keyword && !personList.length" image="search" description="无搜索结果" />
    </div>
  </van-popup>
</template>

<script lang="ts">
  import { defineComponent, reactive, PropType, toRefs, watch, SetupContext } from 'vue';
  import { useVModel, useDebounceFn } from '@vueuse/core';
  import { getWeworkUserDeptByKey } from '@/api/createApply';
  import { WorkUser } from '@/api/models/createApplyModel';
  import { onBeforeRouteLeave } from 'vue-router';
  import { Toast } from 'vant';

  interface IState {
    isShow: boolean;
    keyword: string;
    personList: WorkUser[];
    docTitle: string;
  }

  export default defineComponent({
    name: 'SearchPerson',
    directives: {
      highlight: (el, binding) => {
        // 高亮人名关键字
        const { personItem, keyword } = binding.value;
        const replaceReg = new RegExp(keyword, 'g');
        const replaceStr = `<span style="color: #1989fa">${keyword}</span>`;
        el.innerHTML = personItem.name.replace(replaceReg, replaceStr);
      },
    },
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
      title: {
        type: String,
        default: '',
      },
    },
    emits: ['on-person-selected', 'update:show'],
    setup(props, { emit }: SetupContext) {
      const state: IState = reactive({
        isShow: useVModel(props, 'show', emit),
        keyword: '', // 搜索关键字
        personList: [],
        docTitle: document.title,
      });

      // 搜索框值改变时函数
      const onChange = useDebounceFn(async function (value) {
        if (!value) return (state.personList = []);
        const params = { key: value, searchType: 2 };
        const { data } = await getWeworkUserDeptByKey(params);
        state.personList = (data ?? []).reduce((prev, curr) => {
          if (
            !prev.some((item) => item.userId == curr.userId) &&
            !props.selected.some((n) => n.userId == curr.userId)
          ) {
            prev.push(curr);
          }
          return prev;
        }, []);
      }, 350);

      // 选择的人员
      const selectPerson = (item) => {
        if (props.selected.some((n) => n.userId == item.userId)) {
          return Toast('不能重复选择！');
        }
        emit('on-person-selected', item);
        state.isShow = false;
      };

      onBeforeRouteLeave((to, from, next) => {
        if (state.isShow) {
          state.isShow = false;
          next(false);
        } else {
          next(true);
        }
      });

      watch(
        () => state.isShow,
        (val) => {
          state.keyword = '';
          state.personList = [];
          requestIdleCallback(() => (document.title = val ? props.title : state.docTitle), {
            timeout: 500,
          });
        },
      );

      return {
        ...toRefs(state),
        onChange,
        selectPerson,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .person-list {
    height: calc(100vh - 55px);
    overflow-y: auto;
  }
</style>
