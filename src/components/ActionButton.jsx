export default function ActionButton({ children, className = '', type = 'button', ...props }) {
  return <button type={type} className={`action-button${className ? ` ${className}` : ''}`} {...props}>{children}</button>;
}
