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
    <van-picker
      :columns="columns"
      :value-key="valueKey"
      :default-index="state.defaultIndex"
      :columns-field-names="columnsFieldNames"
      @confirm="onConfirm"
      @cancel="state.showPicker = false"
    />
  </van-popup>
</template>

<script lang="ts">
  /**
   * @name: field-picker
   * @author:卜启缘
   * @date: 2021/5/10 13:35
   * @description：field-picker
   * @update: 2021/5/10 13:35
   */
  import { reactive, defineComponent, PropType, watch } from 'vue';
  import { useVModel } from '@vueuse/core';

  export default defineComponent({
    name: 'FieldPicker',
    props: {
      modelValue: [String, Number],
      show: {
        type: Boolean,
        default: undefined,
      },
      name: String,
      label: String,
      valueKey: {
        // 显示给用户看的值
        type: String,
        default: '',
      },
      fieldKey: {
        // 选择某项后label对应的value
        type: String,
        default: '',
      },
      placeholder: String,
      defaultValue: String,
      columns: {
        type: Array as PropType<any[]>,
        default: () => [],
      },
      columnsFieldNames: {
        type: Object,
        default: () => ({}),
      },
    },
    emits: ['update:modelValue', 'update:show', 'confirm'],
    setup(props, { emit }) {
      const state = reactive({
        value: useVModel(props, 'modelValue', emit),
        text: '',
        defaultIndex: -1,
        showPicker: props.show === undefined ? false : useVModel(props, 'show', emit),
      });

      watch(
        [() => props.columns, () => props.modelValue],
        () => {
          const value = props.modelValue || props.defaultValue;
          if (value) {
            const targetIndex = props.columns.findIndex(
              (item: any) => item[props.fieldKey] == value,
            );
            if (targetIndex != -1) {
              state.defaultIndex = targetIndex;
              state.text = props.columns[targetIndex][props.valueKey];
              emit('confirm', value);
            }
          }
        },
        { immediate: true },
      );

      const onConfirm = (value) => {
        const newVal = Array.isArray(value) ? value.slice(-1)[0] : value;
        state.text = props.valueKey ? newVal[props.valueKey] : newVal;
        const val = props.fieldKey ? newVal[props.fieldKey] : newVal;
        state.value = val;
        state.showPicker = false;
        emit('confirm', val, newVal);
      };

      return {
        state,
        onConfirm,
      };
    },
  });
</script>

<style scoped></style>
