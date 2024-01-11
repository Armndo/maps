import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import { click, move } from "./functions";

export function Map({ }) {
    const [init, setInit] = useState(false)
    const [mapp, setMapp] = useState(null)
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
                console.log("load source");
                
                map.addSource("mex_ent", {
                    type: "geojson",
                    data: "https://pezatomico.online/data/maps/mx/ent/res.json",
                    promoteId: "inegi_id",
                });


                // map.setFilter("hover", ["==", ["id"], "32"])

                // map.addLayer({
                //     "id": "lines",
                //     "type": "line",
                //     "source": "mex_ent",
                //     "layout": {},
                //     "paint": {
                //         "line-color": "#fff",
                //         "line-width": 1
                //     }
                // });

                map.on("click", "poly", (e) => {
                    const feature = e.features[0]
                    console.log(feature);

                    if(map.getLayer("hover")) {
                        map.removeLayer("hover")
                    }

                    map.addLayer({
                        "id": "hover",
                        "type": "line",
                        "source": "mex_ent",
                        // filter: ["==", "id", feature.id],
                        filter: ["==", ["get", "inegi_id"], feature.id],
                        "layout": {},
                        "paint": {
                            "line-color": "#0f0",
                            "line-width": 2,
                        },
                    });

                    console.log(map.getLayer("hover"));

                    // map.setFilter("hover", ["==", ["get", "inegi_id"], feature.id])

                    
                    
                    // const node = document.createElement("p")
                    // node.innerHTML = "lmao"

                    new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        // .setDOMContent(node)
                        // .setText("lol")
                        .setHTML(`${e.features[0].properties.geo_name}<br>${e.features[0].state.gatos}`)
                        .addTo(map);

                    // map.fitBounds(JSON.parse(feature.properties.bounds))
                });

                map.on("mouseenter", "poly", (e) => {
                    const feature = e.features[0]
                    // console.log(feature);
                    
                    // map.addLayer({
                    //     "id": "hover",
                    //     "type": "line",
                    //     "source": "mex_ent",
                    //     "layout": {},
                    //     filter: ["==", ["id"], feature.id],
                    //     "paint": {
                    //         "line-color": "#fff",
                    //         "line-width": 1,
                    //     }
                    // });

                    // // map.fire('closeAllPopups');
                    // map.fire("closeAllPopups")
                    // // console.log(e);
                    // new mapboxgl.Popup()
                    //     .setLngLat(e.lngLat)
                    //     .setHTML(e.features[0].properties.geo_name)
                    //     .addTo(map);
                });
            });

            // let gl = map._canvas.getContext("webgl2")
            // let debugInfo = gl.getExtension("WEBGL_debug_renderer_info")
            // let vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            // let renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

            map.on("click", (e) => click(e, "point"))
            map.on("moveend", (e) => move(e))

            setMapp(map)


            setInit(true)
        }
    }, [init]);

    useEffect(() => {
        if(init) {
            
            mapp.on("load", () => {
                console.log("load data");

                axios.get(
                    `https://pezatomico.online/data/maps/mx/ent/1_100.php`
                ).then(res => {
                    let arr = []

                    for(let key in res.data) {
                        let rand = Math.round(Math.random()*31+1)
                        arr.push(rand)

                        mapp.setFeatureState({source: "mex_ent", id: key}, {gatos: rand})
                    }

                    mapp.addLayer({
                        id: "poly",
                        type: "fill",
                        source: "mex_ent",
                        layout: {},
                        paint: {
                            // "fill-color": "#aaff99", // blue color fill
                            "fill-opacity": 1,
                            'fill-color': ['interpolate-hcl', ['linear'], ['feature-state', 'gatos'], Math.min(...arr), 'white', Math.max(...arr), 'black']
                        }
                    });
                }).catch(err => {
    
                })

            })
        }
    }, [init])

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