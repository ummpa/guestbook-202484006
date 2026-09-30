export function Stars({ value }: { value: number }) {
  return (
    <span className="text-lg leading-none tracking-tight" role="img" aria-label={`별점 ${value}점`}>
      <span className="text-star drop-shadow-[0_1px_0_rgba(0,0,0,0.08)]">{"★".repeat(value)}</span>
      <span className="text-line">{"★".repeat(5 - value)}</span>
    </span>
  );
}
