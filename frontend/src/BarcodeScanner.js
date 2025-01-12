import React from "react";
import { useZxing } from "react-zxing";
import sound from "./assets/sound.mp3";

function BarcodeScanner({ onScan}) {
  const { ref } = useZxing({
    onDecodeResult(result) {
      if (result?.getText()) {
        onScan(result.getText());
        const audio = new Audio(sound);
        audio.play();
       
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
