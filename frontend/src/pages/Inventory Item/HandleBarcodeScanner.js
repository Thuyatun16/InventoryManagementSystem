import React, { useState } from "react";
import BarcodeScanner from "./BarcodeScanner";
import scannerIcon from "../../Icon/barcode-scan.png";

function HandleBarcodeScanner({ formData, setFormData, setSellScan, sellData, className, mode }) {
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
    <div className={className}>
      {scan && <BarcodeScanner onScan={handleBarcodeResult} />}
      {mode === 'button'?(
      <button 
        type="button" 
        onClick={() => setScan(!scan)}
        className={`scan-barcode-button ${scan ? 'scanning' : ''}`}  
      >
        {scan ? "Cancel Scanning" : "Start Scanner"}
      </button>
      ): (
        <div className = "input-with-icon">
          <input 
            type="text" 
            placeholder="Enter Barcode" 
            value={formData.barcode || ''} 
            onChange={(e) => {
              if (formData && setFormData) {
                setFormData((prevData) => ({ ...prevData, barcode: e.target.value }));
              }
            }}
          />
          <span
          className="barcode-icon"
          onClick={() => setScan(!scan
          )}
          >
            <img src ={scannerIcon} alt="Scanner Icon"/>
          </span>
        </div>
      )}
    </div>
  );
}

export default HandleBarcodeScanner;