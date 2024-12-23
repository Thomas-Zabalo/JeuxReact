import React, { useState, useRef, useEffect } from 'react';
import { Button, Drawer } from "flowbite-react";

function Color() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [paths, setPaths] = useState([]);
  const [image, setImage] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 600 });

  const [isOpen, setIsOpen] = useState(true);
  const handleClose = () => setIsOpen(false);

  const drawings = [
    { id: 1, name: 'Boule de Noel 2 lutins', src: '/assets/dessin/bouledenoel-2lutin.webp' },
    { id: 2, name: 'Boule de Noel Papa Noel', src: '/assets/dessin/bouledenoel-papanoel-renne.jpg' },
    { id: 3, name: 'Boule de Noel Renne', src: '/assets/dessin/bouledenoel-renne.webp' },
    { id: 4, name: 'Boule de Noel Lutin', src: '/assets/dessin/bouledenoel1lutin.webp' },
  ];

  const getContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return {};
    const context = canvas.getContext('2d', { willReadFrequently: true });
    return { canvas, context };
  };


  // Resize canvas based on the viewport
  const resizeCanvas = () => {
    const width = Math.min(window.innerWidth * 0.8, 900);
    const height = Math.min(window.innerHeight * 0.7, 700);
    setCanvasSize({ width, height });

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (context) context.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const handleDrawingSelection = (src) => {
    const { canvas, context } = getContext();
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    const img = new Image();
    img.src = src;
    img.onload = () => {
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      setImage(img);
    };
  };

  const getEventPosition = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if (event.touches) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }
  };

  const startDrawing = (event) => {
    event.preventDefault();
    const { canvas, context } = getContext();
    if (!canvas || !context) return;

    const pos = getEventPosition(event);
    setPaths([...paths, context.getImageData(0, 0, canvas.width, canvas.height)]);

    context.beginPath();
    context.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };

  const draw = (event) => {
    if (!isDrawing) return;
    event.preventDefault();
    const { canvas, context } = getContext();
    if (!canvas || !context) return;

    const pos = getEventPosition(event);
    context.lineTo(pos.x, pos.y);
    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
    context.lineCap = "round";
    context.globalAlpha = brushOpacity;
    context.stroke();
  };

  const stopDrawing = (event) => {
    event?.preventDefault();
    const { canvas, context } = getContext();
    if (!canvas || !context) return;
    setPaths((prevPaths) => [
      ...prevPaths,
      context.getImageData(0, 0, canvas.width, canvas.height),
    ]);
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

    const context = canvas.getContext('2d', { willReadFrequently: true });
    const drawingData = context.getImageData(0, 0, canvas.width, canvas.height);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempContext = tempCanvas.getContext('2d', { willReadFrequently: true });

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

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    canvas.addEventListener("touchstart", startDrawing);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);

      canvas.removeEventListener("touchstart", startDrawing);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", stopDrawing);
    };
  }, [isDrawing]);

  return (
    <div className="app-container">
      <header className="bg-gray-400 p-4 sm:p-5 text-center text-lg sm:text-2xl font-bold shadow-md text-black" >
        <Button
          gradientMonochrome="success"
          onClick={() => setIsOpen(true)}
          size="sm"
        >
          Settings
        </Button>
      </header>

      <div className="flex flex-col p-4 sm:p-5 gap-4 sm:gap-5 app-content ">
        <Drawer open={isOpen} onClose={handleClose}>
          <Drawer.Header title="Settings" />
          <Drawer.Items>
            <div className="flex-1 flex flex-col gap-4 sm:gap-2.5 controls">
              <label className="font-bold">Select a drawing:</label>
              <div className="flex flex-wrap gap-2.5 p-4 sm:p-7">
                {drawings.map((drawing) => (
                  <button
                    key={drawing.id}
                    onClick={() => handleDrawingSelection(drawing.src)}
                    className="p-1 rounded-md border-none bg-white shadow-lg flex items-center cursor-pointer"
                  >
                    <img
                      src={drawing.src}
                      alt={drawing.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover mb-1.5"
                    />
                  </button>
                ))}
              </div>

              <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md flex flex-col gap-4">
                <label className="flex items-center gap-2.5">
                  <span className="font-bold text-gray-800">Color:</span>
                  <input
                    type="color"
                    value={brushColor}
                    onChange={(e) => setBrushColor(e.target.value)}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg cursor-pointer border-none"
                  />
                </label>

                <label className="flex items-center gap-2.5">
                  <span className="font-bold text-gray-800">Size:</span>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="p-1 border border-gray-300 rounded-md w-12 sm:w-15"
                  />
                </label>

                <label className="flex items-center gap-2.5">
                  <span className="font-bold text-gray-800">Opacity:</span>
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

              <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
                <Button gradientMonochrome="lime" onClick={undoLastStroke}>
                  Undo Last Stroke
                </Button>
                <Button gradientMonochrome="failure" onClick={clearCanvas}>
                  Clear Canvas
                </Button>
                <Button gradientMonochrome="success" onClick={saveCanvasAsJPG}>
                  Save as JPG
                </Button>
              </div>
            </div>
          </Drawer.Items>
        </Drawer>

        <div className="flex justify-center items-center w-full sm:w-auto">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="shadow-lg rounded-lg max-w-full"
          />
        </div>
      </div>
    </div>

  );
};

export default Color;
