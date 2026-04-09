import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import IconPencil from '~icons/tabler/pencil'

const WritingButton = () => {
  const navigate = useNavigate()

  const toWriting = useCallback(() => {
    navigate('/writing')
  }, [navigate])

  return (
    <button
      type="button"
      onClick={toWriting}
      className={`flex items-center justify-center rounded p-[2px] text-lg text-indigo-500 outline-none transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white`}
      title="Hanzi Writing Practice"
    >
      <IconPencil className="icon" />
    </button>
  )
}

export default WritingButton
