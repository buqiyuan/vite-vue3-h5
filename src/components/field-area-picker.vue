<template>
  <van-field
    v-model="state.text"
    v-bind="$attrs"
    readonly
    clickable
    :name="name"
    :label="label"
    :placeholder="placeholder"
    @click="state.showPicker = true"
  />
  <van-popup v-model:show="state.showPicker" position="bottom">
    <van-area
      v-bind="$attrs"
      :value="areaValue"
      :area-list="areaList"
      @confirm="onConfirm"
      @cancel="state.showPicker = false"
    />
  </van-popup>
</template>

<script lang="ts">
  import { reactive, defineComponent, computed, watch, PropType } from 'vue';
  import { useVModel } from '@vueuse/core';
  import { areaList } from '@vant/area-data';

  type ConfirmResult = {
    code: string;
    name: string;
  }[];

  interface IState {
    value: ConfirmResult;
    text: string;
    showPicker: boolean;
  }

  export default defineComponent({
    name: 'FieldAreaPicker',
    props: {
      modelValue: [Array] as PropType<ConfirmResult>,
      name: String,
      label: String,
      valueKey: String, // 显示给用户看的值
      fieldKey: String, // 选择某项后label对应的value
      placeholder: String,
    },
    emits: ['update:modelValue', 'confirm'],
    setup(props, { emit }) {
      const state: IState = reactive({
        value: useVModel(props, 'modelValue', emit) as unknown as ConfirmResult,
        text: '',
        showPicker: false,
      });

      const areaValue = computed<string>(() =>
        Array.isArray(state.value) ? state.value.slice(-1)[0].code : '',
      );

      watch(
        areaValue,
        () => (state.text = Array.isArray(state.value) ? state.value.slice(-1)[0].name : ''),
        { immediate: true },
      );

      const onConfirm = (value) => {
        state.text = value.reduce((prev, curr) => (prev += curr.name + ' '), '');
        state.value = value;
        state.showPicker = false;
        emit('confirm', value);
      };

      return {
        state,
        areaValue,
        areaList,
        onConfirm,
      };
    },
  });
</script>

<style scoped></style>
