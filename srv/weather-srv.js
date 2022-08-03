const cds = require('@sap/cds')

module.exports = cds.service.impl(async function() {

    const bupa = await cds.connect.to('OpenWeatherApi');

    this.on('READ', 'CurrentWeather', async req => {
        console.log("READ CurrentWeather")
        console.log("req.query", req.query) // req.query GET /weather?appid=<apiKey>&units=metric&id=2643743
        return bupa.run(req.query);
    });

    this.before("READ", "*", (req) => {
        try {
            console.log("READ CurrentWeather2")
            const queryParams = parseQueryParams(req.query.SELECT);
            const queryString = Object.keys(queryParams)
                .map((key) => `${key}=${queryParams[key]}`)
                .join("&");
            req.query = `GET /weather?${queryString}`;
        } catch (error) {
            req.reject(400, error.message);
        }
    });

    function parseQueryParams(select) {
        const filter = {};
        Object.assign(
            filter,
            parseExpression(select.from.ref[0].where),
            parseExpression(select.where)
        );

        if (!Object.keys(filter).length) {
            throw new Error("At least one filter is required");
        }

        const apiKey = "<apiKey>"; // Reemplazar <apiKey> por su apiKey en https://home.openweathermap.org/api_keys
        if (!apiKey) {
            throw new Error("API key is missing.");
        }

        const params = {
            appid: apiKey,
            units: "metric",
        };

        for (const key of Object.keys(filter)) {
            switch (key) {
                case "id":
                    params["id"] = filter[key];
                    break;
                case "city":
                    params["q"] = filter[key];
                    break;
                default:
                    throw new Error(`Filter by '${key}' is not supported.`);
            }
        }

        return params;
    }

    function parseExpression(expr) {
        if (!expr) {
            return {};
        }
        const [property, operator, value] = expr;
        if (operator !== "=") {
            throw new Error(`Expression with '${operator}' is not allowed.`);
        }
        const parsed = {};
        if (property && value) {
            parsed[property.ref[0]] = value.val;
        }
        return parsed;
    }

});





// -------------------------------------------------------------------------------- //

// const axios = require('axios');
// const { createAPI } = require("openweatherapi-js-sdk");
// const api = createAPI("<apiKey>");

// module.exports = cds.service.impl(async function () {

//     this.on('READ', 'CurrentWeather', async req => {
//         console.log("READ CurrentWeather")
//         let wet;
//         await api.weather
//             .getWeatherByCityName({
//                 cityName: "London", // required
//                 units: "metric", // optional
//             })
//             .then((weather) => wet = weather);
//         console.log("wet", wet)
//         return wet;
//     });
// });


// module.exports = cds.service.impl(function () {
//     const { CurrentWeather } = this.entities;

//     this.on("READ", CurrentWeather, async (req) => {
//         console.log("READ CurrentWeather")
//         const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=<apiKey>');
//         try {
//             console.log(response.data);
//         } catch (error) {
//             console.error("error");
//         }
//         const openWeatherApi = await cds.connect.to("OpenWeatherApi");
//         // let returner = openWeatherApi.tx(req).run(req.query);
//         return response.data;
//     });
// });


// const cds = require('@sap/cds')

// module.exports = cds.service.impl(async function() {

//     const bupa = await cds.connect.to('OpenWeatherApi');

//     this.on('READ', 'CurrentWeather', async req => {
//         console.log("READ CurrentWeather")
//         console.log("req.query", req.params)
//         return bupa.run(req.query);
//     });
// });