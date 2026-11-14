import { ArrowUpDown, RotateCcw, Undo2 } from 'lucide-react'
import Button from '../ui/Button'

interface Props {
  canUndo: boolean
  onUndo: () => void
  onReset: () => void
  onFlip: () => void
}

export default function BoardControls({ canUndo, onUndo, onReset, onFlip }: Props) {
  return (
    <div className="board-controls flex flex-wrap gap-2">
      <Button onClick={onUndo} disabled={!canUndo} icon={<Undo2 size={16} />}>Undo</Button>
      <Button onClick={onReset} icon={<RotateCcw size={16} />}>Reset</Button>
      <Button onClick={onFlip} icon={<ArrowUpDown size={16} />}>Flip board</Button>
    </div>
  )
}
