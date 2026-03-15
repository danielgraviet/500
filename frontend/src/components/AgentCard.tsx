import { useState } from 'react'
import { AgentCardData } from '../types'

interface Props {
  card: AgentCardData
}

export default function AgentCard({ card }: Props) {
  const [open, setOpen] = useState(false)
  const { state, role, result } = card
  const clickable = state === 'passed' || state === 'failed'

  if (state === 'idle') {
    return <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4 h-32 animate-pulse" />
  }

  if (state === 'booting') {
    return (
      <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4 h-32 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-xs font-medium text-gray-400">{role ?? 'Agent'}</span>
        </div>
        <p className="text-xs text-gray-600">booting sandbox…</p>
      </div>
    )
  }

  const passed = state === 'passed'

  return (
    <>
      <button
        onClick={() => clickable && setOpen(true)}
        className={`w-full text-left rounded-xl border p-4 h-32 flex flex-col justify-between transition-colors ${
          passed
            ? 'border-green-500/30 bg-green-500/5 hover:bg-green-500/10'
            : 'border-red-500/30 bg-red-500/5 hover:bg-red-500/10'
        } ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${passed ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className="text-xs font-medium text-gray-300">{role ?? 'Agent'}</span>
          {clickable && (
            <span className="ml-auto text-[10px] text-gray-600">view query →</span>
          )}
        </div>

        {passed && result ? (
          <div className="flex gap-4 text-xs text-gray-400">
            <span>score <span className="text-gray-200 font-medium">{result.score.toFixed(1)}</span></span>
            {result.latency_ms != null && (
              <span>latency <span className="text-gray-200 font-medium">{result.latency_ms.toFixed(1)}ms</span></span>
            )}
            {result.rows_returned != null && (
              <span>rows <span className="text-gray-200 font-medium">{result.rows_returned}</span></span>
            )}
          </div>
        ) : (
          <p className="text-xs text-red-400 truncate">
            {result?.error?.replace('FAILED_', '') ?? 'failed'}
          </p>
        )}
      </button>

      {open && result && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl rounded-xl border border-[#2a2a2a] bg-[#111] p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${passed ? 'bg-green-400' : 'bg-red-400'}`} />
              <h2 className="text-sm font-semibold text-gray-200">{role ?? 'Agent'}</h2>
              <button
                onClick={() => setOpen(false)}
                className="ml-auto text-gray-600 hover:text-gray-300 text-lg leading-none"
              >
                ×
              </button>
            </div>

            {passed && (
              <div className="flex gap-4 text-xs text-gray-400 mb-4">
                <span>score <span className="text-gray-200 font-medium">{result.score.toFixed(1)}</span></span>
                {result.latency_ms != null && (
                  <span>latency <span className="text-gray-200 font-medium">{result.latency_ms.toFixed(1)}ms</span></span>
                )}
                {result.rows_returned != null && (
                  <span>rows <span className="text-gray-200 font-medium">{result.rows_returned}</span></span>
                )}
                {result.explain_cost != null && (
                  <span>cost <span className="text-gray-200 font-medium">{result.explain_cost.toLocaleString()}</span></span>
                )}
              </div>
            )}

            {!passed && result.error && (
              <p className="text-xs text-red-400 mb-4">{result.error.replace('FAILED_', '')}</p>
            )}

            {result.sql ? (
              <>
                <p className="text-xs text-gray-500 mb-2">Generated SQL</p>
                <pre className="text-xs text-gray-300 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-4 overflow-x-auto whitespace-pre-wrap">
                  {result.sql}
                </pre>
              </>
            ) : (
              <p className="text-xs text-gray-600 italic">No SQL available</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
