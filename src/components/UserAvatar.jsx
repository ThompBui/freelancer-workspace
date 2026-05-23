export default function UserAvatar({ name, colorClass = 'from-indigo-500 to-purple-500', size = 'md' }) {
  const letter = (name || '?').charAt(0);
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-8 h-8 text-sm', lg: 'w-10 h-10' };
  return (
    <div className={`${sizes[size]} shrink-0 rounded-full bg-gradient-to-tr ${colorClass} flex items-center justify-center font-bold text-white border-2 border-slate-800`}>
      {letter}
    </div>
  );
}
