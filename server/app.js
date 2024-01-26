const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require("openai");
const cors = require('cors');
require('dotenv').config();


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

// openai.apiKey = process.env.OPENAI_API_KEY;

const openaiClient  = new OpenAIApi(configuration);



const app = express();
app.use(bodyParser.json());

app.use(cors());

app.post('/api/generate-chart', async (req, res) => {
  const { prompt } = req.body;

  console.log(prompt);

   // Validate input data
   if (!prompt || typeof prompt !== 'string') {
    res.status(422).json({ error: 'Invalid input data' });
    return;
  }

  try {
    // Generate VegaLite chart data based on user's prompt using GPT
    const chartData = await generateVegaLiteChartData(prompt);
    res.json(chartData);
  } catch (error) {
    console.error('Error generating chart data:', error);
    res.status(500).json({ error: 'An error occurred while generating chart data.' });
  }

});



async function generateVegaLiteChartData(prompt) {
	const fall_segment=`"filter": "(year(datum.date) == 2004 && month(datum.date) >=10 && month(datum.date) <=11)"
	"filter": "(year(datum.date) == 2005 && month(datum.date) >=1 && month(datum.date) <=3)"
	"filter": "(year(datum.date) == 2005 && month(datum.date) >=6 && month(datum.date) <=8)"
	"filter": "(year(datum.date) == 2006 && month(datum.date) >=1 && month(datum.date) <=2)"
	"filter": "(year(datum.date) == 2006 && month(datum.date) >=4 && month(datum.date) <=5)"
	"filter": "(year(datum.date) == 2006 && month(datum.date) >=6 && month(datum.date) <=8)"
	"filter": "(year(datum.date) == 2006 && month(datum.date) >=11 && month(datum.date) <=12)"
	"filter": "(year(datum.date) == 2007 && month(datum.date) >=1 && month(datum.date) <=2)"
	"filter": "(year(datum.date) == 2007 && month(datum.date) >=6 && month(datum.date) <=7)"
	"filter": "(year(datum.date) == 2007 && month(datum.date) >=10)"
	"filter": "(year(datum.date) == 2008 && month(datum.date) <=3)"
	"filter": "(year(datum.date) == 2008 && month(datum.date) >=5 && month(datum.date) <=11)"
	"filter": "(year(datum.date) == 2009 && month(datum.date) >=1 && month(datum.date) <=2)"
	"filter": "(year(datum.date) == 2009 && month(datum.date) >=12)"
	"filter": "(year(datum.date) == 2010 && month(datum.date) <=2>)"`
	const rise_segment=`
	"filter": "(year(datum.date) == 2004 && month(datum.date) >=11)"
	"filter": "(year(datum.date) == 2005 && month(datum.date) <=1)"
	"filter": "(year(datum.date) == 2005 && month(datum.date) >=3 && month	(datum.date) <=6)"
	"filter": "(year(datum.date) == 2005 && month(datum.date) >=8)"
	"filter": "(year(datum.date) == 2006 && month(datum.date) <=1)"
	"filter": "(year(datum.date) == 2006 && month(datum.date) >=2 && month	(datum.date) <=4)"
	"filter": "(year(datum.date) == 2006 && month(datum.date) >=5 && month	(datum.date) <=6)"
	"filter": "(year(datum.date) == 2006 && month(datum.date) >=8 && month	(datum.date) <=11)"
	"filter": "(year(datum.date) == 2006 && month(datum.date) >=12 )"
	"filter": "(year(datum.date) == 2007 && month(datum.date) <=1)"
	"filter": "(year(datum.date) == 2007 && month(datum.date) >=2 && month	(datum.date) <=6)"
	"filter": "(year(datum.date) == 2008 && month(datum.date) >=3 && month	(datum.date) <=5)"
	"filter": "(year(datum.date) == 2008 && month(datum.date) >=11)"
	"filter": "(year(datum.date) == 2009 && month(datum.date) <=1)"
	"filter": "(year(datum.date) == 2009 && month(datum.date) >=2 && month	(datum.date) <=12)"`
    try {
          // Call GPT-3 API with the provided prompt
        const gptResponse = await openaiClient.createChatCompletion({
            model: "gpt-4",
            messages: [
				{role: "system", content: "You are a friendly assistant. Your answers are JSON only, with no '\n' and no '\t'."},
			{role: "assistant", content: `{"message": "Understood. I will output my answers in JSON format, with no '\n' and no '\t'." }"`},
			{role: "user", content: `GUIDELINES: 1. Use red color to highlight increasing and decreasing trend. Increasing description include: Boost,Climb,Gain,Grow,Heighten,Higher,Increase,Increment,Jump,Raise,Rise,Skyrocket,Soar,Spike,Surge,Up,Uptick,Upward. Decreasing description include: Contract, Decline, Decrease, Diminish, Dip, Drop, Down(ward), Dwindle, Lessen, Lower, Plummet, Fall(off), Reduce, Shrink, Sink, Subside, Wane. Here is a code segment example for highlighting:
			{"mark": {"type": "line", "color": "red"},
			"transform": [
			  {"filter": ***Your Filter*** }
			],
			"encoding": {
			  "x": {"field": ***Your x Field***, "type": ***Type of  Your x Field***},
			  "y": {"field": ***Your y Field***, "type": ***Type of  Your y Field***}
			}}. 

			Follow the GUIDELINES above, choose from the filters ${fall_segment}, and the user requirement: ${prompt}. Add highlight code to the following VegaLite code: 
			"{
				"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
				"description": "Google's stock price over time.",
				"data": {"url": "https://raw.githubusercontent.com/vega/vega-datasets/main/data/stocks.csv"},
				"transform": [{"filter": "datum.symbol==='GOOG'"}],
				"layer": [
					{
					  "mark": "line",
					  "encoding": {
						"x": {"field": "date", "type": "temporal"},
						"y": {"field": "price", "type": "quantitative"}
					  }
					},
				]
			}" Retrun modified code of "Google's stock price over time" as JSON:`}],
            // messages: [{role: "user", content: "Hello world"}],
            max_tokens: 7000,
            n: 1,
            stop: null,
            temperature: 1,
            top_p: 1.0
        });

        console.log("GPT response:", gptResponse.data.choices[0].message.content.trim());

        // Extract the chart configuration from the GPT-3 response
        const chartConfig = extractVegaLiteConfig(gptResponse.data.choices[0].message.content.trim());

        console.log(gptResponse.data.choices[0].message);


        // // Test Data
        // const gptResponse = "Here's a VegaLite chart configuration for the prompt:\n\n```\n{\n  \"$schema\": \"https://vega.github.io/schema/vega-lite/v5.json\",\n  \"data\": {\"values\": [\n    {\"gender\": \"female\", \"count\": 50},\n    {\"gender\": \"male\", \"count\": 100}\n  ]},\n  \"mark\": \"arc\",\n  \"encoding\": {\n    \"theta\": {\"field\": \"count\", \"type\": \"quantitative\", \"stack\": true},\n    \"color\": {\"field\": \"gender\", \"type\": \"nominal\", \"scale\": {\"range\": [\"#FFB6C1\", \"#FF6347\"]}},\n    \"tooltip\": [{\"field\": \"gender\", \"type\": \"nominal\"}, {\"field\": \"count\", \"type\": \"quantitative\"}]\n  }\n}\n```\n\nThis configuration sets the data to the provided gender and count values, and creates a pie chart with two arcs–one for female and one for male, as specified in the data. The `theta` encoding is used to determine the size of the arcs based on count, using the `stack` option to ensure they add up to 360 degrees. The `color` encoding sets female to `#FFB6C1` (a light pink color) and male to `#FF6347` (a darker red color), as per the request to use warm colors. Finally, `tooltip` is used to display the gender and count for each arc when the user hovers over it";

        // const chartConfig = extractVegaLiteConfig(gptResponse.trim());


        // Parse the chart configuration as JSON
        const chartData = JSON.parse(chartConfig.replace('\n','').replace('\t',''));
        

        console.log(chartData);

        return chartData;
        
    } catch (error) {
        console.error('Error generating chart data:', error);
        if (error.response && error.response.data) {
        console.error('Error response body:', error.response.data);
        }
        throw error;    
    }

}


function extractVegaLiteConfig(responseText) { return responseText}
//   try {
//     // First, try to extract the configuration from triple backticks
//     const regex = /```([\s\S]*?)```/g;
//     const match = regex.exec(responseText);

//     if (match && match[1]) {
//       const config = match[1].trim();
//       // Check if the extracted content is a valid JSON object
//       JSON.parse(config);
//       return config;
//     }
//   } catch (error) {
//     // If extraction from triple backticks failed, proceed to the next step
//   }

//   // If the responseText is not wrapped in triple backticks,
//   // check if it's a valid JSON object
//   try {
//     JSON.parse(responseText);
//     return responseText;
//   } catch (error) {
//     throw new Error("VegaLite configuration not found in the response");
//   }
// }

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
