const AnimalSkeleton = () => (
  <div className="card bg-base-100 shadow-xl gap-3 m-3 w-96 min-h-60">
    <div className="flex">
      <div className="skeleton w-48 h-48 min-w-48 min-h-48"></div>
      <div className="card-body p-4 flex flex-col gap-2 w-48">
        <div className="skeleton h-6 w-3/4 mb-2"></div>
        <div className="skeleton h-4 w-2/3"></div>
        <div className="skeleton h-4 w-1/2"></div>
        <div className="skeleton h-4 w-2/3"></div>
        <div className="skeleton h-4 w-1/3"></div>
        <div className="flex justify-end gap-2 mt-2">
          <div className="skeleton h-8 w-8 rounded-full"></div>
          <div className="skeleton h-8 w-16"></div>
        </div>
      </div>
    </div>
  </div>
);

export default AnimalSkeleton;
