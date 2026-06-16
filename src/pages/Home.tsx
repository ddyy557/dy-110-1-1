import ChristmasTreeScene from '@/components/ChristmasTreeScene'
import ControlPanel from '@/components/ControlPanel'

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ background: '#0a0a1a' }}>
      <ChristmasTreeScene />
      <ControlPanel />
      <div
        className="fixed top-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
      >
        <h1
          className="text-2xl tracking-[0.3em] font-light text-center"
          style={{
            fontFamily: '"Playfair Display", serif',
            color: 'rgba(255, 215, 0, 0.5)',
            textShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
          }}
        >
          MERRY CHRISTMAS
        </h1>
      </div>
    </div>
  )
}
