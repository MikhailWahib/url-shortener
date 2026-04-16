import type { Url } from "@/types"

import CopyIcon from "./icons/CopyIcon"
import EyeIcon from "./icons/EyeIcon"

type UrlsListProps = {
  urls: Url[]
}

export default function UrlsList({ urls }: UrlsListProps) {
  const handleCopy = (url: string) => {
    void navigator.clipboard.writeText(url)
  }

  return (
    <section className="w-full">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white sm:text-xl">Recent URLs</h3>
          <p className="text-sm text-sky-100/70">Your latest shortened links and view counts.</p>
        </div>
        <p className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100/75">
          {urls.length} links
        </p>
      </div>
      <div className="overflow-hidden rounded-[28px] border border-white/15 bg-slate-950/35 shadow-2xl shadow-slate-950/25 backdrop-blur-xl">
        {urls.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm font-medium text-slate-300/75">
            No URLs shortened yet. Try creating one.
          </p>
        ) : (
          <ul className="max-h-[420px] divide-y divide-white/10 overflow-y-auto">
            {urls.map((url) => (
              <li
                key={url.id}
                className="flex flex-col gap-4 px-5 py-4 transition hover:bg-white/6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-3">
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate text-sm font-semibold text-sky-300 transition hover:text-sky-200 hover:underline"
                    >
                      {url.shortUrl}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy(url.shortUrl)}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-sky-100"
                      title="Copy to clipboard"
                    >
                      <CopyIcon size={16} />
                    </button>
                  </div>
                  <p className="truncate text-sm text-slate-400">{url.originalUrl.slice(8)}</p>
                </div>
                <div className="sm:ml-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200">
                    <EyeIcon size={16} />
                    <p>{url.clicks} views</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
