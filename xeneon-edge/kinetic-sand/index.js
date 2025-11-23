import p5 from 'p5';

// --- MATH UTILS (Consolidated) ---

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomFloat = (min, max) => Math.random() * (max - min) + min;
const coinFlip = () => Math.random() > 0.5;

/**
 * 1. Harmonic Lissajous Labyrinth
 * High frequency multipliers (f1 ~10) mean we need very few base revolutions.
 */
const createLissajousLabyrinth = () => {
  const f1 = randomInt(7, 13); 
  const f2 = f1 + (coinFlip() ? 2 : 4); 
  const f3 = randomInt(2, 5); 
  
  const phase1 = Math.random() * Math.PI * 2;
  const phase2 = Math.random() * Math.PI * 2;
  
  const drift = randomFloat(0.5, 2.0);
  
  // DRAPSTICALLY REDUCED: 1-2.5 revs is enough because f1/f2 create the density
  const revs = randomFloat(1.0, 2.5); 

  return (t) => {
    const angle = t * Math.PI * 2 * revs;
    const amp = 0.85 + 0.15 * Math.sin(angle / f1 * f3);
    const x = amp * Math.sin(angle * f1 + phase1 + t * drift);
    const y = amp * Math.cos(angle * f2 + phase2);
    return { x, y };
  };
};

/**
 * 2. Rational Rose Web
 */
const createRationalRoseWeb = () => {
  const n = randomInt(3, 11);
  const d = randomInt(2, 7); 
  
  const precession = randomFloat(0.1, 0.4) * (coinFlip() ? 1 : -1);
  // Reduced to 6-12
  const revs = randomInt(6, 12);
  
  return (t) => {
     const theta = t * Math.PI * 2 * revs;
     const k = n / d;
     const r = Math.cos(k * theta + (theta * 0.01) + (t * Math.PI * precession));
     const x = r * Math.cos(theta);
     const y = r * Math.sin(theta);
     return { x, y };
  };
};

/**
 * 3. Hypotrochoid / Epitrochoid (Spirograph)
 */
const createSpirograph = () => {
  const isEpi = coinFlip(); 
  const R = randomFloat(0.5, 0.8) + 0.00123; 
  const r = randomFloat(0.12, 0.45) + 0.00456; 
  const d = randomFloat(0.2, 0.9); 
  // Reduced to 5-10
  const revs = randomInt(5, 10);
  
  const globalRot = randomFloat(0.2, 1.0);

  return (t) => {
    const theta = t * Math.PI * 2 * revs;
    let x, y;

    if (isEpi) {
        x = (R + r) * Math.cos(theta) - d * Math.cos(((R + r) / r) * theta);
        y = (R + r) * Math.sin(theta) - d * Math.sin(((R + r) / r) * theta);
    } else {
        x = (R - r) * Math.cos(theta) + d * Math.cos(((R - r) / r) * theta);
        y = (R - r) * Math.sin(theta) - d * Math.sin(((R - r) / r) * theta);
    }
    
    const rot = t * Math.PI * globalRot;
    const xRot = x * Math.cos(rot) - y * Math.sin(rot);
    const yRot = x * Math.sin(rot) + y * Math.cos(rot);
    
    const maxExt = R + r + d;
    return { x: xRot / maxExt, y: yRot / maxExt };
  };
};

/**
 * 4. Roto-Spiro
 */
const createRotoSpiro = () => {
  const R = randomFloat(0.4, 0.6);
  const r = randomFloat(0.1, 0.3);
  const d = randomFloat(0.3, 0.8);
  const frameSpeed = randomFloat(1, 4) * (coinFlip() ? 1 : -1);
  const drift = randomFloat(0.1, 0.5);
  // Reduced to 4-8
  const revs = randomInt(4, 8);
  
  return (t) => {
    const theta = t * Math.PI * 2 * revs;
    const frameTheta = t * Math.PI * 2 * (frameSpeed + t * drift * 0.1);
    
    const xRaw = (R - r) * Math.cos(theta) + d * Math.cos(((R - r) / r) * theta);
    const yRaw = (R - r) * Math.sin(theta) - d * Math.sin(((R - r) / r) * theta);
    
    const x = xRaw * Math.cos(frameTheta) - yRaw * Math.sin(frameTheta);
    const y = xRaw * Math.sin(frameTheta) + yRaw * Math.cos(frameTheta);
    
    const maxR = R + r + d; 
    return { x: x / maxR, y: y / maxR };
  };
};

