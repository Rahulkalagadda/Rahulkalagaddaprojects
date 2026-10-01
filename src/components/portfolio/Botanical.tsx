export function LeafMark({ className = "" }: { className?: string }) {
  return <svg className={className} width="28" height="30" viewBox="0 0 28 30" fill="none" aria-hidden="true"><path d="M22.5 3C9 3 3.7 9.2 5.7 18.4c6.9 5.2 16.9 1.1 16.8-15.4Z" fill="currentColor" fillOpacity=".13" stroke="currentColor" strokeWidth="1.1" /><path d="M3 27 18 9M9 20l-.8-6.4M13.4 14.8l5.9-.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>;
}

export function BotanicalBranch({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 300 360" fill="none" aria-hidden="true"><path d="M56 346C153 270 162 141 210 21" stroke="currentColor" strokeWidth="1.2" />{[0, 1, 2, 3, 4, 5, 6].map(i => <g key={i} transform={`translate(${78 + i * 18} ${298 - i * 38}) rotate(${-23 + i * 3})`}><path d="M0 0C-61-13-80-43-75-68-36-58-9-28 0 0Z" fill="currentColor" fillOpacity=".035" stroke="currentColor" strokeWidth=".8" /><path d="M0 0C53-8 78-29 82-55 44-47 14-23 0 0Z" fill="currentColor" fillOpacity=".05" stroke="currentColor" strokeWidth=".8" /><path d="m0 0-60-49M0 0l67-41" stroke="currentColor" strokeWidth=".65" /></g>)}</svg>;
}
