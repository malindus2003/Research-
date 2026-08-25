import React from 'react';
import { Sparkles, AlertTriangle, ShieldAlert, CheckCircle2, ChevronRight, XCircle, ArrowRight } from 'lucide-react';

export default function ActionRecommendations({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          border: 'border-rose-500/40',
          bg: 'bg-rose-500/10',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          icon: <XCircle className="h-4 w-4 text-rose-400" />
        };
      case 'high':
        return {
          border: 'border-orange-500/40',
          bg: 'bg-orange-500/10',
          badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
          icon: <ShieldAlert className="h-4 w-4 text-orange-400" />
        };
      case 'medium':
      default:
        return {
          border: 'border-amber-500/40',
          bg: 'bg-amber-500/10',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          icon: <AlertTriangle className="h-4 w-4 text-amber-400" />
        };
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Intelligent Decision Support & Action Feed</h2>
            <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> Proactive Kitchen Directives
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            AI-generated recommendations for ingredient prioritization, storage calibration, and safe disposal
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {recommendations.map((rec) => {
          const style = getSeverityStyle(rec.severity);
          return (
            <div
              key={rec.id}
              className={`p-4 rounded-xl border ${style.border} ${style.bg} flex flex-col justify-between transition-all hover:scale-[1.01]`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase flex items-center gap-1 ${style.badge}`}>
                    {style.icon} {rec.type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400">{rec.zone.split(':')[0]}</span>
                </div>

                <h3 className="text-sm font-bold text-white mt-2.5">{rec.title}</h3>
                <p className="text-xs text-slate-300 mt-1">{rec.message}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Required Action:</span>
                <p className="text-xs font-semibold text-white mt-0.5 flex items-start gap-1">
                  <ArrowRight className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  {rec.suggested_action}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