/**
 * 5. Harmonograph (Symmetric)
 */
const createHarmonograph = () => {
  const u = randomInt(2, 4);
  const v = randomInt(2, 5);
  const detune1 = randomFloat(0.002, 0.01);
  const detune2 = randomFloat(0.002, 0.01);
  const f1 = u + detune1;
  const f3 = u + detune1; 
  const f2 = v + detune2;
  const f4 = v + detune2;
  const p1 = 0;
  const p3 = Math.PI / 2; 
  const p2 = 0;
  const p4 = (Math.floor(Math.random() * 4) * Math.PI / 2); 
  // Reduced to 4-10
  const revs = randomInt(4, 10);

  return (t) => {
      const time = t * Math.PI * 2 * revs;
      const x = Math.sin(time * f1 + p1) + Math.sin(time * f2 + p2);
      const y = Math.sin(time * f3 + p3) + Math.sin(time * f4 + p4);
      return { x: x / 2.1, y: y / 2.1 };
  };
};

/**
 * 6. Spiral Galaxy
 */
const createSpiralGalaxy = () => {
  const arms = randomInt(3, 9);
  const curvature = randomFloat(0.5, 1.5);
  // Reduced to 4-8 turns
  const revs = randomInt(4, 8);
  const armPhase = Math.random() * Math.PI;
  const galaxyDrift = randomFloat(0.2, 0.8);

  return (t) => {
    const theta = t * Math.PI * 2 * revs;
    let rBase = Math.pow(t, 0.6); 
    const modulation = 0.1 * Math.sin(arms * theta + armPhase);
    const r = rBase + modulation;
    
    const phi = theta * curvature + (t * Math.PI * galaxyDrift);
    
    const x = r * Math.cos(phi);
    const y = r * Math.sin(phi);
    return { x: x / 1.15, y: y / 1.15 };
  };
};

/**
 * 7. Torus Knot
 */
const createTorusKnot = () => {
  const pVal = randomInt(2, 7);
  const qVal = pVal + randomInt(1, 3);
  // Reduced to 3-6
  const revs = randomInt(3, 6);
  const drift = randomFloat(0.5, 1.5);
  
  return (t) => {
    const phi = t * Math.PI * 2 * revs;
    const radius = 0.6 + 0.25 * Math.cos(qVal * phi + (t * drift));
    const x = radius * Math.cos(pVal * phi);
    const y = radius * Math.sin(pVal * phi);
    return { x: x / 1.0, y: y / 1.0 };
  };
};

/**
 * 8. Superformula Star
 */
const createSuperformula = () => {
  const m = randomInt(3, 12);
  const n1 = randomFloat(0.5, 3);
  const n2 = randomFloat(0.5, 3);
  const n3 = randomFloat(0.5, 3);
  // Reduced to 5-10
  const revs = randomInt(5, 10);
  const rotationSpeed = randomFloat(0.1, 0.3) * (coinFlip() ? 1 : -1);

  return (t) => {
    const phi = t * Math.PI * 2 * revs;
    const term1 = Math.pow(Math.abs(Math.cos(m * phi / 4)), n2);
    const term2 = Math.pow(Math.abs(Math.sin(m * phi / 4)), n3);
    const r = Math.pow(term1 + term2, -1 / n1);
    
    const rot = phi * 0.05 + (t * Math.PI * 2 * rotationSpeed);
    const rScaled = r * 0.5; 
    
    const x = rScaled * Math.cos(phi + rot);
    const y = rScaled * Math.sin(phi + rot);
    return { x, y };
  };
};

