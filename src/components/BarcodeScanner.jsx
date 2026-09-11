import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { DecodeHintType, BarcodeFormat } from '@zxing/library';

// Retail food products use EAN/UPC barcodes.
const hints = new Map();
hints.set(DecodeHintType.POSSIBLE_FORMATS, [
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
]);

export default function BarcodeScanner({ onDetected }) {
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const [status, setStatus] = useState('starting'); // starting | scanning | error
  const [errorMsg, setErrorMsg] = useState('');
  const [manualCode, setManualCode] = useState('');

  useEffect(() => {
    let cancelled = false;
    const reader = new BrowserMultiFormatReader(hints);

    async function start() {
      try {
        // Prefer the rear camera on phones.
        const constraints = { video: { facingMode: { ideal: 'environment' } } };
        const controls = await reader.decodeFromConstraints(
          constraints,
          videoRef.current,
          (result) => {
            if (cancelled) return;
            if (result) {
              onDetected(result.getText());
            }
            // per-frame NotFoundException errors are ignored
          }
        );
        if (cancelled) {
          controls.stop();
          return;
        }
        controlsRef.current = controls;
        setStatus('scanning');
      } catch (e) {
        if (cancelled) return;
        setStatus('error');
        if (e && (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError')) {
          setErrorMsg('Camera permission denied. Allow camera access, or enter the barcode number below.');
        } else if (e && e.name === 'NotFoundError') {
          setErrorMsg('No camera found. Enter the barcode number below instead.');
        } else {
          setErrorMsg('Could not start the camera. Enter the barcode number below instead.');
        }
      }
    }

    start();

    return () => {
      cancelled = true;
      try { controlsRef.current?.stop(); } catch { /* noop */ }
    };
  }, [onDetected]);

  function submitManual(e) {
    e.preventDefault();
    const code = manualCode.trim();
    if (code) onDetected(code);
  }

  return (
    <div>
      <div className="scanner-frame">
        <video ref={videoRef} className="scanner-video" muted playsInline />
        {status !== 'scanning' && (
          <div className="scanner-overlay">
            {status === 'starting' ? 'Starting camera…' : 'Camera unavailable'}
          </div>
        )}
        {status === 'scanning' && <div className="scanner-reticle" />}
      </div>

      {status === 'scanning' && (
        <p className="scanner-hint">Point your camera at a product barcode.</p>
      )}
      {status === 'error' && <p className="error-text" style={{ marginTop: 10 }}>{errorMsg}</p>}

      <form onSubmit={submitManual} className="manual-code-row">
        <input
          className="search-input"
          style={{ marginBottom: 0 }}
          placeholder="Or type the barcode number"
          inputMode="numeric"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
        />
        <button type="submit" className="btn btn-ghost">Look up</button>
      </form>
    </div>
  );
}
