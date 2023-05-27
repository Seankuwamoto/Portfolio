// Who tf knows what this does
precision mediump float;

// Basic constants
#define PI 3.14159265359
#define TWO_PI 6.28318530718
#define SMOOTH false

// Gets the resolution time and mouse pos passed in from the other thing
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
uniform float loopCount;
uniform int iterations;

// Lets you make rgb colors with 0-255 values
vec3 rgb(float r, float g, float b) {
  return vec3(r / 255.0, g / 255.0, b / 255.0);
}

vec2 csquare(vec2 z) {
  return vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
}

vec3 turbo(in float x) {
  if (x == -1.0) return rgb(30.0, 30.0, 30.0);
  const vec4 kRedVec4 = vec4(0.13572138, 4.61539260, -42.66032258, 132.13108234);
  const vec4 kGreenVec4 = vec4(0.09140261, 2.19418839, 4.84296658, -14.18503333);
  const vec4 kBlueVec4 = vec4(0.10667330, 12.64194608, -60.58204836, 110.36276771);
  const vec2 kRedVec2 = vec2(-152.94239396, 59.28637943);
  const vec2 kGreenVec2 = vec2(4.27729857, 2.82956604);
  const vec2 kBlueVec2 = vec2(-89.90310912, 27.34824973);
  
  x = abs(mod(x, 2.0) - 1.0);
  // x = mod(x, 1.0);
  vec4 v4 = vec4( 1.0, x, x * x, x * x * x);
  vec2 v2 = v4.zw * v4.z;
  return vec3(
    dot(v4, kRedVec4)   + dot(v2, kRedVec2),
    dot(v4, kGreenVec4) + dot(v2, kGreenVec2),
    dot(v4, kBlueVec4)  + dot(v2, kBlueVec2)
  );
}

float getColoring(vec2 coord, int iteration) {
  if (SMOOTH) {
    return (float(iteration) + 1.0 - log2(log2(length(coord)))) / float(iterations);
  }
  else {
    return float(iteration) / loopCount;
  }
}
float isInMandelbrot(vec2 coord, vec2 _) {
  
  // Subtracts half the resolution from the coordinate
  coord -= resolution / 2.0;

  // Scales the coordinate down by 200.
  coord /= 200.0;
  vec2 z = vec2(0.0, 0.0);
  for (int i = 0; i < 10000; i++) {

    if (i > iterations) {
      return 1.0;
    }
    // The mandelbrot equation
    z = csquare(z) + coord;
    // If the magnitude of z is greater than 2, return the number of iterations it took to get there
    if (length(z) > 2.0) {
      return getColoring(z, i);
    }
  }
  // If it never gets greater than 2, return 1
  return 1.0;
}

float isInJulia(vec2 coord, vec2 mousePos) {

  // Subtracts half the resolution from the coordinate
  coord -= resolution / 2.0;

  // Subtracts half the resolution from the mouse position
  mousePos -= resolution / 2.0;
  
  // Scales the coordinate down by 200.
  coord /= 200.0;

  // Scales the mouse position down by 200.
  mousePos /= 400.0;

  vec2 z = coord;
  // A simple for loop 
  for (int i = 0; i < 10000; i++) {

    if (i > iterations) {
      return 1.0;
    }

    // The mandelbrot equation
    z = csquare(z) + mousePos;
    // If the magnitude of z is greater than 2, return the number of iterations it took to get there
    if (length(z) > 2.0) {
      if (i == 0) {
        return -1.0;
      }
      return getColoring(z, i);
    }
  }
  // If it never gets greater than 2, return 1
  return 1.0;
}

void main() {

  // get the coordinates of the current pixel
  vec2 coord = gl_FragCoord.xy;

  vec4 pixelColor = vec4(turbo(isInJulia(coord, mouse)), 1);

  gl_FragColor = vec4(pixelColor.rgba);
}