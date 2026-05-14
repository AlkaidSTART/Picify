import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-1 flex-col items-center justify-between bg-white px-16 py-32 sm:items-start dark:bg-black">
        <Image
          priority
          alt="Next.js logo"
          className="dark:invert"
          height={20}
          src="/next.svg"
          width={100}
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-sm text-3xl leading-10 font-semibold tracking-tight text-black dark:text-zinc-50">
            Picify engineering baseline is ready for the first real feature.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            The local harness, linting, formatting, and CI/CD foundation are in
            place. The next step is replacing this starter page with the actual
            product experience.
          </p>
          <p className="max-w-md text-sm leading-7 text-zinc-500 dark:text-zinc-400">
            Read `engineering.md`, `project-context.md`, and `docs/TDD.md`
            before starting the next implementation task.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] md:w-[184px] dark:hover:bg-[#ccc]"
            href="https://nextjs.org/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Next.js Docs
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] md:w-[184px] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            href="https://vercel.com/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Vercel Docs
          </a>
        </div>
      </main>
    </div>
  );
}
