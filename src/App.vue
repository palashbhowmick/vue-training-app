<template>
  <v-app
    ><DummyTable
      :items="filteredDesserts"
      :headers="headers"
      @onSearch="search = $event"
    >
      <template v-slot:description="item">
        <div>{{item}}</div>
        <h3>This is a dummy table</h3>
      </template>
    </DummyTable>
  </v-app>
</template>
<script>
import DummyTable from "./components/DummyTable.vue";
export default {
  data() {
    return {
      desserts: [
        {
          name: "Frozen Yogurt",
          calories: 159,
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
        },
        {
          name: "Eclair",
          calories: 262,
        },
        {
          name: "Cupcake",
          calories: 305,
        },
        {
          name: "Gingerbread",
          calories: 356,
        },
        {
          name: "Jelly bean",
          calories: 375,
        },
        {
          name: "Lollipop",
          calories: 392,
        },
        {
          name: "Honeycomb",
          calories: 408,
        },
        {
          name: "Donut",
          calories: 452,
        },
        {
          name: "KitKat",
          calories: 518,
        },
      ],
      headers: [
        {
          text: "Dessert (100g serving)",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Calories", value: "calories" },
        { text: "Fat (g)", value: "fat" },
        { text: "Carbs (g)", value: "carbs" },
        { text: "Protein (g)", value: "protein" },
        { text: "Iron (%)", value: "iron" },
      ],
      search: "",
    };
  },
  components: {
    DummyTable,
  },
  computed: {
    title() {
      return `Simple Table`.toUpperCase();
    },
    filteredDesserts() {
      return this.desserts.filter((dessert) =>
        dessert?.name?.includes(this.search)
      );
    },
  },
};
</script>
