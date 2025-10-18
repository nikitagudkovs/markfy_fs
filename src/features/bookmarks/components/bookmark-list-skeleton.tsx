export function BookmarkListSkeleton() {
  return (
    <div className="space-y-6 mt-6">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="card animate-pulse" style={{ padding: '1.75rem' }}>
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="h-6 rounded-lg mb-3" style={{ backgroundColor: 'var(--secondary)', width: '75%' }}></div>
              <div className="h-4 rounded-lg mb-3" style={{ backgroundColor: 'var(--secondary)', width: '50%' }}></div>
              <div className="h-4 rounded-lg mb-4" style={{ backgroundColor: 'var(--secondary)', width: '90%' }}></div>
              <div className="h-8 rounded-full" style={{ backgroundColor: 'var(--accent)', width: '140px' }}></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-11 w-11 rounded-xl" style={{ backgroundColor: 'var(--secondary)' }}></div>
              <div className="h-11 w-11 rounded-xl" style={{ backgroundColor: 'var(--secondary)' }}></div>
              <div className="h-11 w-11 rounded-xl" style={{ backgroundColor: 'var(--secondary)' }}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
