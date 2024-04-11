import React, { useEffect, useState } from "react";
import { MapBox } from "../../components";
import { Popup, MapboxEvent, Map as MB, MapMouseEvent, MapLayerMouseEvent } from "mapbox-gl";
import { polygonPosition } from "../../utils/functions/polygonPosition";
import axios from "axios";
import { assets_url, mapbox_style, mapbox_token } from "../../env";

export function Map({ }) {
    const [data, setData] = useState(null)

    useEffect(() => {
        axios.get(
            `${assets_url}/maps/mx/ent/data.json`
        ).then(res => {
            let aux = {}

            for(let id of Object.keys(res.data)) {
                aux[id] = Math.random()*999 + 1
            }

            setData(aux)
        }).catch(err => {

        })
    }, [])

    /**
     * @param {MapLayerMouseEvent} e 
     * @param {string} name 
     * @param {MB} map 
     */
    function click(e, name, map) {
        const feature = e.features[0]

        if(map.getLayer(`${name}Focus`)) {
            map.removeLayer(`${name}Focus`)
        }

        map.addLayer({
            "id": `${name}Focus`,
            "type": "line",
            "source": name,
            filter: ["==", ["get", "inegi_id"], feature.id],
            "layout": {},
            "paint": {
                "line-color": "#ff0",
                "line-width": 2,
            },
        });

        const {bounds, center} = polygonPosition(feature.geometry)

        new Popup({ anchor: "bottom-left", closeOnClick: true, })
            .setLngLat(center)
            .setHTML(`${feature.properties.geo_name}<br>${feature.state.value}`)
            .on("close", () => {
                if(map.getLayer(`${name}Focus`)) {
                    map.removeLayer(`${name}Focus`)
                }
            })
            .addTo(map);

        // map.fitBounds(bounds);
    }

    /**
     * @param {MapLayerMouseEvent} e 
     * @param {string} name 
     * @param {MB} map 
     */
    function hover(e, name, map) {
        const feature = e.features[0]

        if(map.getLayer(`${name}Hover`)) {
            map.removeLayer(`${name}Hover`)
        }

        map.addLayer({
            "id": `${name}Hover`,
            "type": "line",
            "source": name,
            filter: ["==", ["get", "inegi_id"], feature.id],
            "layout": {},
            "paint": {
                "line-color": "#fff",
                "line-width": 2,
            },
        });

        if(map.getLayer(`${name}Focus`)) {
            map.moveLayer(`${name}Hover`, `${name}Focus`)
        }

        // for(let popup of map._popups) {
        //     popup.remove()
        // }

        // const {bounds, center} = polygonPosition(feature.geometry)

        // new Popup({closeButton: false, anchor: "bottom-left", closeOnMove: false})
        //     .setLngLat(e.lngLat)
        //     // .setLngLat(center)
        //     .setHTML(`${feature.properties.geo_name}<br>${feature.state.value}`)
        //     // .setHTML(`${feature.properties.geo_name}`)
        //     .on("close", () => {
        //         // if(map.getLayer(`${name}Focus`)) {
        //         //     map.removeLayer(`${name}Focus`)
        //         // }
        //     })
        //     .addTo(map);
    }

    return <div style={{
        height: "100vh"
    }}>
        <span style={{
            display: "block",
            height: "2rem",
        }}>
            this is a map
        </span>
        <div style={{
            height: "calc(100% - 2rem)"
        }}>
            <MapBox
                container="mapita"
                center={[-101.8440821109478, 23.871020649362663]}
                zoom={4.665980480878313}
                accessToken={mapbox_token}
                style={mapbox_style}
                load={{
                    source: {
                        type: "geojson",
                        data: `${assets_url}/maps/mx/ent/poly.json`,
                        promoteId: "inegi_id",
                    },
                    enableLine: false,
                    name: "mexico",
                    onClick: click,
                    onHover: hover
                }}
                data={data}
            />
        </div>
    </div>
}