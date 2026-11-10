// Renders a heading's last `tail` words in the dim colour (e.g. "Build it. Automate it. *Grow it.*").
// Purely visual: the text itself is unchanged, so copy stays verbatim.
export function SplitText({ text, tail = 0 }: { text: string; tail?: number }) {
  if (tail <= 0) return <>{text}</>;
  const words = text.split(" ");
  const head = words.slice(0, -tail).join(" ");
  const end = words.slice(-tail).join(" ");
  return (
    <>
      {head}{" "}
      <span className="text-dim">{end}</span>
    </>
  );
}
