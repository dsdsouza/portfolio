import { useEffect, useRef, useState } from 'react';
import ViewerDialog from './ViewerDialog.jsx';
import ActionButton from './ActionButton.jsx';

function EmailOption({ address: email, label, onOpen }) {
  const href = `mailto:${email}`;
  const addressRef = useRef(null);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (status !== 'copied') return;
    const timer = window.setTimeout(() => setStatus('idle'), 800);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function copyEmail() {
    setStatus('copying');
    try {
      await navigator.clipboard.writeText(email);
      setStatus('copied');
    } catch {
      setStatus('failed');
      addressRef.current?.focus();
      addressRef.current?.select();
    }
  }

  return <section className="email-options" aria-label={`${label} email`}>
    <input ref={addressRef} className="email-address" aria-label={`${label} email address`} value={email} readOnly />
    <div className="email-actions">
      <ActionButton onClick={copyEmail} disabled={status === 'copying'}>{status === 'copied' ? 'Copied' : status === 'copying' ? 'Copying…' : 'Copy email'}</ActionButton>
      <ActionButton onClick={() => { window.location.assign(href); onOpen(); }}>Open email app</ActionButton>
    </div>
    {status === 'failed' && <p className="email-feedback" role="status">Copy didn’t work. The address is selected so you can copy it manually.</p>}
  </section>;
}

export default function EmailMenu({ emails, label = 'Email' }) {
  const [open, setOpen] = useState(false);
  return <span className="email-menu">
    <button className="text-button" type="button" aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen(true)}>{label}</button>
    {open && <ViewerDialog title={label} onClose={() => setOpen(false)}>
      {emails.map((email) => <EmailOption key={email.address} {...email} onOpen={() => setOpen(false)} />)}
    </ViewerDialog>}
  </span>;
}
