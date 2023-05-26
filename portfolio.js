// Scroll handlers
document.addEventListener('scroll', onScroll);
window.addEventListener('resize', onScroll);

let percentComplete = 0;
const size = 20000;

document.addEventListener('DOMContentLoaded', function() {
    // Set the content div to the right height
    const content = document.getElementById('content');
    content.style.height = size + 'px';
});

// This function also gets called on window resize.
function onScroll() {

    // viewport width and height
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Current scroll position
    const scroll = window.scrollY;

    // Maximum scroll position
    const maxScroll = document.body.scrollHeight - window.innerHeight;

    // Percentage of scroll (rounded to 1 decimal place)
    percentComplete = Math.min(Math.round(scroll/maxScroll * 1000) / 10, 100);
    
    // Text box for percent complete
    const percentText = document.getElementById('percent');
    percentText.innerHTML = percentComplete + "%";

    // Positon and scale animations.
    const animationElements = ['percentContainer', 'informationContainer', 'informationContainer2', 'informationContainer3', 'informationContainer4', 'JuliaContainer', 'JuliaTooltip', 'JuliaDescription'];

    for (let id of animationElements) {
        const element = document.getElementById(id);
        // Name shortening
        const dat = animationData[id];
        let timingIndex = 0;
        let timing = 0;
        if (percentComplete == 100) {
            timing = 1;
            timingIndex = dat.timings.length - 2;
        }
        else {
            // Goes through the animation timings and finds the current timing.
            while (percentComplete > dat.timings[timingIndex + 1]) timingIndex++;
            timing = (percentComplete - dat.timings[timingIndex]) / (dat.timings[timingIndex + 1] - dat.timings[timingIndex]);
        }
        // Applies translation and scale effects.
        element.style.transform = `
        translate(
            ${smoothLerp(dat.relativeTranslate[timingIndex][0], dat.relativeTranslate[timingIndex + 1][0], timing)}%,
            ${smoothLerp(dat.relativeTranslate[timingIndex][1], dat.relativeTranslate[timingIndex + 1][1], timing)}%
        )
        translate(
            ${smoothLerp(dat.translate[timingIndex][0], dat.translate[timingIndex + 1][0], timing) * viewportWidth/2}px,
            ${smoothLerp(dat.translate[timingIndex][1], dat.translate[timingIndex + 1][1], timing) * viewportHeight/2}px
        )
        scale(
            ${smoothLerp(dat.scale[timingIndex], dat.scale[timingIndex + 1], timing)}
        )`;
        // Applies opacity effects.
        element.style.opacity = smoothLerp(dat.opacity[timingIndex], dat.opacity[timingIndex + 1], timing);

    }

}

function smoothLerp(x, y, t) {
    return smoothstep(t) * (y - x) + x;
}

function smoothstep(t) {
    // if (t <= 0) return 0;
    // if (t >= 1) return 1;
    return t * t * (3 - 2 * t);
}