<template>
	<div class="left-panel">

		<div class="p-8 mx-auto text-left w-full">
			<h2 class="text-2xl font-bold mb-1 text-gray-700">Input your prompt</h2>
			<!-- create a pie chart with female: 50, male: 100. Use warm colors -->
			<PromptExamples />

			<textarea v-model="prompt" placeholder="Highlight the max value."
				class="shadow appearance-none border rounded w-full py-2 my-5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"></textarea>

			<button @click="$emit('generateChart', prompt)"
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ">
				Generate Chart
			</button>
		</div>
		<div ref="exampleContainer"></div>
	</div>
</template>
  
<script>
import PromptExamples from './PromptExamples.vue';
import vegaEmbed from 'vega-embed';
export default {
	name: "LeftPanel",
	components: { PromptExamples },
	data() {
		return {
			prompt: "",
		};
	},
	mounted() {
		this.render()
	},
	methods: { render() { vegaEmbed(this.$refs.exampleContainer, JSON.parse(`{
				"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
				"description": "Google's stock price over time.",
				"data": {"url": "https://raw.githubusercontent.com/vega/vega-datasets/main/data/stocks.csv"},
				"transform": [{"filter": "datum.symbol==='GOOG'"}],
				"mark": "line",
				"encoding": {
				  "x": {"field": "date", "type": "temporal"},
				  "y": {"field": "price", "type": "quantitative"}
				}}`)).catch((error) => console.error(error)); } }
};
</script>