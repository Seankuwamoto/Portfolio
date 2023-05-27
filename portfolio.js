// Scroll handlers
document.addEventListener('scroll', onScroll);
document.addEventListener('mousemove', onMouseMove);
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
    const titleText = document.getElementById('title');
    titleText.addEventListener('click', function() {
        window.scrollTo(0, 0);
    });

    // Positon and scale animations.
    const animationElements = ['titleContainer', 'informationContainer', 'informationContainer2', 'informationContainer3', 'informationContainer4', 'JuliaContainer', 'JuliaTooltip', 'JuliaDescription', 'scrollArrowContainer'];

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

function onMouseMove() {
    const titleText = document.getElementById('title');
    if (percentComplete > 10) {
        if (titleText == titleText.parentElement.querySelector(':hover')) {
            titleText.style.cursor = 'pointer';
            titleText.style.transform = 'scale(1.05)';
        }
        else {
            titleText.style.cursor = 'default';
            titleText.style.transform = 'scale(1)';
        }
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