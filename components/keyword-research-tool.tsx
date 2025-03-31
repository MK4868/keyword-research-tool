"use client"

import type React from "react"

import { useState } from "react"
import { Search, Loader2, Info, Check, ArrowRight, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

// Types
interface Keyword {
  keyword: string
  searchVolume: number
  competition: "Low" | "Medium" | "High"
  isPrimary?: boolean
  isSecondary?: boolean
}

// Mock API call
const fetchKeywordSuggestions = (seedKeywords: string[]): Promise<Keyword[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock data
      const suggestions: Keyword[] = [
        {
          keyword: `${seedKeywords[0]} services`,
          searchVolume: 12500,
          competition: "Medium",
          isPrimary: true,
        },
        {
          keyword: `best ${seedKeywords[0]} for ${seedKeywords[1]}`,
          searchVolume: 8200,
          competition: "Low",
          isSecondary: true,
        },
        {
          keyword: `${seedKeywords[0]} ${seedKeywords[1]} guide`,
          searchVolume: 6700,
          competition: "Low",
          isSecondary: true,
        },
        {
          keyword: `affordable ${seedKeywords[0]}`,
          searchVolume: 5400,
          competition: "Medium",
        },
        {
          keyword: `${seedKeywords[0]} vs ${seedKeywords[1]}`,
          searchVolume: 4800,
          competition: "High",
        },
        {
          keyword: `${seedKeywords[1]} with ${seedKeywords[0]}`,
          searchVolume: 3900,
          competition: "Medium",
        },
        {
          keyword: `how to use ${seedKeywords[0]} for ${seedKeywords[1]}`,
          searchVolume: 3200,
          competition: "Low",
        },
        {
          keyword: `${seedKeywords[0]} tips`,
          searchVolume: 2800,
          competition: "Medium",
        },
      ]
      resolve(suggestions)
    }, 2000) // Simulate 2 second API delay
  })
}

