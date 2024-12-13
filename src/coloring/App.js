import React, { useState, useRef } from 'react';
import './App.css';

const App = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [paths, setPaths] = useState([]);
  const [image, setImage] = useState(null);

  const drawings = [
    { id: 1, name: 'Boule de Noel 2 lutins', src: '/assets/bouledenoel-2lutin.webp' },
    { id: 2, name: 'Boule de Noel Papa Noel', src: '/assets/bouledenoel-papanoel-renne.jpg' },
    { id: 3, name: 'Boule de Noel Renne', src: '/assets/bouledenoel-renne.webp' },
    { id: 4, name: 'Boule de Noel Lutin', src: '/assets/bouledenoel1lutin.webp' },
  ];

  const getContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return {};
    const context = canvas.getContext("2d");
    if (!context) return {};
    return { canvas, context };
  }

  const handleDrawingSelection = (src) => {
    const { canvas, context } = getContext();
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    console.log(src);
    const img = new Image();
    img.src = src;
    img.onload = () => {
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      setImage(img);
    };
  }

  const startDrawing = (event) => {
    const { canvas, context } = getContext();
    if (!canvas || !context) return;
    setPaths([...paths, context.getImageData(0, 0, canvas.width, canvas.height)]);

    const rect = canvas.getBoundingClientRect();
    context.beginPath();
    context.moveTo(
      event.clientX - rect.left,
      event.clientY - rect.top
    );
    setIsDrawing(true);
  };

  const draw = (event) => {
    if (!isDrawing) return;
    const { canvas, context } = getContext();
    if (!canvas || !context) return;

    const rect = canvas.getBoundingClientRect();
    context.lineTo(
      event.clientX - rect.left,
      event.clientY - rect.top
    );
    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
    context.lineCap = "round";
    context.globalAlpha = brushOpacity;
    context.stroke();

    console.log("brush", brushColor, brushSize)
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const { canvas, context } = getContext();
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveCanvasAsJPG = () => {
    const { canvas } = getContext();
    if (!canvas) return;

    const context = canvas.getContext('2d');
    const drawingData = context.getImageData(0, 0, canvas.width, canvas.height);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempContext = tempCanvas.getContext('2d');

    if (image) {
      tempContext.drawImage(image, 0, 0, canvas.width, canvas.height);
    }

    tempContext.putImageData(drawingData, 0, 0);

    const dataURL = tempCanvas.toDataURL("image/jpeg", 1.0);
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "drawing.jpg";
    link.click();
  };

  const undoLastStroke = () => {
    const { canvas, context } = getContext();
    if (!canvas || !context || paths.length === 0) return;

    const newPaths = [...paths];
    const lastState = newPaths.pop();

    context.putImageData(lastState, 0, 0);
    setPaths(newPaths);
  };

  return (
    <div className="app-container">
      <header style={{
        backgroundColor: "#f8f9fa",
        padding: "20px",
        textAlign: "center",
        fontSize: "24px",
        fontWeight: "bold",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)"
      }} className="app-header">
        ColoriageApp
      </header>
      <div style={{ display: "flex", flexDirection: "row", padding: "20px", gap: "20px" }} className="app-content">
        <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "10px" }} className="controls">
          <label><strong>Select a drawing:</strong></label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", padding: "30px" }}>
            {drawings.map((drawing) => (
              <button
                key={drawing.id}
                onClick={() => handleDrawingSelection(drawing.src)}
                style={{
                  padding: "5px",
                  borderRadius: "5px",
                  border: "none",
                  backgroundColor: "white",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
                  display: "flex",
                  // flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer"
                }}
              >
                <img
                  src={drawing.src}
                  alt={drawing.name}
                  style={{ width: "80px", height: "80px", objectFit: "cover", marginBottom: "5px" }}
                />
              </button>
            ))}
          </div>
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "#f9f9f9",
              borderRadius: "10px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontWeight: "bold", color: "#333" }}>Color:</span>
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                style={{
                  border: "none",
                  width: "40px",
                  height: "40px",
                  cursor: "pointer",
                  borderRadius: "10px",
                }}
              />
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontWeight: "bold", color: "#333" }}>Size:</span>
              <input
                type="number"
                min={1}
                max={50}
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                style={{
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  width: "60px",
                }}
              />
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontWeight: "bold", color: "#333" }}>Opacity:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={brushOpacity}
                onChange={(e) => setBrushOpacity(Number(e.target.value))}
                className="opacity-slider"
              />
            </label>
          </div>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button
              onClick={undoLastStroke}
              style={{
                padding: "10px",
                backgroundColor: "#ffc107",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)"
              }}
            >
              Undo Last Stroke
            </button>
            <button
              onClick={clearCanvas}
              style={{
                padding: "10px 20px",
                cursor: "pointer",
                border: "none",
                borderRadius: "5px",
                backgroundColor: "#d90429",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "bold",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 6px 10px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
              }}
            >
              Clear Canvas
            </button>
            <button
              onClick={saveCanvasAsJPG}
              style={{
                padding: "10px 20px",
                cursor: "pointer",
                border: "none",
                borderRadius: "5px",
                backgroundColor: "#003e1f",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "bold",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                marginLeft: "10px",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 6px 10px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
              }}
            >
              Save as JPG
            </button>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{
            flex: "1",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
            borderRadius: "10px"
          }}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onMouseMove={draw}
          className="drawing-canvas"
        />
      </div>
    </div>
  );
};

export default App;
