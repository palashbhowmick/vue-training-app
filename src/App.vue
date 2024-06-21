<template>
	<DataTable
		:headers="headers"
		:items="columns"
		:hasNext="hasNext"
		:offset="offset"
		:loading="loading"
		@previous-page="previousPage"
		@next-page="nextPage"
		@search-changed="handleSearchChanged"
	/>
</template>

<script>
	import DataTable from './components/DataTable'

	export default {
		name: 'App',

		components: {
			DataTable,
		},

		data() {
			return {
				serverLocation: 'https://192.168.44.232:8443',
				serverToken:
					'd01706d347897fcee2993421ae71d719bca1647b93ce7dbb633643685f7b73ab',
				loading: false,
				headers: [
					{ text: 'Name', value: 'name' },
					{ text: 'Table', value: 'table' },
					{ text: 'Schema', value: 'schema' },
					{ text: 'Database', value: 'database' },
					{ text: 'Application', value: 'application' },
				],

				columns: [],
				offset: 0,
				limit: 15,
				hasNext: false,
				searchQuery: '',
				filterQueryHeaders: [
					'label',
					'table',
					'schema',
					'database',
					'application',
				],
				selectedCategory: '',
				searchMap: new Map(),
			}
		},

		mounted() {
			this.fetchColumnData()
		},

		methods: {
			async fetchColumnData() {
				try {
					console.log(this.selectedCategory)
					this.loading = true
					let filter = this.generateGlobalFilter()
					let filterExpression = filter ? '&filter=' + filter : ''
					let endPoint = `${this.serverLocation}/api/v2.1/columns?offset=${this.offset}&limit=${this.limit}&sortBy=label&sortOrder=asc${filterExpression}`

					console.log(endPoint)
					let response = await fetch(endPoint, {
						method: 'GET',
						headers: {
							Authorization: 'Bearer ' + this.serverToken,
							'Content-Type': 'application/json',
						},
					})

					let columns = await response.json()
					console.log('API called')
					this.columns = columns.columns.map((column) => ({
						name: column.label,
						table: column.table.label,
						schema: column.schema.label,
						database: column.database.label,
						application: column.application.label,
					}))

					this.hasNext = columns._meta.hasNext
				} catch (error) {
					this.columns = []
					this.hasNext = false
					console.error(error)
				} finally {
					this.loading = false
				}
			},

			generateGlobalFilter() {
				let filterQuery = ''
				if (this.searchQuery) {
					if (this.selectedCategory) {
						filterQuery =
							(this.selectedCategory === 'Name'
								? 'label'
								: this.selectedCategory.toLowerCase()) +
							" co '" +
							this.searchQuery +
							"'"
						if (this.searchMap.size > 0) {
							let previousFilterQuery =
								this.generateFilterFromMap()
							console.log(
								'Previous filter : ' + previousFilterQuery
							)
							filterQuery =
								previousFilterQuery + ' and ' + filterQuery
						}

						this.searchMap.set(
							this.selectedCategory === 'Name'
								? 'label'
								: this.selectedCategory.toLowerCase(),
							this.searchQuery
						)
						this.searchQuery = ''
						console.log('Search Map : ', this.searchMap)
					} else {
						filterQuery = this.filterQueryHeaders
							.map(
								(header) => `${header} co '${this.searchQuery}'`
							)
							.join(' or ')
					}
				} else if (this.searchMap.size > 0) {
					filterQuery = this.generateFilterFromMap()
				}
				console.log('filter = ' + filterQuery)
				return filterQuery
			},

			nextPage() {
				this.offset += this.limit
				this.fetchColumnData()
			},
			previousPage() {
				if (this.offset > 0) {
					this.offset -= this.limit
					this.fetchColumnData()
				}
			},
			handleSearchChanged(searchValue) {
				this.searchQuery = searchValue
				this.offset = 0
				this.columns = []
				this.fetchColumnData()
			},
		},
	}
</script>