/**
 * 9. Infinity Cycle
 */
const createInfinityCycle = () => {
  // Reduced to 4-8
  const revs = randomInt(4, 8);
  const rotationSpeed = randomFloat(0.02, 0.1);
  
  return (t) => {
    const theta = t * Math.PI * 2 * revs;
    const denom = 1 + Math.sin(theta)*Math.sin(theta);
    const r = 0.8; 
    const xBase = (r * Math.cos(theta)) / denom;
    const yBase = (r * Math.sin(theta) * Math.cos(theta)) / denom;
    
    const rot = theta * 0.01 + (t * Math.PI * 4 * rotationSpeed);
    const x = xBase * Math.cos(rot) - yBase * Math.sin(rot);
    const y = xBase * Math.sin(rot) + yBase * Math.cos(rot);
    return { x, y };
  };
};

/**
 * 10. Butterfly Curve
 */
const createButterflyCurve = () => {
  // Reduced to 4-8
  const revs = randomInt(4, 8);
  const drift = randomFloat(0.2, 0.6);
  
  return (t) => {
    const theta = t * Math.PI * 2 * revs;
    const term1 = Math.exp(Math.sin(theta));
    const term2 = 2 * Math.cos(4 * theta);
    const term3 = Math.pow(Math.sin((2 * theta - Math.PI) / 24), 5);
    const rRaw = term1 - term2 + term3;
    const r = rRaw * 0.18;
    
    const rot = t * Math.PI * drift;
    
    const x = r * Math.cos(theta + rot);
    const y = r * Math.sin(theta + rot);
    return { x, y };
  };
};


const getRandomPattern = () => {
  const generators = [
    { name: 'Harmonograph', fn: createHarmonograph },
    { name: 'Roto Spiro', fn: createRotoSpiro },
    { name: 'Spirograph Mandala', fn: createSpirograph },
    { name: 'Rational Rose', fn: createRationalRoseWeb },
    { name: 'Lissajous Labyrinth', fn: createLissajousLabyrinth },
    { name: 'Spiral Galaxy', fn: createSpiralGalaxy },
    { name: 'Torus Knot', fn: createTorusKnot },
    { name: 'Superformula Star', fn: createSuperformula },
    { name: 'Infinity Cycle', fn: createInfinityCycle },
    { name: 'Butterfly Curve', fn: createButterflyCurve }
  ];
  const choice = generators[Math.floor(Math.random() * generators.length)];
  console.log(`Starting pattern: ${choice.name}`);
  return {
    name: choice.name,
    generator: choice.fn()
  };
};

// --- MAIN SKETCH ---

const TableState = {
  DRAWING: 'DRAWING',
  ERASING: 'ERASING'
};

const TARGET_DURATION_MS = 180 * 1000; // 3 Minutes
const MAX_SPEED_PX_PER_SEC = 60; 
const ERASE_DURATION_MS = 8000;
const BALL_RADIUS = 4.5; 

