// vector i and j components
const vector_i_input = document.getElementById('vector-i');
const vector_j_input = document.getElementById('vector-j');

vector_i_input.addEventListener('input', drawContent);
vector_j_input.addEventListener('input', drawContent);

// matrix components
const mat1Input = document.getElementById('mat1');
const mat2Input = document.getElementById('mat2');
const mat3Input = document.getElementById('mat3');
const mat4Input = document.getElementById('mat4');

mat1Input.addEventListener('input', drawContent);
mat2Input.addEventListener('input', drawContent);
mat3Input.addEventListener('input', drawContent);
mat4Input.addEventListener('input', drawContent);

// radio buttons for object selection
const vectorRadio = document.querySelector('input[value="vector"]');
const starRadio = document.querySelector('input[value="star"]');

vectorRadio.addEventListener('change', drawContent);
starRadio.addEventListener('change', drawContent);

// range input for sliding between un-transformed and transformed
const transformScaleInput = document.getElementById('transformScale');
transformScaleInput.addEventListener('input', drawContent);

// determinant display
const det = document.getElementById('det');

// reset to identity matrix
const resetIDInput = document.getElementById('resetID');
resetIDInput.addEventListener('click', function() {
  mat1Input.value = 1;
  mat2Input.value = 0;
  mat3Input.value = 0;
  mat4Input.value = 1;
  drawContent();
})

// rotate current matrix by a certain amount of degrees
const rotButton = document.getElementById('rotate');
const rotDegrees= document.getElementById('rotDegrees');
rotButton.addEventListener('click', function() {
  const rad = parseFloat(rotDegrees.value) * Math.PI / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const a = parseFloat(mat1Input.value);
  const b = parseFloat(mat2Input.value);
  const c = parseFloat(mat3Input.value);
  const d = parseFloat(mat4Input.value);

  mat1Input.value = a * cos - c * sin; 
  mat2Input.value = b * cos - d * sin; 
  mat3Input.value = a * sin + c * cos; 
  mat4Input.value = b * sin + d * cos; 

  drawContent();
})

// reflection across the x axis
const reflX = document.getElementById('reflX');
reflX.addEventListener('click', function() {
  mat3Input.value *= -1;
  mat4Input.value *= -1;
  drawContent();
});

// reflection across the y axis
const reflY = document.getElementById('reflY');
reflY.addEventListener('click', function() {
  mat1Input.value *= -1;
  mat2Input.value *= -1;
  drawContent();
});

const scaleX = document.getElementById('scaleX');
const scaleFactorX= document.getElementById('scaleFactorX');
scaleX.addEventListener('click', function() {
  s = parseFloat(scaleFactorX.value);
  mat1Input.value *= s;
  mat2Input.value *= s;
  drawContent();
})

const scaleY = document.getElementById('scaleY');
const scaleFactorY= document.getElementById('scaleFactorY');
scaleY.addEventListener('click', function() {
  s = parseFloat(scaleFactorY.value);
  mat3Input.value *= s;
  mat4Input.value *= s;
  drawContent();
})


// canvas
const canvas = document.querySelector('canvas');
const parent = canvas.parentNode;
const leftSpan = document.getElementById('leftSpan');
const ctx = canvas.getContext('2d');

const unitsAroundOrigin = 10;
const transparency = 0.7; // Adjust this value (0 to 1) for desired transparency

function transformPoint(x, y, mat1, mat2, mat3, mat4, scale) {
  const transformedX = mat1 * x + mat2 * y;
  const transformedY = mat3 * x + mat4 * y;
  const scaledX = x + (transformedX - x) * scale;
  const scaledY = y + (transformedY - y) * scale;

  return { x: scaledX, y: scaledY };
}

