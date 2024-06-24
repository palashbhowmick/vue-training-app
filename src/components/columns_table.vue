<template>
  <v-app>
    <v-card>
      <v-card-title>
        Columns
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          @keyup.enter="searchValue"
          clearable
          @click:clear="clear"
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="columns"
        :items-per-page="10"
        hide-default-footer
        class="elevation-1"
        :loading="loading"
        loading-text="Loading... Please wait"
        multi-sort
      >
        <template v-slot:footer>
          <v-btn
            elevation="2"
            @click="previous_page"
            :disabled="previous_disable"
          >
            previous
          </v-btn>
          <v-btn elevation="2" @click="next_page" :disabled="next_disable">
            next
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-app>
</template>
<script>
export default {
  props: {
    headers: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    next_disable: {
      type: Boolean,
    },
    previous_disable: {
      type: Boolean,
    },
    loading: {
      type: Boolean,
    },
  },
  data() {
    return {
      search: "",
    };
  },
  methods: {
    previous_page() {
      this.$emit("previous_page");
    },
    next_page() {
      this.$emit("next_page");
    },
    searchValue() {
      this.$emit("searchValue", this.search);
    },
    clear() {
      this.search = "";
      this.searchValue();
    },
  },
};
</script>
<style lang="" scoped></style>
