export default function Card({ children, hoverable = false, className = '', ...props }) {
  return (
    <div
      className={`card ${hoverable ? 'card-hoverable' : ''} p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
