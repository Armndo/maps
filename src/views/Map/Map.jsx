import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { click, move } from "./functions";

export function Map({ }) {
    const [init, setInit] = useState(false)
    const mapRef = useRef(null)

    useEffect(() => {
        if (!init) {
            console.log("init");

            const map = new mapboxgl.Map({
                doubleClickZoom: false,
                dragRotate: false,
                container: "map", // container ID
                style: "mapbox://styles/armndolol/clr72446k011901qldag2czd3?optimize=true",
                center: [-101.8440821109478, 23.871020649362663], // starting position [lng, lat]
                zoom: 4.665980480878313, // starting zoom
                // bounds: [
                //     [ -126.65144409542711, 14.114434343371016 ],
                //     [ -78.6801873024284, 33.17154119032435 ],
                // ],
                // maxBounds: [
                //     [ -126.65144409542711, 14.114434343371016 ],
                //     [ -78.6801873024284, 33.17154119032435 ],
                // ],
                accessToken: "pk.eyJ1IjoiYXJtbmRvbG9sIiwiYSI6ImNscjcxczRkbjBubWkyaXBicDQwNG1yZXAifQ.AA1zUYjV9fCDn2oHzFyqZw",
            }); 

            // map.came

            // map.on("style.load", () => {
            //     map.setFog({}); // Set the default atmosphere style
            // });

            map.on("load", () => {
                // Add a data source containing GeoJSON data.
                map.addSource("mex_ent", {
                    type: "geojson",
                    // data: "https://pezatomico.online/data/maps/mx/ent/1_100_bounded.geojson",
                    data: "https://pezatomico.online/data/maps/mx/ent/res.json",
                    // generateId: true,
                    promoteId: "inegi_id",
                    // buffer: 0,
                    // tolerance: 0,

                    // cluster: true
                    // maxzoom: 8,
                    // buffer: 0,
                });

                // Add a new layer to visualize the polygon.
                map.addLayer({
                    id: "poly",
                    type: "fill",
                    source: "mex_ent", // reference the data source
                    layout: {},
                    paint: {
                        "fill-color": "#aaff99", // blue color fill
                        "fill-opacity": 0.5,
                        // "fill-color": ["match", ["get", "id"], 1, "red"],
                        // 'fill-color': ['interpolate-hcl', ['linear'], ['feature-state', 'gatos'], 1, 'white', 16, 'black']

                        // "fill-antialias": true,
                    }
                });

                // console.log(map.getSource("mex_ent").serialize().data);
                map.setFeatureState({source: "mex_ent", id: "01"}, {gatos: 1})
                // map.setFeatureState({source: "mex_ent", id: 2}, {gatos: 2})
                // map.setFeatureState({source: "mex_ent", id: 3}, {gatos: 3})
                // map.setFeatureState({source: "mex_ent", id: 4}, {gatos: 4})
                // map.setFeatureState({source: "mex_ent", id: 5}, {gatos: 5})

                map.addLayer({
                    "id": "lines",
                    "type": "line",
                    "source": "mex_ent",
                    "layout": {},
                    "paint": {
                        "line-color": "#fff",
                        "line-width": 1
                    }
                });

                map.on("click", "poly", (e) => {
                    // map.fire("closeAllPopups")
                    const feature = e.features[0]
                    console.log(e.features);
                    // const source = map.getSource("mex_ent")
                    // console.log(feature, feature.geometry.coordinates);
                    // console.log(map.getSource("mex_ent")._data);
                    // map.fitBounds(JSON.parse(feature.properties.bounds))
                    // console.log(feature.properties.bounds);
                    // console.log(feature, feature.geometry, feature.layer, feature.id, feature.state, feature.);
                    // console.log(feature, map.querySourceFeatures("mex_ent"), map.getSource("mex_ent"))
                    // new mapboxgl.Popup()
                    //     .setLngLat(e.lngLat)
                    //     .setHTML(e.features[0].properties.geo_name)
                    //     .addTo(map);
                });

                // map.on("mouseenter", "fill", (e) => {
                //     // map.fire('closeAllPopups');
                //     map.fire("closeAllPopups")
                //     // console.log(e);
                //     new mapboxgl.Popup()
                //         .setLngLat(e.lngLat)
                //         .setHTML(e.features[0].properties.geo_name)
                //         .addTo(map);
                // });
            });

            // let gl = map._canvas.getContext("webgl2")
            // let debugInfo = gl.getExtension("WEBGL_debug_renderer_info")
            // let vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            // let renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

            map.on("click", (e) => click(e, "point"))
            map.on("moveend", (e) => move(e))

            setInit(true)
        }
    }, [init]);

    return <div style={{
        height: "100vh"
    }}>
        <span style={{
            display: "block",
            height: "2rem",
        }}>
            this is a map
        </span>
        <span style={{
            display: "block",
            height: "2rem",
        }} id="point">
        </span>
        <div
            id="map"
            ref={mapRef}
            style={{
                height: "calc(100% - 4rem)"
            }}
        ></div>
    </div>
}