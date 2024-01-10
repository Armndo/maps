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

            // map.on("style.load", () => {
            //     map.setFog({}); // Set the default atmosphere style
            // });

            map.on("load", () => {
                // Add a data source containing GeoJSON data.
                map.addSource("mex_ent", {
                    type: "geojson",
                    data: "https://pezatomico.online/data/maps/mx/ent/1_100.geojson",
                });

                // Add a new layer to visualize the polygon.
                map.addLayer({
                    id: "fill",
                    type: "fill",
                    source: "mex_ent", // reference the data source
                    layout: {},
                    paint: {
                        "fill-color": "#aaff99", // blue color fill
                        "fill-opacity": 0,
                        "fill-antialias": true,
                    }
                });

                map.addLayer({
                    "id": "lines",
                    "type": "line",
                    "source": "mex_ent",
                    "layout": {},
                    "paint": {
                        "line-color": "#55aa22",
                        "line-width": 1
                    }
                });

                map.on("click", "fill", (e) => {
                    // map.fire("closeAllPopups")
                    new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(e.features[0].properties.geo_name)
                        .addTo(map);
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