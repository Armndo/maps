import React, { MutableRefObject, Dispatch, useEffect, useState } from "react";
import mapboxgl, { Map, AnySourceData, FillPaint, LinePaint } from "mapbox-gl";
import { click, loadSource, move } from "./functions";

/**
 * @param {object} props
 * @param {MutableRefObject} props.mapRef
 * @param {Dispatch} props.setMap
 * @param {string} props.container
 * @param {[lat: number, lon: number]} [props.center]
 * @param {number} [props.zoom]
 * @param {[w: number, s: number, e: number, n: number]|[[w: number, s: number], [e: number, n: number]]} [props.bounds]
 * @param {string} [props.style]
 * @param {string} props.accessToken
 * @param {boolean} [props.doubleClickZoom]
 * @param {boolean} [props.dragRotate]
 */
export function MapBox({
    mapRef,
    setMap,
    container = "map",
    center = undefined,
    zoom = undefined,
    bounds = undefined,
    style = undefined,
    accessToken,
    doubleClickZoom = undefined,
    dragRotate = undefined,
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