// Main component
export default function KeywordResearchTool() {
  const [seedKeywords, setSeedKeywords] = useState<string[]>(["", ""])
  const [errors, setErrors] = useState<string[]>(["", ""])
  const [step, setStep] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [keywordResults, setKeywordResults] = useState<Keyword[]>([])

  // Validate a single keyword
  const validateKeyword = (keyword: string, index: number) => {
    if (!keyword.trim()) {
      setErrors((prev) => {
        const newErrors = [...prev]
        newErrors[index] = "Keyword is required"
        return newErrors
      })
      return false
    }

    if (keyword.trim().split(" ").length > 3) {
      setErrors((prev) => {
        const newErrors = [...prev]
        newErrors[index] = "Maximum 3 words allowed"
        return newErrors
      })
      return false
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(keyword)) {
      setErrors((prev) => {
        const newErrors = [...prev]
        newErrors[index] = "No special characters allowed"
        return newErrors
      })
      return false
    }

    setErrors((prev) => {
      const newErrors = [...prev]
      newErrors[index] = ""
      return newErrors
    })
    return true
  }

  // Handle keyword input change
  const handleKeywordChange = (value: string, index: number) => {
    const newKeywords = [...seedKeywords]
    newKeywords[index] = value
    setSeedKeywords(newKeywords)
    validateKeyword(value, index)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate both keywords
    const isValid = seedKeywords.every((keyword, index) => validateKeyword(keyword, index))

    if (isValid) {
      setIsLoading(true)
      setStep(2)

      try {
        const results = await fetchKeywordSuggestions(seedKeywords)
        setKeywordResults(results)
        setStep(3)
      } catch (error) {
        console.error("Error fetching keyword suggestions:", error)
        // Handle error state here
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Handle confirmation
  const handleConfirm = () => {
    setStep(4)
  }

  // Handle edit
  const handleEdit = () => {
    setStep(1)
  }

  // Handle restart
  const handleRestart = () => {
    setSeedKeywords(["", ""])
    setErrors(["", ""])
    setKeywordResults([])
    setStep(1)
  }

  // Get competition color
  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case "Low":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {["Seed Keywords", "Processing", "Review Results", "Confirmation"].map((label, index) => (
            <div
              key={index}
              className={`text-xs md:text-sm font-medium ${
                step > index + 1 ? "text-blue-600" : step === index + 1 ? "text-blue-500" : "text-slate-400"
              }`}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${(step - 1) * 33.33}%` }}
          ></div>
        </div>
      </div>

      <Card className="border-slate-200 shadow-md">
        <CardContent className="p-6">
          {/* Step 1: Seed Keywords Input */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-2">Enter Your Seed Keywords</h2>
                <p className="text-slate-600">
                  Provide up to 2 keywords related to your business to discover high-performing keyword opportunities.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {seedKeywords.map((keyword, index) => (
                  <div key={index} className="space-y-2">
                    <label htmlFor={`keyword-${index}`} className="block text-sm font-medium text-slate-700">
                      Seed Keyword {index + 1}
                    </label>
                    <Input
                      id={`keyword-${index}`}
                      value={keyword}
                      onChange={(e) => handleKeywordChange(e.target.value, index)}
                      placeholder={`Enter seed keyword ${index + 1}`}
                      className={`w-full ${errors[index] ? "border-red-300 focus:ring-red-500" : ""}`}
                    />
                    {errors[index] && <p className="text-red-500 text-xs mt-1">{errors[index]}</p>}
                  </div>
                ))}

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={seedKeywords.some((k) => !k.trim()) || errors.some((e) => e !== "")}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Find Keywords
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: Loading */}
          {step === 2 && (
            <div className="py-12 text-center">
              <div className="flex justify-center mb-4">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Finding high-performing keyword matches...</h2>
              <p className="text-slate-600">
                We're analyzing search trends and competition levels to find the best keywords for your business.
              </p>
            </div>
          )}

          {/* Step 3: Results */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-2">Keyword Suggestions</h2>
                <p className="text-slate-600">
                  Based on your seed keywords: <span className="font-medium">{seedKeywords.join(", ")}</span>
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Keyword</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                        <div className="flex items-center">
                          Search Volume
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="ml-1 h-4 w-4 text-slate-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-48 text-xs">Estimated monthly searches for this keyword</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                        <div className="flex items-center">
                          Competition
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="ml-1 h-4 w-4 text-slate-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-48 text-xs">How difficult it is to rank for this keyword</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywordResults.map((result, index) => (
                      <tr
                        key={index}
                        className={`border-t border-slate-200 ${
                          result.isPrimary ? "bg-blue-50" : result.isSecondary ? "bg-slate-50" : ""
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span className="font-medium text-slate-800">{result.keyword}</span>
                            {result.isPrimary && <Badge className="ml-2 bg-blue-500">Primary</Badge>}
                            {result.isSecondary && (
                              <Badge variant="outline" className="ml-2 border-blue-300 text-blue-600">
                                Secondary
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{result.searchVolume.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getCompetitionColor(result.competition)}`}
                          >
                            {result.competition}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-6 text-center">
                <h3 className="text-lg font-medium text-slate-800 mb-3">Ready to proceed with these keywords?</h3>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Button onClick={handleConfirm} className="flex-1 sm:flex-none">
                    <Check className="mr-2 h-4 w-4" />
                    Yes, Proceed
                  </Button>
                  <Button variant="outline" onClick={handleEdit} className="flex-1 sm:flex-none">
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit Keywords
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="py-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-green-100 p-3">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Keywords Confirmed!</h2>
              <p className="text-slate-600 mb-6">
                Your selected keywords have been saved. You can now use these keywords to optimize your content.
              </p>

              <div className="bg-slate-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <h3 className="font-medium text-slate-800 mb-2">Your Selected Keywords:</h3>
                <ul className="space-y-2 text-left">
                  {keywordResults
                    .filter((k) => k.isPrimary || k.isSecondary)
                    .map((keyword, index) => (
                      <li key={index} className="flex items-start">
                        <span
                          className={`inline-block w-20 text-xs font-medium ${
                            keyword.isPrimary ? "text-blue-600" : "text-blue-500"
                          }`}
                        >
                          {keyword.isPrimary ? "PRIMARY" : "SECONDARY"}
                        </span>
                        <span className="text-slate-700">{keyword.keyword}</span>
                      </li>
                    ))}
                </ul>
              </div>

              <Button onClick={handleRestart} variant="outline" className="mt-2">
                <ArrowRight className="mr-2 h-4 w-4" />
                Start New Search
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

