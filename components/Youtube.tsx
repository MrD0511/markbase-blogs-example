
type YoutubeProps = {
    videoId: string
}

export default function Youtube(
    { videoId }: YoutubeProps
){
    if (!videoId) {
        return null
    }

    return (
        <div className="my-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
            </div>
        </div>
    )
}