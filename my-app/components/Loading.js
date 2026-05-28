import "@/styles/loading.css"

export default function Loading({ size = "md", fullscreen = false }) {
  if (fullscreen) {
    return (
      <div className="loading-fullscreen">
        <div className={`loading-spinner loading-${size}`} />
      </div>
    )
  }

  return <div className={`loading-spinner loading-${size}`} />
}
