import { useLoaderData, useRouter } from "@tanstack/react-router"

import { UrlIcon } from "@/components/icons"
import UrlForm from "@/components/UrlForm"
import UrlsList from "@/components/UrlsList"
import type { Url } from "@/types"

export default function HomeView() {
  const urls = useLoaderData({ from: "/" }) as Url[]
  const router = useRouter()

  const handleUrlSubmit = () => {
    router.invalidate()
  }

  return (
    <main className="relative isolate overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-16 top-0 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl animate-[float_6s_ease-in-out_infinite]" />
        <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-fuchsia-500/12 blur-3xl animate-[float_8s_ease-in_out_infinite]" />
      </div>
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[26px] border border-white/20 bg-white/12 shadow-2xl shadow-slate-950/25 backdrop-blur-xl">
            <UrlIcon className="h-9 w-9 text-sky-200" />
          </div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.34em] text-sky-100/70">Link Console</p>
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Shorten, track, and ship links without the clutter.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-sky-100/75 sm:text-lg">
            Turn long destinations into clean, shareable URLs and keep the latest traffic snapshots in one place.
          </p>
        </div>
        <UrlForm onSubmit={handleUrlSubmit} />
        <UrlsList urls={urls} />
      </div>
    </main>
  )
}
