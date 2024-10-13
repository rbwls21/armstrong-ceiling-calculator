// Event listener for form submission
document.getElementById('calculator-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get input values
    const length = parseFloat(document.getElementById('room-length').value);
    const width = parseFloat(document.getElementById('room-width').value);
    const tileSizeOption = document.getElementById('tile-size').value;
    let tileSizeX, tileSizeY;

    // Determine tile dimensions based on selected option
    if (tileSizeOption === "600x600") {
        tileSizeX = 600;
        tileSizeY = 600;
    } else if (tileSizeOption === "1200x600") {
        tileSizeX = 1200;
        tileSizeY = 600;
    } else if (tileSizeOption === "600x1200") {
        tileSizeX = 600;
        tileSizeY = 1200;
    } else {
        // Default to 600x600 if option not recognized
        tileSizeX = 600;
        tileSizeY = 600;
    }

    const rotation = parseFloat(document.getElementById('rotation-angle').value) || 0;
    const shiftX = parseFloat(document.getElementById('shift-horizontal').value) || 0;
    const shiftY = parseFloat(document.getElementById('shift-vertical').value) || 0;
    const alignment = document.getElementById('alignment').value;
    const frameRotation = parseFloat(document.getElementById('frame-rotation').value) || 0;
    const assemblyType = document.getElementById('assembly-diagram').value;

    // Calculate Total Area and Perimeter
    const area = ((length * width) / (1000 * 1000)).toFixed(2); // in square meters
    const perimeter = ((2 * (length + width)) / 1000).toFixed(2); // in meters

    // Update Summary Section
    document.getElementById('total-area').textContent = `${area} m²`;
    document.getElementById('total-perimeter').textContent = `${perimeter} m`;

    // Update Room Dimensions
    document.getElementById('room-dimensions').textContent = `Length: ${length} mm, Width: ${width} mm`;

    // Material Calculations
    const tileArea = (tileSizeX * tileSizeY) / (1000 * 1000); // in square meters
    const numberOfTiles = Math.ceil(area / tileArea);

    // Assuming main runners every 600mm and cross tees every 600mm
    const mainRunnerSpacing = 600; // in mm
    const crossTeesSpacing = 600; // in mm

    const mainRunners = Math.ceil(length / mainRunnerSpacing) * 2; // both sides
    const crossTees = Math.ceil(width / crossTeesSpacing) * 2;

    // Perimeter trim based on perimeter
    const perimeterTrim = Math.ceil((perimeter * 1000) / 600); // number of trims needed

    // Suspension wires assuming suspension sets every 1000mm
    const suspensionSets = Math.ceil((length + width) / 1000);

    // Update Material Breakdown
    document.getElementById('tiles-count').textContent = numberOfTiles;
    document.getElementById('main-runners-count').textContent = mainRunners;
    document.getElementById('cross-tees-count').textContent = crossTees;
    document.getElementById('suspension-wires-count').textContent = suspensionSets;
    document.getElementById('perimeter-trims-count').textContent = perimeterTrim;

    // Draw Grid Visualization
    drawGrid(length, width, tileSizeX, tileSizeY, rotation, shiftX, shiftY, alignment, frameRotation, assemblyType);
});

