import React from "react";
import { useZxing } from "react-zxing";
import sound from "../../assets/sound.mp3";

function BarcodeScanner({ onScan}) {
  const { ref } = useZxing({
    onDecodeResult(result) {
      if (result?.getText()) {
        try {
          const audio = new Audio(sound);
          audio.play();
          onScan(result.getText());
        } catch (error) {
          console.error("Error playing audio:", error);
        }
      
      }
    },
  });

  return (
    <video
      ref={ref}
      style={{
        display: "block",
        margin: "auto",
        width: "300px",
        height: "300px",
      }}
    />
  );
}

export default BarcodeScanner;