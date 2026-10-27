export default function BulletList({ items = [], className }) {
  return items?.length > 0 ? <ul className={className}>{items.map((item) => <li key={typeof item === 'string' ? item : item.title}>
    {typeof item === 'string' ? item : item.description}
  </li>)}</ul> : null;
}
