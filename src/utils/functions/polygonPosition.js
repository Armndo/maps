export function polygonPosition(geometry) {
    let figures = []

    if(geometry.type === "Polygon") {
        figures.push(geometry.coordinates)
    } else if(geometry.type === "MultiPolygon") {
        figures = geometry.coordinates
    }

    let index = -1
    let size = -1

    for(const [i, figure] of Object.entries(figures)) {
        if(figure[0].length > size) {
            index = +i
            size = figure[0].length
        }
    }

    const largest = figures[index]
    let lons = []
    let lats = []

    for(const [lon, lat] of largest[0]) {
        lons.push(lon)
        lats.push(lat)
    }

    const bounds = [Math.min(...lons), Math.min(...lats), Math.max(...lons), Math.max(...lats)]
    const [w, s, e, n] = bounds

    return {
        bounds,
        center: {lat: (n + s)/2, lng: (e + w)/2}
    }
}