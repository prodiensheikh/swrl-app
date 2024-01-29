import { useCallback, useEffect, useRef, useState } from "react";
import TaskCard from "./components/task/taskCard"
import { Task } from "./types/task"
import InfiniteScroll from 'react-infinite-scroll-component';
import TaskCardSkeleton from "./components/task/taskCardSkeleton";
import AddTaskInput from "./components/addTaskInput";
import TimePickerDialog from "./components/timePicker/timePickerDialog";
import DatePickerDialog from "./components/datePicker/datePickerDialog";
import { User } from "./types/user";
import Auth from "./components/auth";
import { getSelf } from "./api/auth";
import Sidebar from "./components/sidebar";
import { deleteTask, getPrevTasks, getTasks, updateTask } from "./api/task";
import { HiOutlineLogout } from "react-icons/hi";

export default function App() {
  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<User>()

  const [viewingPrevTasks, setViewingPrevTasks] = useState<boolean>(false)

  const [tasks, setTasks] = useState<Task[]>([])
  const [prevTasks, setPrevTasks] = useState<Task[]>([])

  const [endReached, setEndReached] = useState<boolean>(false)
  const [startReached, setStartReached] = useState<boolean>(false)
  const scrollableTargetRef = useRef<HTMLDivElement>(null)

  const [currentlyEditingTask, setCurrentlyEditingTask] = useState<Task>()
  const [timePickerOpen, setTimePickerOpen] = useState<boolean>(false)
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false)

  const [allowEditTask, setAllowEditTask] = useState<boolean>(true)

  const handleGetTasks = useCallback(async (lastTask?: Task) => {
    try {
      const lastTaskDate = lastTask?.time?.toISOString()

      const response = await getTasks(lastTaskDate)
      console.log(response.data.reminders)

      const tasks = response.data.reminders.map((task: Task) => ({
        ...task,
        time: new Date(task.time),
      }))

      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (!lastTask) {
        setTasks(tasks)
        return
      }
      setTasks((prevTasks) => [...prevTasks, ...tasks])
      if (tasks.length < 15) {
        setEndReached(true)
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  const handleGetPrevTasks = useCallback(async (lastTask?: Task) => {
    try {
      const lastTaskDate = lastTask?.time?.toISOString()
      const response = await getPrevTasks(lastTaskDate)

      const tasks = response.data.reminders.map((task: Task) => ({
        ...task,
        time: new Date(task.time),
        status: task.status === "completed" ? "completed" : "errored",
      }))

      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (!lastTask) {
        setPrevTasks(tasks)
        return
      }
      setPrevTasks((prevTasks) => [...prevTasks, ...tasks])

      if (tasks.length < 15) {
        setStartReached(true)
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  const handleEditTaskClick = useCallback(async () => {
    if (!currentlyEditingTask) {
      return
    }

    try {
      await updateTask(currentlyEditingTask._id, {
        message: currentlyEditingTask.message,
        time: currentlyEditingTask.time.toISOString(),
      })

      setTasks((prevTasks) => {
        return prevTasks.map((task) => {
          if (task._id !== currentlyEditingTask._id) {
            return task
          }

          return currentlyEditingTask
        })
      })
      setCurrentlyEditingTask(undefined)
    } catch (error) {
      console.log(error)
    }
  }, [currentlyEditingTask])

  const handleDeleteTaskClick = useCallback(async (taskId: string) => {
    try {
      await deleteTask(taskId)

      setTasks((prevTasks) => {
        return prevTasks.filter((task) => task._id !== taskId)
      })
    } catch (error) {
      console.log(error)
    }
  }, [])

  const handleDeletePrevTaskClick = useCallback(async (taskId: string) => {
    try {
      await deleteTask(taskId)

      setPrevTasks((prevTasks) => {
        return prevTasks.filter((task) => task._id !== taskId)
      })
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    if (!currentlyEditingTask) {
      setAllowEditTask(false)
      return
    }

    const now = new Date()
    // add 3 minutes as a buffer
    now.setMinutes(now.getMinutes() + 3)

    if (currentlyEditingTask.time < now || currentlyEditingTask.message === "") {
      setAllowEditTask(false)
      return
    }

    setAllowEditTask(true)
  }, [currentlyEditingTask])

  const init = useCallback(async () => {
    try {
      const jwt = localStorage.getItem("SWRL_USER_TOKEN")
      if (!jwt) {
        setLoading(false)
        return
      }

      const response = await getSelf()
      setUser(response.data.user)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    init()
  }, [init])

  useEffect(() => {
    if (!user) return
    handleGetTasks()
    handleGetPrevTasks()
  }, [user, handleGetTasks, handleGetPrevTasks])

  if (loading) {
    return <div className="h-full w-full flex min-h-screen bg-gray-800 text-gray-200 px-2" />
  }

  if (!user) {
    return (
      <div className="h-full w-full flex min-h-screen bg-gray-800 text-gray-200 px-2 items-center">
        <Auth
          setUser={setUser}
        />
      </div>
    )
  }

  const logout = () => {
    setUser(undefined)
    localStorage.removeItem('SWRL_USER_TOKEN')
  }

  return (
    <div className="h-full w-full flex min-h-screen bg-gray-800 text-gray-200">
      <Sidebar user={user} setUser={setUser} />

      <div className="flex-1 flex flex-col max-w-[600px] mx-auto max-h-screen">

        <div className="flex justify-center items-center md:hidden py-8 px-4 border-b border-gray-700 bg-black/10">
          <img src="/logo.svg" alt="SWRL Logo" className="w-32" />
          <div className="text flex items-center cursor-pointer ml-auto" onClick={logout}>
            <HiOutlineLogout className="ml-2 h-5 w-5" />
          </div>
        </div>

        <AddTaskInput
          setTasks={setTasks}
          scrollToTop={() => {
            if (!scrollableTargetRef.current) return

            scrollableTargetRef.current?.scrollTo({
              top: 0,
              behavior: 'smooth'
            })
          }}
          viewingPrevTasks={viewingPrevTasks}
          onPrevTasksClick={() => setViewingPrevTasks((prev) => !prev)}
        />

        <div className="flex flex-1 items-center overflow-clip task-container">
          <div
            ref={scrollableTargetRef}
            id="scrollableDiv"
            className="flex flex-1 flex-col-reverse max-w-[600px] overflow-auto no-scrollbar transition-transform duration-300 task-container-col"
            style={{
              transform: viewingPrevTasks ? 'translateX(-100%)' : 'translateX(0)',
            }}
          >
            <div className="spacer" />
            <InfiniteScroll
              dataLength={tasks.length}
              next={() => handleGetTasks(tasks[tasks.length - 1])}
              hasMore={!endReached}
              loader={tasks.length ? <TaskCardSkeleton /> : null}
              inverse={true}
              style={{ display: 'flex', flexDirection: 'column-reverse' }}
              scrollableTarget={"scrollableDiv"}
              initialScrollY={200}
            >
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  setCurrentlyEditingTask={setCurrentlyEditingTask}
                  currentlyEditingTask={currentlyEditingTask}

                  setTimePickerOpen={setTimePickerOpen}
                  setDatePickerOpen={setDatePickerOpen}

                  allowEditTask={allowEditTask}
                  onEditTaskClick={handleEditTaskClick}
                  onDeleteTaskClick={handleDeleteTaskClick}
                />
              ))}
            </InfiniteScroll>
          </div>

          <div
            id="scrollableDivPrev"
            className="flex flex-1 flex-col max-w-[600px] overflow-auto no-scrollbar transition-transform duration-300 task-container-col"
            style={{
              transform: viewingPrevTasks ? 'translateX(calc(-100% + 16px))' : 'translateX(16px)',
              marginLeft: '-16px'
            }}
          >
            <InfiniteScroll
              dataLength={prevTasks.length}
              next={() => handleGetPrevTasks(prevTasks[prevTasks.length - 1])}
              endMessage={<div className="text-center text-gray-400 text-xs py-8">End Reached</div>}
              hasMore={!startReached}
              loader={<TaskCardSkeleton mt={28} />}
              scrollableTarget={"scrollableDivPrev"}
              initialScrollY={200}
            >
              {prevTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  setCurrentlyEditingTask={() => { }}
                  currentlyEditingTask={currentlyEditingTask}

                  setTimePickerOpen={setTimePickerOpen}
                  setDatePickerOpen={setDatePickerOpen}

                  allowEditTask={allowEditTask}
                  onEditTaskClick={handleEditTaskClick}
                  onDeleteTaskClick={handleDeletePrevTaskClick}
                />
              ))}
            </InfiniteScroll>

            <div className="spacer" />
          </div>
        </div>

        <TimePickerDialog
          isOpen={currentlyEditingTask !== undefined && timePickerOpen}
          onClose={(time) => {
            setCurrentlyEditingTask((prevTask) => {
              if (!prevTask) return
              return {
                ...prevTask,
                time,
              }
            })
            setTimePickerOpen(false)
          }}
          initTime={currentlyEditingTask?.time || new Date()}
        />

        <DatePickerDialog
          isOpen={currentlyEditingTask !== undefined && datePickerOpen}
          onClose={(time) => {
            setCurrentlyEditingTask((prevTask) => {
              if (!prevTask) return
              return {
                ...prevTask,
                time,
              }
            })
            setDatePickerOpen(false)
          }}
          initTime={currentlyEditingTask?.time || new Date()}
        />
      </div>
    </div>
  )
}