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

// canvas
const canvas = document.querySelector('canvas');
const parent = canvas.parentNode;
const leftSpan = document.getElementById('leftSpan');
const ctx = canvas.getContext('2d');

const unitsAroundOrigin = 10;

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

  // get the vector components
  const vector_i = parseFloat(vector_i_input.value);
  const vector_j = parseFloat(vector_j_input.value);

  // Draw vector
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(scaledOriginX, scaledOriginY); // Start at the origin
  ctx.lineTo(scaledOriginX + vector_i * unitScale, scaledOriginY - vector_j * unitScale); // End point
  ctx.stroke();


  // Get the transformation matrix values from the input fields
  const mat1 = parseFloat(mat1Input.value);
  const mat2 = parseFloat(mat2Input.value);
  const mat3 = parseFloat(mat3Input.value);
  const mat4 = parseFloat(mat4Input.value);

  // Apply the transformation matrix to the input vector (matrix multiplication)
  const transformed_i = mat1 * vector_i + mat2 * vector_j;
  const transformed_j = mat3 * vector_i + mat4 * vector_j;

  // Draw the transformed vector (blue)
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(scaledOriginX, scaledOriginY); // Start at the origin
  ctx.lineTo(scaledOriginX + transformed_i * unitScale, scaledOriginY - transformed_j * unitScale); // End point
  ctx.stroke();

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
  canvas.height = 0.9*parent.clientHeight;
  drawContent();
}

resizeCanvas();

window.addEventListener('resize', resizeCanvas);

