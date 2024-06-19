<template>
  <v-app>
    <DataTable />
  </v-app>
</template>

<script>
import DataTable from './components/table/DataTable.vue';

export default {
  name: 'App',
  components: {
    DataTable,
  },
};
</script>
