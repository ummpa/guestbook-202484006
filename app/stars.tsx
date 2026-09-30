export function Stars({ value }: { value: number }) {
  return (
    <span className="leading-none" role="img" aria-label={`별점 ${value}점`}>
      <span className="text-star">{"★".repeat(value)}</span>
      <span className="text-line">{"★".repeat(5 - value)}</span>
    </span>
  );
}
