import { useCallback, useState } from "react"

const hourBoxHeight = 20
const hourBoxWidth = 32

const getSplitTime = (time: Date) => {
  const hours = time.getHours() % 12
  const minutes = time.getMinutes()
  const am = time.getHours() < 12
  return { hours, minutes, am }
}

export default function TimePicker({
  time,
  setTime,
  height = 300,
  width = 300,
}: {
  time: Date,
  setTime: React.Dispatch<React.SetStateAction<Date | undefined>>,
  height?: number,
  width?: number,
}) {
  const centerX = width / 2
  const centerY = height / 2
  const radius = height / 2 - hourBoxHeight / 2

  const [settingHours, setSettingHours] = useState(true)

  const { hours, minutes, am } = getSplitTime(time)
  const paddedHours = hours.toString().padStart(2, "0")
  const paddedMinutes = minutes.toString().padStart(2, "0")

  const setHours = useCallback((hour: number) => {
    setTime(prev => {
      const date = prev ? new Date(prev) : new Date()
      const { am } = getSplitTime(date)
      date.setHours(am ? hour : hour + 12)
      return date
    })
  }, [setTime])

  const setMinutes = useCallback((minute: number) => {
    setTime(prev => {
      const date = prev ? new Date(prev) : new Date()
      date.setMinutes(minute)
      return date
    })
  }, [setTime])

  const setAm = useCallback((am: boolean) => {
    setTime(prev => {
      const date = prev ? new Date(prev) : new Date()
      const { hours } = getSplitTime(date)
      date.setHours(am ? hours : hours + 12)
      return date
    })
  }, [setTime])

  const hourBoxClick = useCallback((hour: number) => {
    if (settingHours) {
      setHours(hour)
      setMinutes(0)
      setSettingHours(false)
      return
    }

    if (hour === 12) {
      setMinutes(0)
    } else {
      setMinutes(hour * 5)
    }
    setSettingHours(true)
  }, [settingHours, setHours, setMinutes])

  const handleChangeHours = useCallback((action: "ArrowUp" | "ArrowDown") => {
    if (action === "ArrowUp" && hours < 12) {
      setHours(hours + 1)
    } else if (action === "ArrowUp" && hours === 12) {
      setHours(1)
    } else if (action === "ArrowDown" && hours > 1) {
      setHours(hours - 1)
    } else if (action === "ArrowDown" && hours === 1) {
      setHours(12)
    }
  }, [hours, setHours])

  const handleChangeMinutes = useCallback((action: "ArrowUp" | "ArrowDown") => {
    if (action === "ArrowUp" && minutes < 59) {
      setMinutes(minutes + 1)
    } else if (action === "ArrowUp" && minutes === 59) {
      setMinutes(0)
      handleChangeHours("ArrowUp")
    } else if (action === "ArrowDown" && minutes > 0) {
      setMinutes(minutes - 1)
    } else if (action === "ArrowDown" && minutes === 0) {
      setMinutes(59)
      handleChangeHours("ArrowDown")
    }
  }, [minutes, setMinutes, handleChangeHours])

  const renderHours = () => {
    const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    return hours.map((hour) => (
      <div
        key={`hour-${hour}`}
        className="absolute font-semibold h-[20px] w-[32px] text-white text-center cursor-pointer"
        onClick={() => hourBoxClick(hour)}
        style={{
          left: centerX - hourBoxWidth / 2,
          top: centerY - hourBoxHeight / 2,
          transform: `rotate(${hour * 30}deg) translate(0, -${radius}px) rotate(-${hour * 30}deg)`,
        }}
      >
        {hour}
      </div>
    ))
  }

  return (
    <div className="rounded-full aspect-square bg-slate-700 flex items-center justify-center p-8 relative"
      style={{
        height,
        width,
      }}
    >
      <div className="bg-white rounded-full h-full w-full" />
      {renderHours()}
      <div className="absolute w-2 bg-black/90 rounded-full transition-all duration-500"
        style={{
          height: radius / 1.5 - 12,
          left: centerX - 4,
          top: centerY,
          transformOrigin: "top",
          transform: `rotate(${(hours * 30) + 180 + (minutes / 2)}deg )`,
        }} />

      {settingHours && (
        <div className="absolute w-2 bg-black/90 rounded-full transition-all duration-500"
          style={{
            height: radius - 12,
            left: centerX - 4,
            top: centerY,
            transformOrigin: "top",
            transform: `rotate(${(minutes * 6) + 180}deg )`,
          }}
        />
      )}

      <div
        className="absolute font-semibold text-white text-center cursor-pointer flex items-center justify-center bg-gray-300 p-1 gap-1"
        style={{
          top: centerY + 32,
        }}
      >
        {/* <input
          className="text-center outline-none w-8 bg-slate-700 m-0 hidden md:block"
          value={paddedHours}
          onChange={() => { }}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
              handleChangeHours(e.key)
            }
          }}
        />

        <input
          className="text-center outline-none w-8 bg-slate-700 m-0 hidden md:block"
          value={paddedMinutes}
          onChange={() => { }}
          onKeyDown={(e) => {
            // up arrow
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
              handleChangeMinutes(e.key)
            }
          }}
        /> */}

        <button
          className="text-center outline-none w-8 bg-slate-700 block"
          onClick={() => handleChangeHours("ArrowUp")}
          onContextMenu={(e) => {
            e.preventDefault()
            handleChangeHours("ArrowDown")
          }}
        >
          {paddedHours === "00" ? "12" : paddedHours}
        </button>

        <button
          className="text-center outline-none w-8 bg-slate-700 block"
          onClick={() => handleChangeMinutes("ArrowUp")}
          onContextMenu={(e) => {
            e.preventDefault()
            handleChangeMinutes("ArrowDown")
          }}
        >
          {paddedMinutes}
        </button>

        <button
          className="text-center outline-none w-8 bg-slate-700"
          onClick={() => setAm(!am)}
        >
          {am ? "AM" : "PM"}
        </button>
      </div>


    </div>
  )
}