import type { Url } from "@/types"

import CopyIcon from "./icons/CopyIcon"
import EyeIcon from "./icons/EyeIcon"
import "./UrlsList.css"

type UrlsListProps = {
  urls: Url[]
}

export default function UrlsList({ urls }: UrlsListProps) {
  const handleCopy = (url: string) => {
    void navigator.clipboard.writeText(url)
  }

  return (
    <div className="urls-list">
      <div className="list-header">
        <h3>Your Recent URLs</h3>
        <p className="url-count">{urls.length} links</p>
      </div>
      <div className="list-container">
        {urls.length === 0 ? (
          <p className="no-urls">No URLs shortened yet. Try creating one!</p>
        ) : (
          <ul>
            {urls.map((url) => (
              <li key={url.id}>
                <div className="url-info">
                  <div className="short-url">
                    <a href={url.shortUrl} target="_blank" rel="noreferrer">
                      {url.shortUrl}
                    </a>
                    <button type="button" onClick={() => handleCopy(url.shortUrl)} className="copy-btn" title="Copy to clipboard">
                      <CopyIcon size={16} />
                    </button>
                  </div>
                  <p className="original-url">{url.originalUrl.slice(8)}</p>
                </div>
                <div className="stats">
                  <div className="clicks">
                    <EyeIcon size={16} />
                    <p>{url.clicks} views</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
