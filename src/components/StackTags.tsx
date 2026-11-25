// Tech-stack pills, driven by the `stack` array field on a Sanity project.
export function StackTags({ stack }: { stack: string[] | null }) {
  if (!stack?.length) return null;

  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
      {stack.map((tech) => (
        <li
          key={tech}
          className="rounded border border-blue-200/30 bg-blue-200/10 px-2 py-0.5 font-mono text-xs text-blue-200"
        >
          {tech}
        </li>
      ))}
    </ul>
  );
}
