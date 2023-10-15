const minScaleWidth = 50;
const maxScaleWidth = 130;

const niceNumbers = [
    1,
    2,
    5,
    10,
    15,
    30,
    60, // 1m
    120, // 2m
    300, // 5m
    600, // 10m
    900, // 15m
    1200, // 20m
    1800, // 30m
    3600, // 1h
    7200, // 2h
    21600, // 6h
    43200, // 12h
    86400, // 24h
];

export function calculateScaleAndWidth(zoom, timelineDuration, timelineWidth) {
    if (isNaN(+zoom) || zoom < 0 || zoom > 1) zoom = 1;
    if (isNaN(+timelineDuration)) timelineDuration = 60;
    zoom += 0.05;

    // TODO: Math.min is hardcode
    // Step 1: Calculate the visible duration based on the total duration and the zoom level
    const visibleDuration = Math.min(30, timelineDuration * zoom);

    // Step 2: Calculate the raw scale and scale width
    let scaleWidth = timelineWidth * zoom;
    let scale = visibleDuration / (timelineWidth / scaleWidth);

    // If scaleWidth is out of its range, adjust it and calculate new scale
    if (scaleWidth < minScaleWidth) {
        scaleWidth = minScaleWidth;
        scale = visibleDuration / (timelineWidth / scaleWidth);
    } else if (scaleWidth > maxScaleWidth) {
        scaleWidth = maxScaleWidth;
        scale = visibleDuration / (timelineWidth / scaleWidth);
    }

    // Step 3: Round the scale to a "nice" number
    scale = niceNumbers.reduce((prev, curr) => (Math.abs(curr - scale) < Math.abs(prev - scale) ? curr : prev));

    // Step 4: Recalculate the scaleWidth based on the "nice" scale
    scaleWidth = timelineWidth / (visibleDuration / scale);
    const scaleCount = Math.ceil(timelineDuration / scale);

    return { scale, scaleWidth, scaleCount };
}
