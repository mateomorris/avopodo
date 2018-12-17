export default function trackDetails(episode) {
    return {
        id: episode.id,
        url: episode.audio, 
        title: episode.title,
        artist: episode.showTitle,
        album: episode.showPublisher,
        genre: '',
        date: episode.publishDate, // RFC 3339
        artwork: episode.showImage, 
    }
}