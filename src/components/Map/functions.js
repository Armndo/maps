import { MapboxEvent } from "mapbox-gl";

/**
 * @param {MapboxEvent} e event
 * @param {String} id id
 */
function click(e, id) {
    // console.log(e);
    let target = e.target
    let span = document.getElementById(id)
    span.innerHTML = JSON.stringify(e.lngLat)

    // console.log(target.getBounds());
    // console.log(target._canvas.getContext("webgl2"));
}

/**
 * @param {MapboxEvent} e event
 */
function move(e) {
    let target = e.target
    // console.log(target.getBounds(), target.getCenter(), target.getZoom());
    // setIsMoving(false)
    // let aux = e.target.transform
    // let [center, zoom, bounds] = [aux._center, aux._zoom, {}]
    // console.log(center, zoom, e);
}

export {
    click,
    move,
}