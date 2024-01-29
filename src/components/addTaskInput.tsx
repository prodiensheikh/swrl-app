import { useCallback, useEffect, useState } from "react"
import { HiArrowLeft, HiCheck, HiX } from "react-icons/hi"
import TimePickerDialog from "./timePicker/timePickerDialog"
import DatePickerDialog from "./datePicker/datePickerDialog"
import { getFormattedDate } from "../utils/dateUtils"
import { Task } from "../types/task"
import { createTask } from "../api/task"

const actionButtonClass = "text-gray-900 text-sm font-semibold ml-auto rounded bg-gray-300 p-1 disabled:opacity-50 disabled:cursor-not-allowed"

export default function AddTaskInput({
  setTasks,
  scrollToTop,
  viewingPrevTasks,
  onPrevTasksClick,
}: {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  scrollToTop: () => void,
  viewingPrevTasks: boolean,
  onPrevTasksClick: () => void,
}) {
  const [newTaskText, setNewTaskText] = useState<string>("")

  const [newTaskMessage, setNewTaskMessage] = useState<string>()
  const [newTaskTime, setNewTaskTime] = useState<Date>()

  const [timePickerOpen, setTimePickerOpen] = useState<boolean>(false)
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false)
  const [allowAddTask, setAllowAddTask] = useState<boolean>(true)

  const formattedDate = getFormattedDate(newTaskTime || new Date())

  const handleAddTaskClick = useCallback(async () => {
    if (!newTaskMessage || !newTaskTime) {
      return
    }

    try {
      const response = await createTask({
        message: newTaskMessage,
        time: newTaskTime.toISOString(),
      })

      const newReminder = response.data.reminder
      newReminder.time = new Date(newReminder.time)

      setTasks((prevTasks) => [
        newReminder,
        ...prevTasks
      ])
      scrollToTop()
      setNewTaskText("")
    } catch (err) {
      console.error(err)
    }
  }, [newTaskMessage, newTaskTime, setTasks, scrollToTop])

  useEffect(() => {
    if (!newTaskText) {
      setNewTaskMessage(undefined)
      return
    }

    setNewTaskMessage(newTaskText)
    setNewTaskTime(new Date(Date.now() + 60 * 60 * 1000))
  }, [newTaskText])

  useEffect(() => {
    const now = new Date()
    if (!newTaskTime || newTaskTime < now) {
      setAllowAddTask(false)
      return
    }

    setAllowAddTask(true)
  }, [newTaskTime])

  if (viewingPrevTasks) {
    return (
      <>
        <div className="bg-gray-800 pt-6 pb-2 items-center hidden md:flex">
          <HiArrowLeft className="text-gray-200 text-xl mr-4 ml-2 cursor-pointer" onClick={() => onPrevTasksClick()} />
          <div className="right-0 top-8 flex items-center text-xl py-2">
            Previous Tasks
          </div>
        </div>

        <div className="flex bg-gray-800 pt-6 pb-2 items-center md:hidden mt-4 md:mt-0 px-2">
          <HiArrowLeft className="text-gray-200 text-xl mr-4 ml-2 cursor-pointer" onClick={() => onPrevTasksClick()} />
          <div className="right-0 top-8 flex items-center text-xl py-2">
            Previous Tasks
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="flex bg-gray-800 pt-6 pb-2 relative mx-4 md:mx-0 mt-4 md:mt-0">
      <input
        className="border-b-2 border-gray-500 bg-gray-800 text-gray-200 w-full px-4 py-2 focus:outline-none text-xl hidden md:block"
        placeholder="Add a task..."
        value={newTaskText}
        onChange={(e) => setNewTaskText(e.target.value)}
      />

      <input
        className="border-b-2 border-gray-500 bg-gray-800 text-gray-200 w-full px-2 py-2 focus:outline-none text-xl md:hidden"
        style={{
          paddingRight: newTaskText ? 188 : 8,
        }}
        placeholder="Add a task..."
        value={newTaskText}
        onChange={(e) => setNewTaskText(e.target.value)}
      />

      {!newTaskText && (
        <>
          <div className="absolute right-0 top-8 hidden md:block">
            <button className={`${actionButtonClass} text-xs`} onClick={onPrevTasksClick}>
              View Previous Tasks
            </button>
          </div>
          <div className="absolute right-0 top-8 md:hidden">
            <button className={`${actionButtonClass} text-xs`} onClick={onPrevTasksClick}>
              Prev Tasks
            </button>
          </div>
        </>
      )}

      {newTaskText && newTaskTime && (
        <div className="absolute right-0 top-8 gap-2 flex">
          <button className={actionButtonClass} onClick={() => setNewTaskText("")}>
            <HiX className="mt-px" />
          </button>

          <button className={actionButtonClass} onClick={() => setTimePickerOpen(true)}>
            {newTaskTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </button>

          <button className={actionButtonClass} onClick={() => setDatePickerOpen(true)}>
            {formattedDate}
          </button>

          <button
            className={actionButtonClass}
            disabled={!allowAddTask}
            onClick={handleAddTaskClick}
          >
            <HiCheck className="mt-px" />
          </button>
        </div>
      )}

      <TimePickerDialog
        isOpen={timePickerOpen}
        onClose={(time) => {
          setNewTaskTime(time)
          setTimePickerOpen(false)
        }}
        initTime={newTaskTime || new Date()}
      />

      <DatePickerDialog
        isOpen={datePickerOpen}
        onClose={(date) => {
          setNewTaskTime(date)
          setDatePickerOpen(false)
        }}
        initTime={newTaskTime || new Date()}
      />
    </div>
  )
}