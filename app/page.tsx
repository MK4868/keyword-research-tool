import KeywordResearchTool from "@/components/keyword-research-tool"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4">
            KeywordFinder<span className="text-blue-500">Pro</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Discover high-performing keywords for your small business with our intuitive research tool.
          </p>
        </header>

        <KeywordResearchTool />

        <footer className="mt-20 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} KeywordFinderPro. All rights reserved.</p>
        </footer>
      </div>
    </main>
  )
}

