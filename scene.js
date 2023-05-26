//this variable will hold our shader object
let shapeShader;
let mousePoint = [0, 0];
let loopCount = 20;
let iterations = 40;
function preload() {
  theShader = loadShader('uniforms.vert', 'uniforms.frag');
}

function setup() {
  // disables scaling for retina screens which can create inconsistent scaling between displays
  pixelDensity(1);
  
  // shaders require WEBGL mode to work
  let cnv = createCanvas(windowWidth, windowHeight, WEBGL);
  cnv.parent('JuliaContainer');
  noStroke();
}

function draw() {  
  // shader() sets the active shader with our shader
  shader(theShader);
  
  // Lerps the mouse point towards the mouse
  const lerpConst = 0.05;
  mousePoint[0] = mousePoint[0] + (mouseX - mousePoint[0]) * lerpConst;
  mousePoint[1] = mousePoint[1] + (mouseY - mousePoint[1]) * lerpConst;
 

  // lets send the resolution, mouse, and time to our shader
  // before sending mouse + time we modify the data so it's more easily usable by the shader
  theShader.setUniform('resolution', [width, height]);
  theShader.setUniform('mouse', mousePoint);
  theShader.setUniform('time', frameCount * 0.01);
  theShader.setUniform('loopCount', loopCount);
  theShader.setUniform('iterations', iterations);
  
  // rect gives us some geometry on the screen
  rect(0,0,width, height);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}