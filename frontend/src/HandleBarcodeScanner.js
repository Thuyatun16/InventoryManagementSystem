import React, { useState } from "react";
import BarcodeScanner from "./BarcodeScanner";

function HandleBarcodeScanner({ formData, setFormData, setSellScan, sellData }) {
  const [scan, setScan] = useState(false);

  const handleBarcodeResult = (barcode) => {
    if (formData && setFormData) {
      setFormData((prevData) => ({ ...prevData, barcode }));
    }
    if (setSellScan) {
      setSellScan(barcode);
      sellData(barcode);
    }
    setScan(false);
  };

  return (
    <>
      {scan && <BarcodeScanner onScan={handleBarcodeResult} />}
      <button 
        type="button" 
        onClick={() => setScan(!scan)}
        className={`scan-barcode-button ${scan ? 'scanning' : ''}`}  
      >
        {scan ? "Cancel Scanning" : "Start Scanner"}
      </button>
    </>
  );
}

export default HandleBarcodeScanner;
