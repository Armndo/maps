import React, { useEffect, useRef, useState } from "react";
import { MapBox } from "../../components";
import { Popup, MapboxEvent, Map as MB, MapMouseEvent, MapLayerMouseEvent } from "mapbox-gl";
import { polygonPosition } from "../../utils/functions/polygonPosition";
import axios from "axios";
import { api_url, assets_url, mapbox_style, mapbox_token } from "../../env";
import { formatNumber } from "../../utils";
import { addData, loadSource } from "../../components/MapBox/functions";

export function Map({ }) {
    const [data, setData] = useState(null)
    const [load, setLoad] = useState(null)
    const [map, setMap] = useState(null)
    const mapRef = useRef(null)

    useEffect(() => {
        axios.get(
            `${api_url}/maps`,
            // `${assets_url}/maps/mx/ent/data.json`,
        ).then(res => {
            let aux = res.data

            setData(aux)
        }).catch(err => {

        })
    }, [])

    useEffect(() => {
        if(data && map) {
            if(!map.getSource("mexico")) {
                loadSource({
                    map,
                    source: {
                        type: "geojson",
                        data: `${assets_url}/maps/mx/ent/poly.json`,
                        promoteId: "inegi_id",
                    },
                    enableLine: false,
                    name: "mexico",
                    onClick: click,
                    onHover: hover
                })

                addData(map, data, "mexico")
            }
        }
    }, [data, map])

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
            .setHTML(`${feature.properties.geo_name}<br>Población: ${formatNumber(feature.state.value)}`)
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
        {/* <span style={{
            display: "block",
            height: "2rem",
        }}>
            this is a map
        </span> */}
        <div style={{
            // height: "calc(100% - 2rem)"
            height: "100%",
        }}>
            <MapBox
                mapRef={mapRef}
                setMap={setMap}
                container="mapita"
                center={[-101.8440821109478, 23.871020649362663]}
                zoom={4.665980480878313}
                bounds={[
                    -118.3651144550222-1,
                    14.532098178781522-1,
                    -86.7323674969506+1,
                    32.718653318809636+1
                ]}
                accessToken={mapbox_token}
                style={mapbox_style}
            />
        </div>
    </div>
}