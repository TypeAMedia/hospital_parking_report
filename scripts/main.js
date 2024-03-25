class App {
	constructor() {
		d3.csv('./data/data.csv', d3.autoType).then(resp => {
			this.data = resp
			let regionsList = ['All regions']
			regionsList.push(...this.data.map((d) => d.region))
			const uniqueRegions = Array.from(new Set(regionsList))

			this.dropdown = initDropdown({
				placeholder: "SELECT REGION",
				list: uniqueRegions.map(d => ({ label: d, value: d })),
				id: '#region_sel',
				searchEnabled: true,
				searchPlaceholderValue: 'Search',
				cb: value => this.initTable(value),
			})
			this.initTable()
		})
	}

	initTable(region) {
		let filteredData = []
		if (region) {
			filteredData = this.data.filter((d) => d.region === region && d.borough)
				.sort((a, b) => a['overall rating'] - b['overall rating'])
				.map((d, i) => ({ ...d, ['overall ranking']: i + 1 }))
		} else {
			filteredData = this.data.filter((d) => !d.borough)
		}

		if (region === 'All regions') {
			filteredData = this.data.filter((d) => !d.borough)
		}
		const headers = getHeaders(filteredData)
		this.table = Table({
			container: '#table',
			data: filteredData,
			headers: headers,
		}).render()
	}

}

document.addEventListener('DOMContentLoaded', () => {
	const app = new App()
	window.app = app
})