// Event listener for reset button
document.getElementById('reset-button').addEventListener('click', function() {
    // Clear summary and material breakdown
    document.getElementById('total-area').textContent = '0 m²';
    document.getElementById('total-perimeter').textContent = '0 m';
    document.getElementById('room-dimensions').textContent = 'Length: 0 mm, Width: 0 mm';
    document.getElementById('tiles-count').textContent = '0';
    document.getElementById('main-runners-count').textContent = '0';
    document.getElementById('cross-tees-count').textContent = '0';
    document.getElementById('suspension-wires-count').textContent = '0';
    document.getElementById('perimeter-trims-count').textContent = '0';

    // Clear Canvas
    const canvas = document.getElementById('grid-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
})

// Function to draw grid visualization
function drawGrid(length, width, tileSizeX, tileSizeY, rotation, shiftX, shiftY, alignment, frameRotation, assemblyType) {
    const canvas = document.getElementById('grid-canvas');
    const ctx = canvas.getContext('2d');

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate scaling factor to fit the grid into the canvas
    const totalLength = length + shiftX * 2; // Adjust for shift
    const totalWidth = width + shiftY * 2;
    const scaleX = (canvas.width * 0.7) / totalLength; // 70% of canvas for grid
    const scaleY = (canvas.height * 0.7) / totalWidth;
    const scale = Math.min(scaleX, scaleY);

    // Save the current context
    ctx.save();

    // Translate to center the grid
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // Apply frame rotation
    ctx.rotate(frameRotation * Math.PI / 180);

    // Apply grid rotation
    ctx.rotate(rotation * Math.PI / 180);

    // Apply shift
    ctx.translate(shiftX * scale, shiftY * scale);

    // Move back to top-left after transformations
    ctx.translate(- (length * scale) / 2, - (width * scale) / 2);

    // Draw main runners
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    for(let x = 0; x <= length; x += 600) {
        ctx.beginPath();
        ctx.moveTo(x * scale, 0);
        ctx.lineTo(x * scale, width * scale);
        ctx.stroke();
    }

    // Draw cross tees
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 1.5;
    for(let y = 0; y <= width; y += 600) {
        ctx.beginPath();
        ctx.moveTo(0, y * scale);
        ctx.lineTo(length * scale, y * scale);
        ctx.stroke();
    }

    // Draw perimeter trims
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, length * scale, width * scale);

    // Apply alignment patterns
    if(alignment === 'staggered') {
        ctx.strokeStyle = 'orange';
        ctx.lineWidth = 1.5;
        for(let y = 300; y <= width; y += 600) { // Offset every other row by half tile size
            for(let x = 0; x <= length; x += 600) {
                ctx.beginPath();
                ctx.moveTo((x + 300) * scale, y * scale);
                ctx.lineTo((x + 300) * scale, (y + 600) * scale);
                ctx.stroke();
            }
        }
    }

    // Apply assembly diagram type (placeholder for different patterns)
    switch(assemblyType) {
        case 'type1':
            // Example: Highlight main runners every 1200mm
            ctx.strokeStyle = 'purple';
            ctx.lineWidth = 2;
            for(let x = 0; x <= length; x += 1200) {
                ctx.beginPath();
                ctx.moveTo(x * scale, 0);
                ctx.lineTo(x * scale, width * scale);
                ctx.stroke();
            }
            break;
        case 'type2':
            // Example: Different cross tees spacing every 1200mm
            ctx.strokeStyle = 'brown';
            ctx.lineWidth = 1.5;
            for(let y = 0; y <= width; y += 1200) {
                ctx.beginPath();
                ctx.moveTo(0, y * scale);
                ctx.lineTo(length * scale, y * scale);
                ctx.stroke();
            }
            break;
        case 'type3':
            // Example: Custom pattern with diagonal lines
            ctx.strokeStyle = 'gray';
            ctx.lineWidth = 1;
            // Draw diagonal lines from top-left to bottom-right
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(length * scale, width * scale);
            ctx.stroke();
            // Draw diagonal lines from top-right to bottom-left
            ctx.beginPath();
            ctx.moveTo(length * scale, 0);
            ctx.lineTo(0, width * scale);
            ctx.stroke();
            break;
        default:
            // Default pattern already drawn
            break;
    }

    // Add Dimension Labels
    addDimensionLabels(ctx, length, width, tileSizeX, tileSizeY, scale);

    // Restore the context to default
    ctx.restore();
}

// Function to add dimension labels
function addDimensionLabels(ctx, length, width, tileSizeX, tileSizeY, scale) {
    ctx.fillStyle = 'black';
    ctx.font = `${12 / scale}px Arial`; // Adjusted font size
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw Overall Length Labels (Top and Bottom)
    // Top
    ctx.fillText(`Length: ${length} mm`, (length * scale) / 2, -30 / scale);
    // Bottom
    ctx.fillText(`Length: ${length} mm`, (length * scale) / 2, width * scale + 30 / scale);

    // Draw Overall Width Labels (Left and Right)
    // Left
    ctx.save();
    ctx.translate(-30 / scale, (width * scale) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`Width: ${width} mm`, 0, 0);
    ctx.restore();

    // Right
    ctx.save();
    ctx.translate(length * scale + 30 / scale, (width * scale) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`Width: ${width} mm`, 0, 0);
    ctx.restore();

    // Calculate leftover measurements for corners
    const leftoverLength = length % tileSizeX;
    const leftoverWidth = width % tileSizeY;

    // Draw Corner Measurements if leftovers exist
    if (leftoverLength !== 0) {
        // Top-Left Corner
        ctx.fillText(`${leftoverLength} mm`, tileSizeX * scale / 2, -15 / scale);
        // Top-Right Corner
        ctx.fillText(`${leftoverLength} mm`, length * scale - (tileSizeX * scale) / 2, -15 / scale);
        // Bottom-Left Corner
        ctx.fillText(`${leftoverLength} mm`, tileSizeX * scale / 2, width * scale + 15 / scale);
        // Bottom-Right Corner
        ctx.fillText(`${leftoverLength} mm`, length * scale - (tileSizeX * scale) / 2, width * scale + 15 / scale);
    }

    if (leftoverWidth !== 0) {
        // Top-Left Corner (Vertical)
        ctx.save();
        ctx.translate(-15 / scale, tileSizeY * scale / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`${leftoverWidth} mm`, 0, 0);
        ctx.restore();

        // Top-Right Corner (Vertical)
        ctx.save();
        ctx.translate(length * scale + 15 / scale, tileSizeY * scale / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`${leftoverWidth} mm`, 0, 0);
        ctx.restore();

        // Bottom-Left Corner (Vertical)
        ctx.save();
        ctx.translate(-15 / scale, width * scale - (tileSizeY * scale) / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`${leftoverWidth} mm`, 0, 0);
        ctx.restore();

        // Bottom-Right Corner (Vertical)
        ctx.save();
        ctx.translate(length * scale + 15 / scale, width * scale - (tileSizeY * scale) / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`${leftoverWidth} mm`, 0, 0);
        ctx.restore();
    }
}

// Event listener for download button
document.getElementById('download-button').addEventListener('click', function() {
    const canvas = document.getElementById('grid-canvas');
    const link = document.createElement('a');
    link.download = 'ceiling-grid.png';
    link.href = canvas.toDataURL();
    link.click();
});
