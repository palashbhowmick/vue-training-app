<template>
  <column_table
    :headers="headers"
    :columns="columns"
    :next_disable="nextDisable"
    :previous_disable="previoustDisable"
    :loading="loading"
    @previous_page="previousPage"
    @next_page="nextPage"
    @searchValue="calledSearchedValue"
  ></column_table>
</template>

<script>
import column_table from "E:\\vue-training-app\\src\\components\\columns_table.vue";
let url = "http://192.168.33.91:45450/api/v2.1/columns?";
let token = "f6b958b9c93e7da51c804869af64648eca766966bde8d23b06e809ceb47c78ff";
export default {
  components: {
    column_table,
  },
  data() {
    return {
      headers: [
        { text: "Name", value: "label" },
        { text: "Table", value: "table" },
        { text: "Schema", value: "schema" },
        { text: "Database", value: "database" },
        { text: "Application", value: "application" },
      ],
      columns: [],
      loading: false,
      nextDisable: false,
      previoustDisable: false,
      offset: 0,
      searchValue: "",
      searchOptions: new Map([
        ["Name", true],
        ["Table", true],
        ["Schema", true],
        ["Application", true],
      ]),
    };
  },
  mounted() {
    this.getColumns();
  },
  methods: {
    calledSearchedValue(search) {
      this.columns = [];
      this.offset = 0;
      this.searchValue = "";
      this.nextDisable = true;
      this.previousPage = true;
      if (search) {
        for (const searchBy of this.headers) {
          console.log("hello " + searchBy.value);
          this.searchValue += this.searchValue
            ? " or " + searchBy.value + " co '" + search + "'"
            : searchBy.value + " co '" + search + "'";
        }
        console.log(this.searchValue);
      }
      this.getColumns();
    },
    nextPage() {
      this.offset += 10;
      this.getColumns();
    },
    previousPage() {
      this.offset -= 10;
      this.getColumns();
    },
    async getColumns() {
      try {
        this.loading = true;
        let formatedUrl =
          url +
          "offset=" +
          this.offset +
          "&limit=10" +
          (this.searchValue ? "&filter=" + this.searchValue : "");
        console.log(formatedUrl);
        const response = await fetch(formatedUrl, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        const columnsData = await response.json();
        console.log(columnsData);
        this.columns = columnsData.columns.map((column) => ({
          label: column.label,
          table: column.table.label,
          schema: column.schema.label,
          application: column.schema.label,
          database: column.schema.label,
        }));
        let meta = columnsData._meta;
        this.nextDisable = !meta.hasNext;
        this.previoustDisable = this.offset <= 0;
        console.log("previous: " + this.previoustDisable);
        console.log("next: " + this.nextDisable);
        console.log(this.searchOptions.size);
      } catch (error) {
        console.error(error);
        this.nextDisable = true;
        this.previoustDisable = true;
        this.columns = [];
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
