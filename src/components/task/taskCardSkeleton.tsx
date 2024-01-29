export default function TaskCardSkeleton({
  mt = 0,
}: {
  mt?: number,
}) {
  return (
    <div className="flex flex-col mx-4 md:mx-0"
      style={{
        marginTop: mt,
      }}
    >
      <div className="flex bg-gray-700 text-gray-200 rounded-lg shadow-md p-3 mt-1 animate-pulse">
        <h3 className="">&nbsp;</h3>
      </div>
    </div>
  )
}