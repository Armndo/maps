import React, { MutableRefObject, Dispatch, useEffect, useRef, useState } from "react";
import mapboxgl, { Map, AnySourceData, FillPaint, LinePaint } from "mapbox-gl";
import { click, loadSource, move } from "./functions";

/**
 * @param {object} props
 * @param {MutableRefObject} props.mapRef
 * @param {Map} props.map
 * @param {Dispatch} props.setMap
 * @param {string} props.container
 * @param {[lat: number, lon: number]} [props.center]
 * @param {number} [props.zoom]
 * @param {[w: number, s: number, e: number, n: number]|[[w: number, s: number], [e: number, n: number]]} [props.bounds]
 * @param {string} [props.style]
 * @param {string} props.accessToken
 * @param {boolean} [props.doubleClickZoom]
 * @param {boolean} [props.dragRotate]
 * @param {object} [props.load]
 * @param {AnySourceData} props.load.source
 * @param {string} props.load.name
 * @param {boolean} props.load.enableFill
* @param {FillPaint} props.load.fill
* @param {boolean} props.load.enableLine
* @param {LinePaint} props.load.line
* @param {boolean} props.load.enableClick
* @param {Function} props.load.onClick
* @param {boolean} props.load.enableHover
* @param {Function} props.load.onHover
* @param {object} props.data
 */
export function MapBox({
    mapRef,
    map,
    setMap,
    container = "map",
    center = undefined,
    zoom = undefined,
    bounds = undefined,
    style = undefined,
    accessToken,
    doubleClickZoom = undefined,
    dragRotate = undefined,
    load = {
        source: undefined,
        name: undefined,
        onClick: () => {},
        onHover: () => {},
    },
    data = null,
}) {
    const [init, setInit] = useState(false)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        if (!init) {
            const mapbox = new Map({
                container,
                center,
                zoom,
                bounds,
                style,
                accessToken,
                doubleClickZoom,
                dragRotate,
                touchPitch: false,
            });

            mapbox.touchZoomRotate.disableRotation()
            mapbox.on("contextmenu", (e) => {
                e.preventDefault();
            })

            setMap(mapbox)
            setInit(true)
        }
    }, [init]);

    useEffect(() => {
        if(init && !loaded && load.source) {
            loadSource({map, ...load})
            setLoaded(true)
        }
    }, [init, load])

    useEffect(() => {
        if(init && loaded && data) {
            addData(map, data, load.name)
        }
    }, [init, loaded, data])

    /**
     * @param {Map} map
     * @param {object} data 
     */
    function addData(map, data, name) {
        map.on("load", () => {
            for(const [id, value] of Object.entries(data)) {
                map.setFeatureState({ source: name, id }, { value },)
            }

            map.removeLayer(`${name}Fill`)
            map.addLayer({
                id: `${name}Fill`,
                type: "fill",
                source: name,
                layout: {},
                metadata: {
                    "lol": 1
                },
                paint: {
                    "fill-opacity": 1,
                    'fill-color': ['interpolate-hcl', ['linear'], ['feature-state', 'value'], Math.min(...Object.values(data)), '#00f', Math.max(...Object.values(data)), '#fff']
                }
            });

            if(map.getLayer(`${name}Line`)) {
                map.moveLayer(`${name}Fill`, `${name}Line`)
            }
        })
    }

    return <>
        <div
            id={container}
            ref={mapRef}
            style={{
                height: "calc(100%)"
            }}
        ></div>
    </>
}