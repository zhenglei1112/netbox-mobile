import { useEffect, useRef, useState } from 'react';

import { AUTH_ERROR_MESSAGES } from '../utils/errors.js';

export function QrScanner({ active, onScan, onError }) {
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const [scannerState, setScannerState] = useState('idle');

  useEffect(() => {
    let cancelled = false;

    async function startScanner() {
      if (!active) return;
      if (!navigator.mediaDevices?.getUserMedia) {
        setScannerState('unsupported');
        onError?.(new Error(AUTH_ERROR_MESSAGES.CAMERA_UNSUPPORTED));
        return;
      }

      setScannerState('starting');
      try {
        const { BrowserQRCodeReader } = await import('@zxing/browser');
        if (cancelled || !videoRef.current) return;

        const reader = new BrowserQRCodeReader();
        const controls = await reader.decodeFromVideoDevice(undefined, videoRef.current, (result, error, callbackControls) => {
          if (result) {
            callbackControls.stop();
            controlsRef.current = null;
            setScannerState('decoded');
            onScan(result.getText());
          }
        });

        if (cancelled) {
          controls.stop();
          return;
        }

        controlsRef.current = controls;
        setScannerState('scanning');
      } catch (error) {
        const message = error?.name === 'NotAllowedError'
          ? AUTH_ERROR_MESSAGES.CAMERA_DENIED
          : AUTH_ERROR_MESSAGES.CAMERA_UNSUPPORTED;
        setScannerState('error');
        onError?.(new Error(message));
      }
    }

    startScanner();

    return () => {
      cancelled = true;
      if (controlsRef.current) {
        controlsRef.current.stop();
        controlsRef.current = null;
      }
    };
  }, [active, onError, onScan]);

  return (
    <div className="qr-scanner">
      <video ref={videoRef} className="qr-video" muted playsInline aria-label="二维码摄像头预览" />
      <div className="qr-frame" aria-hidden="true" />
      <p className="qr-status">
        {scannerState === 'starting' ? '正在打开摄像头...' : null}
        {scannerState === 'scanning' ? '请将二维码放入框内' : null}
        {scannerState === 'decoded' ? '已识别二维码' : null}
        {scannerState === 'unsupported' ? '当前浏览器不支持扫码' : null}
        {scannerState === 'error' ? '无法打开摄像头' : null}
        {scannerState === 'idle' ? '准备扫码' : null}
      </p>
    </div>
  );
}
