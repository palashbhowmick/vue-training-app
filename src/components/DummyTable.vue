<template>
  <div>
    <h1>{{ title }}</h1>
    <slot name="description" :item="{count: items.length}" >
      <h2>Default description</h2>
    </slot>
    <v-text-field
      label="Search"
      v-model="search"
      @input="onSearch"
    ></v-text-field>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="5"
      class="elevation-1"
    ></v-data-table>
  </div>
</template>

<script>
export default {
  name: "DummyTable",
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "Dummy Table",
    },
  },
  data() {
    return {
      search: "",
    };
  },
  methods: {
    onSearch(searchVal) {
      this.search = searchVal;
      this.$emit("onSearch", searchVal);
    },
  },
};
</script>