function drawStar(ctx, centerX, centerY, outerRadius, innerRadius, points, unitScale, mat1, mat2, mat3, mat4, color) {
  let rot = Math.PI / 2 * 3;
  const step = Math.PI / points;
  const originalPoints = [];
  const transformedPoints = [];

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = transparency; // Apply transparency

  ctx.beginPath();
  // Calculate and store original points
  for (let i = 0; i < points; i++) {
    let outerX = Math.cos(rot) * outerRadius;
    let outerY = Math.sin(rot) * outerRadius;
    originalPoints.push({ x: outerX, y: outerY });
    rot += step;

    let innerX = Math.cos(rot) * innerRadius;
    let innerY = Math.sin(rot) * innerRadius;
    originalPoints.push({ x: innerX, y: innerY });
    rot += step;
  }
  // Close the star
  originalPoints.push(originalPoints[0]);

  // Calculate and draw the transformed star
  for (let i = 0; i < originalPoints.length; i++) {
    const originalPoint = originalPoints[i];
    const transformed = transformPoint(originalPoint.x, originalPoint.y, mat1, mat2, mat3, mat4, transformScaleInput.value);
    transformedPoints.push(transformed);
    const canvasX = centerX + transformed.x * unitScale;
    const canvasY = centerY - transformed.y * unitScale; // Remember canvas Y is inverted

    if (i === 0) {
      ctx.moveTo(canvasX, canvasY);
    } else {
      ctx.lineTo(canvasX, canvasY);
    }
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.globalAlpha = 1; // Reset transparency for other elements
}

function drawContent() {
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;

  ctx.clearRect(0, 0, width, height);

  // Determine the scaling factor to make units square
  const scaleX = width / (2 * unitsAroundOrigin);
  const scaleY = height / (2 * unitsAroundOrigin);
  const unitScale = Math.min(scaleX, scaleY); // Use the smaller scale to fit within the bounds

  // Calculate the scaled origin
  const scaledOriginX = centerX;
  const scaledOriginY = centerY;

  // Draw grid lines
  ctx.strokeStyle = '#eee';
  ctx.lineWidth = 1;

  // Vertical grid lines
  for (let i = -unitsAroundOrigin; i <= unitsAroundOrigin; i++) {
    const x = scaledOriginX + i * unitScale;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Horizontal grid lines
  for (let i = -unitsAroundOrigin; i <= unitsAroundOrigin; i++) {
    const y = scaledOriginY - i * unitScale;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Draw x and y axes (thicker than grid)
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;

  // X-axis
  ctx.beginPath();
  ctx.moveTo(0, scaledOriginY);
  ctx.lineTo(width, scaledOriginY);
  ctx.stroke();

  // Y-axis
  ctx.beginPath();
  ctx.moveTo(scaledOriginX, 0);
  ctx.lineTo(scaledOriginX, height);
  ctx.stroke();

  const objectType = document.querySelector('input[name="object"]:checked').value;

  // Get the transformation matrix values
  const mat1 = parseFloat(mat1Input.value);
  const mat2 = parseFloat(mat2Input.value);
  const mat3 = parseFloat(mat3Input.value);
  const mat4 = parseFloat(mat4Input.value);

  det.textContent = ((mat1*mat4)-(mat2*mat3)) ;
  console.log((mat1*mat4)-(mat2*mat3));

  if (objectType === 'vector') {
    // get the vector components
    const vector_i = parseFloat(vector_i_input.value);
    const vector_j = parseFloat(vector_j_input.value);

    // Draw vector with transparency
    ctx.strokeStyle = `rgba(255, 0, 0, ${transparency})`; // Red with transparency
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(scaledOriginX, scaledOriginY); // Start at the origin
    ctx.lineTo(scaledOriginX + vector_i * unitScale, scaledOriginY - vector_j * unitScale); // End point
    ctx.stroke();

    // Apply the transformation matrix to the input vector
    const transformed = transformPoint(vector_i, vector_j, mat1, mat2, mat3, mat4, transformScaleInput.value);

    // Draw the transformed vector with transparency
    ctx.strokeStyle = `rgba(0, 0, 255, ${transparency})`; // Blue with transparency
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(scaledOriginX, scaledOriginY); // Start at the origin
    ctx.lineTo(scaledOriginX + transformed.x * unitScale, scaledOriginY - transformed.y * unitScale); // End point
    ctx.stroke();
  } else if (objectType === 'star') {
    const starSize = 0.1; // Adjust for desired size relative to the grid
    const outerRadius = 0.8 * starSize;
    const innerRadius = 0.4 * starSize;
    const points = 5;

    // Draw the original star (red) with transparency
    drawStar(ctx, scaledOriginX, scaledOriginY, outerRadius * unitScale, innerRadius * unitScale, points, unitScale, 1, 0, 0, 1, `rgba(255, 0, 0, ${transparency})`);

    // Draw the transformed star (blue) with transparency
    drawStar(ctx, scaledOriginX, scaledOriginY, outerRadius * unitScale, innerRadius * unitScale, points, unitScale, mat1, mat2, mat3, mat4, `rgba(0, 0, 255, ${transparency})`);
  }

  // Add labels for the axes
  ctx.fillStyle = 'black';
  ctx.font = '12px sans-serif';
  ctx.fillText('X', width - 15, scaledOriginY + 15);
  ctx.fillText('Y', scaledOriginX + 5, 15);

  // Add labels for some unit marks
  const labelSpacing = 2;
  ctx.font = '10px sans-serif';
  ctx.fillStyle = '#666';

  for (let i = -unitsAroundOrigin; i <= unitsAroundOrigin; i += labelSpacing) {
    if (i !== 0) {
      const x = scaledOriginX + i * unitScale;
      ctx.fillText(i, x - 5, scaledOriginY + 15);
    }
  }

  for (let i = -unitsAroundOrigin; i <= unitsAroundOrigin; i += labelSpacing) {
    if (i !== 0) {
      const y = scaledOriginY - i * unitScale;
      ctx.fillText(i, scaledOriginX + 5, y + 5);
    }
  }
}

function resizeCanvas() {
  canvas.width = parent.clientWidth - leftSpan.clientWidth;
  canvas.height = 0.9 * parent.clientHeight;
  drawContent();
}

resizeCanvas();

window.addEventListener('resize', resizeCanvas);
