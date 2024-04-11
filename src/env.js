module.exports = {
    prod: process.env.REACT_APP_ENV === "production",
    manteinance: process.env.REACT_APP_MANTEINANCE === "true",
	front_url: process.env.REACT_APP_FRONT,
	assets_url: process.env.REACT_APP_ASSETS,
	mapbox_token: process.env.REACT_APP_MAPBOX_TOKEN,
	mapbox_style: process.env.REACT_APP_MAPBOX_STYLE,
};