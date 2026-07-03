import { useCallback, useEffect, useState } from 'react';

import { authService } from '../api/authService.js';
import { AppLayout } from '../components/AppLayout.jsx';
import { ErrorState } from '../components/ErrorState.jsx';
import { QrScanner } from '../components/QrScanner.jsx';
import { collectDeviceInfo } from '../utils/device.js';
import { messageForAuthError } from '../utils/errors.js';
import { parsePairingQrPayload } from '../utils/qr.js';

function buildManualPayload(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('{')) {
    return parsePairingQrPayload(trimmed);
  }

  return parsePairingQrPayload(JSON.stringify({
    type: 'netbox_mobile_pairing',
    pairing_id: trimmed,
    nonce: `manual-${Date.now()}`,
    expires_at: new Date(Date.now() + 120_000).toISOString()
  }));
}

export function LoginPage({ auth, navigate }) {
  const [scannerKey, setScannerKey] = useState(0);
  const [manualCode, setManualCode] = useState('');
  const [pairing, setPairing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (auth.status === 'authenticated') {
      navigate('/mobile/home', { replace: true });
    }
  }, [auth.status, navigate]);

  const submitPayload = useCallback(async (payload) => {
    setPairing(true);
    setError(null);
    try {
      await authService.pair({
        ...payload,
        ...collectDeviceInfo()
      });
      await auth.checkSession();
      navigate('/mobile/home', { replace: true });
    } catch (nextError) {
      setError(nextError);
      if (nextError.status === 403 || nextError.code === 'PERMISSION_DENIED') {
        navigate('/mobile/forbidden', { replace: true });
      }
    } finally {
      setPairing(false);
    }
  }, [auth, navigate]);

  const handleScan = useCallback((rawValue) => {
    try {
      submitPayload(parsePairingQrPayload(rawValue));
    } catch (nextError) {
      setError(nextError);
    }
  }, [submitPayload]);

  const handleManualSubmit = (event) => {
    event.preventDefault();
    try {
      submitPayload(buildManualPayload(manualCode));
    } catch (nextError) {
      setError(nextError);
    }
  };

  return (
    <AppLayout
      title="扫码绑定 NetBox 移动端"
      subtitle="请在电脑端登录 NetBox 或运维门户，打开“绑定移动端”，然后扫描页面上的二维码。"
      footer={<p>二维码只用于一次性绑定，不包含 NetBox Token。</p>}
    >
      <QrScanner
        key={scannerKey}
        active={!pairing}
        onScan={handleScan}
        onError={setError}
      />

      {pairing ? <div className="inline-status">正在绑定设备...</div> : null}
      {error ? <ErrorState title="绑定失败" message={messageForAuthError(error)} /> : null}

      <div className="button-row">
        <button className="secondary-button" type="button" onClick={() => setScannerKey((value) => value + 1)} disabled={pairing}>
          重新扫码
        </button>
      </div>

      <form className="manual-pair-form" onSubmit={handleManualSubmit}>
        <label>
          <span>手动输入绑定码</span>
          <textarea
            value={manualCode}
            onChange={(event) => setManualCode(event.target.value)}
            placeholder="粘贴二维码 JSON，或在 Mock 模式输入 mock-success"
            rows={4}
          />
        </label>
        <button className="primary-button" type="submit" disabled={pairing || manualCode.trim() === ''}>
          提交绑定
        </button>
      </form>
    </AppLayout>
  );
}
