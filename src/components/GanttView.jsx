import { CalendarDays } from 'lucide-react';
import { daysBetween } from '../utils/format';
import { ASSIGNEE_COLORS, getMemberLabel } from '../data/mockData';

const RANGE_START = new Date('2026-05-17');
const RANGE_END = new Date('2026-06-07');
const DAY_MS = 86400000;
const DAY_W = 36;

function dateToOffset(dateStr) {
  const d = new Date(dateStr);
  return Math.max(0, Math.round((d - RANGE_START) / DAY_MS));
}

function buildDays() {
  const days = [];
  for (let t = RANGE_START.getTime(); t <= RANGE_END.getTime(); t += DAY_MS) {
    const d = new Date(t);
    days.push({
      key: d.toISOString().slice(0, 10),
      label: d.getDate(),
      dow: d.getDay(),
    });
  }
  return days;
}

export default function GanttView({ tasks, freelancers, today = '2026-05-23' }) {
  const days = buildDays();
  const totalDays = days.length;
  const todayOffset = dateToOffset(today);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
      <div className="flex border-b border-slate-800 bg-slate-950/80 p-3 gap-2 text-xs text-slate-400">
        <button type="button" className="px-3 py-1.5 rounded-lg bg-slate-800 text-white">Hôm nay</button>
        <button type="button" className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">Tuần</button>
        <span className="ml-auto flex items-center gap-1">
          <CalendarDays size={14} /> 17/05 — 07/06/2026
        </span>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="flex border-b border-slate-800">
            <div className="w-52 shrink-0 p-3 text-xs font-semibold text-slate-500 border-r border-slate-800">Công việc</div>
            <div className="flex flex-1">
              {days.map((d) => (
                <div
                  key={d.key}
                  className={`shrink-0 text-center text-[10px] py-2 border-r border-slate-800/50 ${d.dow === 0 || d.dow === 6 ? 'bg-slate-800/40 text-slate-500' : 'text-slate-400'}`}
                  style={{ width: DAY_W }}
                >
                  {d.label}
                </div>
              ))}
            </div>
          </div>
          {tasks.map((task) => {
            const start = dateToOffset(task.startDate || task.dueDate);
            const span = daysBetween(task.startDate || task.dueDate, task.dueDate);
            const color = ASSIGNEE_COLORS[task.assigneeId] || 'bg-slate-500';
            return (
              <div key={task.id} className="flex border-b border-slate-800/50 hover:bg-slate-800/20">
                <div className="w-52 shrink-0 p-3 border-r border-slate-800 text-sm text-slate-200 truncate">{task.title}</div>
                <div className="relative flex-1 h-12" style={{ width: totalDays * DAY_W }}>
                  {todayOffset >= 0 && todayOffset < totalDays && (
                    <div className="absolute top-0 bottom-0 w-px bg-rose-500 z-10" style={{ left: todayOffset * DAY_W + DAY_W / 2 }} />
                  )}
                  <div
                    className={`absolute top-3 h-6 rounded-md ${color} opacity-90 shadow-md flex items-center px-2 text-[10px] text-white font-medium truncate`}
                    style={{ left: start * DAY_W, width: span * DAY_W - 4 }}
                    title={`${getMemberLabel(task.assigneeId, freelancers)} · ${task.startDate} → ${task.dueDate}`}
                  >
                    {getMemberLabel(task.assigneeId, freelancers).split(' ')[0]}
                  </div>
                </div>
              </div>
            );
          })}
          {tasks.length === 0 && (
            <p className="p-8 text-center text-slate-500 text-sm">Không có công việc trong dự án này.</p>
          )}
        </div>
      </div>
    </div>
  );
}
