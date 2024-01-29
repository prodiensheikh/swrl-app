import React, { useCallback } from "react"
import { days, months } from "../../utils/dateUtils"
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"

const getSplitDate = (time: Date) => {
  const year = time.getFullYear()
  const month = time.getMonth()
  return { year, month }
}

export default function DatePicker({
  time,
  setTime,
  height = 320,
  width = 320,
}: {
  time: Date,
  setTime: React.Dispatch<React.SetStateAction<Date | undefined>>,
  height?: number,
  width?: number,
}) {
  const { year, month } = getSplitDate(time)

  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()

  const setYear = useCallback((year: number) => {
    setTime(prev => {
      const date = prev ? new Date(prev) : new Date()
      date.setFullYear(year)
      return date
    })
  }, [setTime])

  const setMonth = useCallback((month: number) => {
    setTime(prev => {
      const date = prev ? new Date(prev) : new Date()
      date.setMonth(month)
      return date
    })
  }, [setTime])

  const setDate = useCallback((date: number) => {
    setTime(prev => {
      const dateObj = prev ? new Date(prev) : new Date()
      dateObj.setDate(date)
      return dateObj
    })
  }, [setTime])

  const handleSetYear = useCallback((action: "ArrowUp" | "ArrowDown") => {
    if (action === "ArrowUp") {
      setYear(year + 1)
    } else if (action === "ArrowDown") {
      setYear(year - 1)
    }
  }, [year, setYear])

  const handleSetMonth = useCallback((action: "ArrowUp" | "ArrowDown") => {
    if (action === "ArrowUp" && month < 11) {
      setMonth(month + 1)
    } else if (action === "ArrowUp" && month === 11) {
      setMonth(0)
      handleSetYear("ArrowUp")
    } else if (action === "ArrowDown" && month > 0) {
      setMonth(month - 1)
    } else if (action === "ArrowDown" && month === 0) {
      setMonth(11)
      handleSetYear("ArrowDown")
    }
  }, [month, setMonth, handleSetYear])

  return (
    <div className="rounded aspect-square flex flex-col relative bg-slate-800 p-2"
      style={{
        height,
        width,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => handleSetMonth("ArrowDown")}
          className="aspect-square rounded bg-slate-700 hover:bg-slate-700 text-white"
        >
          <HiChevronLeft className="h-8 w-8" />
        </button>
        <h1 className="text-xl font-semibold text-white">
          {months[month]} {year}
        </h1>
        <button
          onClick={() => handleSetMonth("ArrowUp")}
          className="aspect-square rounded bg-slate-700 hover:bg-slate-700 text-white"
        >
          <HiChevronRight className="w-8 h-8" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 flex-1">
        {days.map((day) => (
          <div key={day} className="text-center text-sm text-gray-300">
            {day}
          </div>
        ))}

        {Array(firstDay)
          .fill(null)
          .map((_, i) => (
            <div key={i} />
          ))}

        {Array(lastDate)
          .fill(null)
          .map((_, i) => (
            <div
              key={i}
              onClick={() => {
                setDate(i + 1)
              }}
              className={`flex items-center justify-center text-center text-sm rounded cursor-pointer ${(time.getDate() === i + 1) ? "bg-slate-700 text-white" : "text-gray-300"} hover:bg-slate-700`}
            >
              {i + 1}
            </div>
          ))}
      </div>
    </div>
  )
}
