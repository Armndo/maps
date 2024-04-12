import { Map, MapboxEvent, FillPaint, LinePaint, GeoJSONSource } from "mapbox-gl";

/**
 * @param {object} load
 * @param {Map} load.map
 * @param {GeoJSONSource} load.source
 * @param {string} load.name
 * @param {boolean} load.enableFill
 * @param {FillPaint} load.fill
 * @param {boolean} load.enableLine
 * @param {LinePaint} load.line
 * @param {boolean} load.enableClick
 * @param {Function} load.onClick
 * @param {boolean} load.enableHover
 * @param {Function} load.onHover
 */
function loadSource({
    map,
    source,
    name,
    enableFill = true,
    fill = { "fill-color": "#555", "fill-opacity": 1 },
    enableLine = true,
    line = { "line-color": "#fff", "line-width": 1 },
    enableClick = true,
    onClick = () => {},
    enableHover = true,
    onHover = () => {},
}) {
    map.on("load", () => {
        console.log("load source");

        map.addSource(name, source);

        if(source.type === "geojson") {
            map.addLayer({
                id: `${name}Fill`,
                type: "fill",
                source: name,
                layout: {},
                paint: enableFill ? fill : {
                    "fill-opacity": 0
                },
            });

            if(enableLine) {
                map.addLayer({
                    id: `${name}Line`,
                    type: "line",
                    source: name,
                    layout: {},
                    paint: line,
                });
            }
        }

        if(enableClick) {
            // map.on("click", () => {
            //     if(map.getLayer(`${name}Focus`)) {
            //         map.removeLayer(`${name}Focus`)
            //     }
            // })

            map.on("click", `${name}Fill`, (e) => onClick(e, name, map));
        }

        if(enableHover) {
            map.on("mouseout", `${name}Fill`, () => {
                if(map.getLayer(`${name}Hover`)) {
                    map.removeLayer(`${name}Hover`)
                }

                // for(let popup of map._popups) {
                //     popup.remove()
                // }
            })

            map.on("mousemove", `${name}Fill`, (e) => onHover(e, name, map));
        }

        // map.on("rotate", e => alert(JSON.stringify(Object.keys(e))))
    });

}

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
    loadSource,
    click,
    move,
}