import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function MapViewer() {
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Campus Map - HIT Holon</h1>

      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={4}
        wheel={{ step: 0.1 }}
        doubleClick={{ disabled: true }}
        limitToBounds={true}
        centerOnInit={true}
        alignmentAnimation={{ sizeX: 0, sizeY: 0 }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div style={styles.controls}>
              <button
                style={styles.button}
                onClick={() => {
                  console.log("zoomIn clicked");
                  zoomIn();
                }}
              >
                Zoom In +
              </button>
              <button
                style={styles.button}
                onClick={() => {
                  console.log("zoomOut clicked");
                  zoomOut();
                }}
              >
                Zoom Out -
              </button>
              <button
                style={styles.button}
                onClick={() => {
                  console.log("reset clicked");
                  resetTransform();
                }}
              >
                Reset
              </button>
            </div>

            <TransformComponent>
              <div style={styles.imageContainer}>
                <img
                  src={`${process.env.PUBLIC_URL}/map.jpg`}
                  alt="Campus Map"
                  style={styles.image}
                  draggable={false}
                />
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100vw",
    margin: 0,
    padding: 0,
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
    position: "relative",
  },
  title: {
    marginBottom: 10,
    fontSize: 24,
  },
  controls: {
    position: "absolute",
    top: 10,
    right: 10,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 8,
    padding: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    zIndex: 1000,
  },
  button: {
    padding: "8px 16px",
    fontSize: 14,
    cursor: "pointer",
    border: "1px solid #ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
    userSelect: "none",
  },
  imageContainer: {
    width: "100vw",
    height: "100vh",
    touchAction: "none",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    userSelect: "none",
  },
};

export default MapViewer;
