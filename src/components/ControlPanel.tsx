import { Snowflake, Gauge, Flame } from 'lucide-react'
import { useStore } from '@/store/useStore'

export default function ControlPanel() {
  const snowEnabled = useStore((s) => s.snowEnabled)
  const rotationSpeed = useStore((s) => s.rotationSpeed)
  const toggleSnow = useStore((s) => s.toggleSnow)
  const setRotationSpeed = useStore((s) => s.setRotationSpeed)
  const triggerFirework = useStore((s) => s.triggerFirework)

  return (
    <div className="fixed bottom-6 left-6 z-10 flex flex-col gap-3">
      <div
        className="backdrop-blur-xl rounded-2xl p-5 flex flex-col gap-4 min-w-[220px]"
        style={{
          background: 'rgba(10, 10, 30, 0.7)',
          border: '1px solid rgba(255, 215, 0, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 215, 0, 0.1)',
        }}
      >
        <h3
          className="text-sm font-semibold tracking-widest uppercase text-center"
          style={{ color: 'rgba(255, 215, 0, 0.8)', fontFamily: '"DM Sans", sans-serif' }}
        >
          ✦ 控制面板 ✦
        </h3>

        <button
          onClick={toggleSnow}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 cursor-pointer"
          style={{
            background: snowEnabled
              ? 'rgba(255, 255, 255, 0.12)'
              : 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${snowEnabled ? 'rgba(136, 204, 255, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
            color: snowEnabled ? '#88ccff' : 'rgba(255, 255, 255, 0.4)',
          }}
        >
          <Snowflake size={16} />
          <span className="text-sm" style={{ fontFamily: '"DM Sans", sans-serif' }}>
            {snowEnabled ? '飘雪 · 开' : '飘雪 · 关'}
          </span>
        </button>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2" style={{ color: 'rgba(255, 215, 0, 0.6)' }}>
            <Gauge size={14} />
            <span className="text-xs tracking-wide" style={{ fontFamily: '"DM Sans", sans-serif' }}>
              旋转速度
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={rotationSpeed}
            onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, rgba(255, 215, 0, 0.6) ${rotationSpeed * 100}%, rgba(255, 255, 255, 0.1) ${rotationSpeed * 100}%)`,
            }}
          />
        </div>

        <button
          onClick={triggerFirework}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 cursor-pointer"
          style={{
            background: 'rgba(255, 100, 50, 0.15)',
            border: '1px solid rgba(255, 150, 80, 0.3)',
            color: '#ff9955',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 100, 50, 0.3)'
            e.currentTarget.style.transform = 'scale(1.03)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 100, 50, 0.15)'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <Flame size={16} />
          <span className="text-sm" style={{ fontFamily: '"DM Sans", sans-serif' }}>
            放烟花
          </span>
        </button>
      </div>

      <p
        className="text-xs text-center"
        style={{ color: 'rgba(255, 255, 255, 0.25)', fontFamily: '"DM Sans", sans-serif' }}
      >
        点击画面也可放烟花 ✨
      </p>
    </div>
  )
}
