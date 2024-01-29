import { HiCheck, HiPencil, HiTrash, HiX } from "react-icons/hi"
import { Task } from "../../types/task"
import { getFormattedDate } from "../../utils/dateUtils"

export default function TaskCard({
  task,
  currentlyEditingTask,
  setCurrentlyEditingTask,
  setTimePickerOpen,
  setDatePickerOpen,
  allowEditTask,
  onEditTaskClick,
  onDeleteTaskClick,
}: {
  task: Task
  currentlyEditingTask?: Task
  setCurrentlyEditingTask: React.Dispatch<React.SetStateAction<Task | undefined>>
  setTimePickerOpen: React.Dispatch<React.SetStateAction<boolean>>
  setDatePickerOpen: React.Dispatch<React.SetStateAction<boolean>>
  allowEditTask: boolean
  onEditTaskClick: () => void
  onDeleteTaskClick: (taskId: string) => void
}) {
  const time = task.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
  const paddedTime = time.padStart(8, "0")
  const formattedDate = getFormattedDate(task.time)

  const currentlyEditingTime = currentlyEditingTask?.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
  const currentlyEditingPaddedTime = currentlyEditingTime?.padStart(8, "0")
  const currentlyEditingFormattedDate = getFormattedDate(currentlyEditingTask?.time || new Date())

  const isCurrentlyEditing = currentlyEditingTask?._id === task._id

  return (
    <div className="flex flex-col mt-2 mx-4 md:mx-0">

      <div className="flex items-center">
        <div className="text-gray-200 p-1 text-sm font-semibold cursor-pointer"
          onClick={() => {
            if (!isCurrentlyEditing) {
              return
            }
            setTimePickerOpen(true)
          }}
        >
          {isCurrentlyEditing ? currentlyEditingPaddedTime : paddedTime}
        </div>

        <div className="text-gray-200 p-1 text-sm font-semibold cursor-pointer"
          onClick={() => {
            if (!isCurrentlyEditing) {
              return
            }
            setDatePickerOpen(true)
          }}
        >
          {isCurrentlyEditing ? currentlyEditingFormattedDate : formattedDate}
        </div>

        {currentlyEditingTask?._id !== task._id && (
          <div
            className="text-gray-200 text-xs font-semibold ml-auto rounded-full bg-gray-900 pl-2 pr-3 py-1 cursor-pointer"
            onClick={() => setCurrentlyEditingTask({ ...task })}
          >

            {task.status === "errored" ? (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full inline-block mr-1"></div>
                Errored
              </>
            ) : task.status === "scheduled" ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full inline-block mr-1"></div>
                Scheduled
                <HiPencil className="inline-block ml-1 mb-1" />
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-gray-500 rounded-full inline-block mr-1"></div>
                Sent
              </>
            )}

          </div>
        )}

        {currentlyEditingTask?._id !== task._id && (
          <HiTrash
            className="text-gray-500 text-xl ml-2 hover:text-red-500"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this task?")) {
                onDeleteTaskClick(task._id)
              }
            }}
          />
        )}

        {currentlyEditingTask?._id === task._id && (
          <>
            <HiX
              className="text-gray-500 text-xl ml-auto hover:text-red-500"
              onClick={() => setCurrentlyEditingTask(undefined)}
            />
            <button
              disabled={!allowEditTask}
              className="text-gray-500 text-xl ml-2 hover:text-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                if (!allowEditTask) {
                  return
                }

                onEditTaskClick()
              }}
            >
              <HiCheck />
            </button>
          </>
        )}

      </div>
      <div className="flex bg-gray-700 text-gray-200 rounded-lg shadow-md p-3 mt-1">
        <h3
          className="flex-1"
          contentEditable={currentlyEditingTask?._id === task._id}
          suppressContentEditableWarning={true}
          onBlur={(e) => {
            setCurrentlyEditingTask((prevTask) => {
              if (!prevTask) return
              return {
                ...prevTask,
                message: e.target.textContent || "",
              }
            })
          }}
        >
          {task.message}
        </h3>
      </div>
    </div>
  )
}