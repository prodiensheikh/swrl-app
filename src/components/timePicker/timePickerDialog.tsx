import { Dialog } from "@headlessui/react"
import TimePicker from "."
import { useEffect, useState } from "react"

export default function TimePickerDialog({
  isOpen,
  onClose,
  initTime,
}: {
  isOpen: boolean,
  onClose: (time: Date) => void,
  initTime: Date,
}) {
  const [time, setTime] = useState<Date>()

  useEffect(() => {
    setTime(initTime)
  }, [initTime])

  if (!time) return null
  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        if (!time) return
        onClose(time)
      }}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded">
          <TimePicker
            time={time}
            setTime={setTime}
          />
        </Dialog.Panel>
      </div>
    </Dialog >
  )
}