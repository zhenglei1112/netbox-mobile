import React from 'react';
import { useEffect, useRef, useState } from 'react';

import { getCameraUnavailableMessage } from '../utils/camera.js';
import { AUTH_ERROR_MESSAGES } from '../utils/errors.js';

export function QrScanner({ active, onScan, onError }) {
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const [scannerState, setScannerState] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('准备扫码');

  useEffect(() => {
    let cancelled = false;

    async function startScanner() {
      if (!active) return;

      const unavailableMessage = getCameraUnavailableMessage({
        isSecureContext: window.isSecureContext,
        mediaDevices: navigator.mediaDevices
      });

      if (unavailableMessage) {
        setScannerState('unsupported');
        setStatusMessage(unavailableMessage);
        onError?.(new Error(unavailableMessage));
        return;
      }

      setScannerState('starting');
      setStatusMessage('正在打开摄像头...');
      try {
        const { BrowserQRCodeReader } = await import('@zxing/browser');
        if (cancelled || !videoRef.current) return;

        const reader = new BrowserQRCodeReader();
        const controls = await reader.decodeFromVideoDevice(undefined, videoRef.current, (result, error, callbackControls) => {
          if (result) {
            callbackControls.stop();
            controlsRef.current = null;
            setScannerState('decoded');
            setStatusMessage('已识别二维码');
            onScan(result.getText());
          }
        });

        if (cancelled) {
          controls.stop();
          return;
        }

        controlsRef.current = controls;
        setScannerState('scanning');
        setStatusMessage('请将二维码放入框内');
      } catch (error) {
        const message = error?.name === 'NotAllowedError'
          ? AUTH_ERROR_MESSAGES.CAMERA_DENIED
          : AUTH_ERROR_MESSAGES.CAMERA_UNSUPPORTED;
        setScannerState('error');
        setStatusMessage(message);
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
      <p className={`qr-status qr-status-${scannerState}`}>{statusMessage}</p>
    </div>
  );
}
