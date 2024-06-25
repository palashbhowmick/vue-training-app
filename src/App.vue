<template>
  <div>
    <HelloWorld />
    <DataTable />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
import DataTable from "./components/DataTable.vue";

export default {
  name: "App",

  components: {
    HelloWorld,
    DataTable,
  },

  data: () => ({
    //
  }),
};
</script>
