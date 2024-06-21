<template>
	<div class="container">
		<v-card class="card">
			<v-card-title class="card-title">
				Columns
				<v-spacer></v-spacer>
				<v-text-field
					v-model="searchInput"
					append-icon="mdi-magnify"
					clearable
					label="Search"
					single-line
					hide-details
					class="search-field"
					@input="onSearch"
				>
					@click:clear="clearSearch" ></v-text-field
				>
			</v-card-title>
			<v-data-table
				multi-sort
				:headers="headers"
				:items="filteredItems"
				hide-default-footer
				:loading="loading"
				loading-text="Loading...Please wait"
				class="custom-data-table"
			>
				<template v-slot:footer>
					<div class="footer">
						<v-btn
							icon
							:disabled="offset == 0 || loading"
							@click="previousPage"
							class="pagination-button"
						>
							<v-icon>mdi-chevron-left</v-icon>
						</v-btn>
						<v-btn
							icon
							:disabled="!hasNext || loading"
							@click="nextPage"
							class="pagination-button"
						>
							<v-icon>mdi-chevron-right</v-icon>
						</v-btn>
					</div>
				</template>
			</v-data-table>
		</v-card>
	</div>
</template>

<script>
	export default {
		name: 'DataTable',
		data() {
			return {
				searchInput: '',
			}
		},
		props: {
			headers: {
				type: Array,
				required: true,
			},
			items: {
				type: Array,
				required: true,
			},
			hasNext: {
				type: Boolean,
				required: true,
			},
			offset: {
				type: Number,
				required: true,
			},
			loading: {
				type: Boolean,
				required: true,
			},
		},
		computed: {
			filteredItems() {
				if (!this.searchInput) return this.items
				return this.items.filter((item) => {
					return Object.values(item).some((value) =>
						String(value)
							.toLowerCase()
							.includes(this.searchInput.toLowerCase())
					)
				})
			},
		},
		methods: {
			onSearch() {
				// Emitting search-changed event is optional here since we're using computed property
				this.$emit('search-changed', this.searchInput)
			},
			clearSearch() {
				this.searchInput = ''
				this.onSearch()
			},
			previousPage() {
				this.$emit('previous-page')
			},
			nextPage() {
				this.$emit('next-page')
			},
		},
	}
</script>

<style scoped>
	.container {
		margin: 30px;
		font-family: 'Open Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
			sans-serif;
	}

	.card {
		border-radius: 10px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.card-title {
		font-size: 18px;
		font-weight: bold;
		color: #4a4a4a;
		padding: 20px;
		background-color: #e9e9f8;
		border-bottom: 1px solid #ddd;
	}

	.search-field {
		max-width: 300px;
		margin-right: 10px;
		font-weight: lighter;
		font-size: small !important;
	}

	.custom-data-table .v-data-table__wrapper {
		max-height: 500px;
		overflow-y: auto;
	}

	.custom-data-table ::v-deep .v-data-table-header {
		background-color: #dacdf5 !important;
		text-align: left !important;
		font-size: medium !important;
	}

	.custom-data-table ::v-deep .v-data-table__th {
		background-color: #dacdf5 !important;
		color: #ffffff !important;
		padding: 10px !important;
		font-size: 20px !important;
		font-weight: bold !important;
	}

	.custom-data-table .v-data-table__progress {
		background-color: transparent;
	}

	.custom-data-table tbody tr:hover {
		background-color: #f5f5f5;
	}

	.custom-data-table td {
		padding: 10px;
		border-bottom: 1px solid #d6d4d4;
		font-size: 12px !important;
	}

	.footer {
		display: flex;
		justify-content: flex-end;
		padding: 10px;
		background-color: #f7f6f6;
		border-top: 1px solid #ddd;
	}

	.pagination-button {
		margin: 0 5px;
	}
</style>