const sketch = (p) => {
  let currentState = TableState.DRAWING;
  let currentProgress = 0; 
  let eraseStartTime = 0;

  let currentPattern = null;
  let lastDrawPos = null;
  let currentBallPos = { x: 0, y: 0 };
  
  let shadowLayer;    
  let highlightLayer; 
  let sandTexture;
  
  let canvasSize = 0;
  let center = 0;
  let drawScale = 0;

  p.setup = () => {
    const dimW = window.innerWidth || 800;
    const dimH = window.innerHeight || 800;
    const maxDim = Math.min(dimW, dimH);
    // Adjusted size calculation to account for larger rim padding
    // Increased safety margin to -160 to prevent clipping in tight iframes (like 835x690)
    const size = Math.max(300, Math.min(maxDim - 160, 800));
    
    canvasSize = size;
    center = size / 2;
    drawScale = canvasSize * 0.47;
    
    const canvas = p.createCanvas(size, size);
    const container = document.getElementById('canvas-container');
    if (container) {
        canvas.parent(container);
    }
    
    canvas.style('display', 'block');
    p.pixelDensity(2);

    shadowLayer = p.createGraphics(size, size);
    shadowLayer.pixelDensity(2);
    shadowLayer.clear();
    
    highlightLayer = p.createGraphics(size, size);
    highlightLayer.pixelDensity(2);
    highlightLayer.clear();
    
    // INCREASED BRIGHTNESS: Range updated to 200-255
    sandTexture = p.createImage(size, size);
    sandTexture.loadPixels();
    for (let i = 0; i < sandTexture.width; i++) {
      for (let j = 0; j < sandTexture.height; j++) {
        const idx = 4 * (j * sandTexture.width + i);
        const val = p.random(200, 255); 
        sandTexture.pixels[idx] = val;     
        sandTexture.pixels[idx + 1] = val - 5; 
        sandTexture.pixels[idx + 2] = val - 10; 
        sandTexture.pixels[idx + 3] = 255; 
      }
    }
    sandTexture.updatePixels();

    startNewPattern();
  };

  const startNewPattern = () => {
    currentPattern = getRandomPattern();
    currentProgress = 0;
    lastDrawPos = null;
    currentState = TableState.DRAWING;
  };
  
  p.mousePressed = () => {
    const d = p.dist(p.mouseX, p.mouseY, center, center);
    if (d <= canvasSize / 2) {
      shadowLayer.clear();
      highlightLayer.clear();
      startNewPattern();
      return false;
    }
  };

  const drawBallAt = (x, y, shadPg, highPg) => {
        shadPg.noStroke();
        // REDUCED OPACITY
        shadPg.fill(60, 50, 40, 6); 
        shadPg.circle(x, y, BALL_RADIUS * 2.8);
        shadPg.fill(40, 30, 20, 8); 
        shadPg.circle(x, y, BALL_RADIUS * 1.6);

        highPg.noStroke();
        highPg.fill(255, 255, 255, 12);
        highPg.circle(x - BALL_RADIUS * 0.6, y - BALL_RADIUS * 0.6, BALL_RADIUS * 1.4);
  };

  p.draw = () => {
    if (!shadowLayer || !highlightLayer) return;

    const dtMs = p.deltaTime || 16; 

    if (currentState === TableState.DRAWING) {
      if (currentProgress >= 1) {
        currentState = TableState.ERASING;
        eraseStartTime = p.millis();
      }

      if (currentPattern) {
        let idealTInc = dtMs / TARGET_DURATION_MS;

        const tPeek = Math.min(currentProgress + 0.0001, 1);
        const p1 = currentPattern.generator(currentProgress);
        const p2 = currentPattern.generator(tPeek);
        
        const distNorm = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        const projectedDistNorm = (distNorm * 10000) * idealTInc;
        const projectedDistPx = projectedDistNorm * drawScale;
        const projectedSpeed = (projectedDistPx / dtMs) * 1000; 

        let actualTInc = idealTInc;
        if (projectedSpeed > MAX_SPEED_PX_PER_SEC) {
            const scaleFactor = MAX_SPEED_PX_PER_SEC / projectedSpeed;
            actualTInc *= scaleFactor;
        }

        const tPrev = currentProgress;
        const tNext = Math.min(currentProgress + actualTInc, 1);
        
        const steps = 6; 
        for (let i = 1; i <= steps; i++) {
           const tSub = p.lerp(tPrev, tNext, i / steps);
           const rawPos = currentPattern.generator(tSub);
           
           const distSq = rawPos.x*rawPos.x + rawPos.y*rawPos.y;
           let finalX = rawPos.x;
           let finalY = rawPos.y;
           
           if (distSq > 1) {
             const dist = Math.sqrt(distSq);
             finalX = rawPos.x / dist;
             finalY = rawPos.y / dist;
           }

           const targetX = center + finalX * drawScale;
           const targetY = center + finalY * drawScale;
           
           let shouldDraw = true;
           if (lastDrawPos) {
             const dx = targetX - lastDrawPos.x;
             const dy = targetY - lastDrawPos.y;
             if (dx*dx + dy*dy < 0.6) {
               shouldDraw = false;
             }
           }

           if (shouldDraw) {
             drawBallAt(targetX, targetY, shadowLayer, highlightLayer);
             lastDrawPos = { x: targetX, y: targetY };
           }
           
           if (i === steps) {
             currentBallPos = { x: targetX, y: targetY };
           }
        }
        
        currentProgress = tNext;
      }

    } else if (currentState === TableState.ERASING) {
      const elapsed = p.millis() - eraseStartTime;
      const eraseT = elapsed / ERASE_DURATION_MS;
      
      if (eraseT >= 1) {
        shadowLayer.clear();
        highlightLayer.clear();
        startNewPattern();
      }
    }

    // --- RENDER ---
    p.blendMode(p.BLEND);
    // INCREASED BRIGHTNESS: Lighter background color
    p.background(245, 240, 235); 
    
    if (sandTexture) {
      p.tint(255, 255); 
      p.image(sandTexture, 0, 0, canvasSize, canvasSize);
    }

    p.blendMode(p.MULTIPLY);
    p.image(shadowLayer, 0, 0);

    p.blendMode(p.ADD);
    p.image(highlightLayer, 0, 0);

    p.blendMode(p.BLEND);

    // Calculate scale factor relative to 800px max size
    // Used to scale borders proportionally
    const scale = canvasSize / 800;

    // Rim
    p.noFill();
    p.stroke(40, 30, 20); 
    p.strokeWeight(25 * scale);
    p.circle(center, center, canvasSize + (8 * scale));
    
    // Vignette
    for(let i=0; i<25; i++) {
        p.stroke(20, 10, 0, 5); 
        p.strokeWeight((i * 1.5) * scale);
        p.circle(center, center, canvasSize - (i * scale));
    }
    
    if (currentState === TableState.ERASING) {
      p.noStroke();
      p.fill(245, 240, 235, 15); 
      p.rect(0, 0, canvasSize, canvasSize);
    }

    if (currentState === TableState.DRAWING) {
      const pos = currentBallPos;
      p.noStroke();
      p.fill(0, 0, 0, 100);
      p.circle(pos.x + 3, pos.y + 3, BALL_RADIUS * 2.2);
      p.fill(180);
      p.circle(pos.x, pos.y, BALL_RADIUS * 2);
      p.fill(255);
      p.circle(pos.x - 1.5, pos.y - 1.5, BALL_RADIUS * 0.8);
    }
  };
  
  p.windowResized = () => {
      const dimW = window.innerWidth || 800;
      const dimH = window.innerHeight || 800;
      const maxDim = Math.min(dimW, dimH);
      // Adjusted resize calculation to match setup
      // Increased safety margin to -160
      const size = Math.max(300, Math.min(maxDim - 160, 800));

      if (Math.abs(size - canvasSize) > 10) {
          canvasSize = size;
          center = size / 2;
          drawScale = size * 0.47;
          
          p.resizeCanvas(size, size);
          
          shadowLayer = p.createGraphics(size, size);
          shadowLayer.pixelDensity(2);
          shadowLayer.clear();
          
          highlightLayer = p.createGraphics(size, size);
          highlightLayer.pixelDensity(2);
          highlightLayer.clear();
          
          sandTexture = p.createImage(size, size);
          sandTexture.loadPixels();
          for (let i = 0; i < sandTexture.width; i++) {
            for (let j = 0; j < sandTexture.height; j++) {
                const idx = 4 * (j * sandTexture.width + i);
                const val = p.random(200, 255); 
                sandTexture.pixels[idx] = val;     
                sandTexture.pixels[idx + 1] = val - 5; 
                sandTexture.pixels[idx + 2] = val - 10; 
                sandTexture.pixels[idx + 3] = 255; 
            }
          }
          sandTexture.updatePixels();
          
          startNewPattern();
      }
  }
};

const P5 = p5.default || p5;
new P5(sketch);