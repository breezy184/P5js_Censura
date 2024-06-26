let capture;
var mic;
var noiseSound;
let started = false;
let resW = 720;
let resH = 540;
const MIC_VOL_MIN = 0.01
const MIC_VOL_AMPL = 5

function setup() {
  createCanvas(resW, resH);
  pixelDensity(1);

  capture = createCapture(VIDEO);
  capture.size(resW, resH);
  capture.hide();

  mic = new p5.AudioIn();
  mic.start();

  noiseSound = new p5.Noise('white');
  noiseSound.amp(0);
}

function draw() {
  if (!started) {
    fill("white");
    textSize(20);
    textAlign(CENTER);
    textFont('Courier New');
    text("Cosa ne pensi delle attuali politiche di governo?", width/2, height/2);
    textSize(15);
    fill("grey");
    text("(Clicca per continuare...)", width/2, (height/2)+50);
    return;
  }

  loadPixels();
  let vol = mic.getLevel();
  for (let y = 0; y < resH; y++) {
    for (let x = 0; x < resW; x++) {
      let index = (x + y * width) * 4;
      let r = random(255);
      pixels[index] = r; // Cambia il valore del rosso
      pixels[index + 1] = r; // Cambia il valore del verde
      pixels[index + 2] = r; // Cambia il valore del blu
      pixels[index + 3] = 255; // Imposta l'opacità con il valore definito
    }
  }
  updatePixels();

  let setting = constrain( vol-MIC_VOL_MIN, 0, 1) * MIC_VOL_AMPL
  let opacity = (setting > 0.2) ? 1 : setting
  tint(255, 255-(opacity*255));
  image(capture, 0, 0, resW, resH);
  noiseSound.amp(setting)
}

function mousePressed() {
  if (!started) {
    noiseSound.start();
    started = true;
  }
}