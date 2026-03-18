"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { MessageCircle, Clock, Zap } from "lucide-react"

const conversations = [
  {
    title: "Pressure Washing Inquiry & Quote Generation",
    messages: [
      { text: "Hi! How much for a pressure washing on my home?", sender: "customer", delay: 0 },
      {
        text: "I can definitely help with that! To give you the most accurate info, what specific areas are we looking to refresh today? (Driveway, siding, roof, etc.)",
        sender: "ai",
        delay: 1000,
      },
      {
        text: "The driveway and the front walkway are pretty dirty.",
        sender: "customer",
        delay: 2500,
      },
      {
        text: "No problem. Those high-traffic areas make a huge difference once they're brightened up. Do you happen to know the approximate square footage, or should I help you estimate it?",
        sender: "ai",
        delay: 3500,
      },
      { text: "It's a standard 2-car driveway.", sender: "customer", delay: 5000 },
      {
        text: "Got it. To give you an Instant Quote right now, could you snap a quick photo of the driveway and walkway? I'll analyze the surface and the level of buildup for you.",
        sender: "ai",
        delay: 6000,
      },
      {
        text: "",
        imageSrc: "/images/walkway_driveway.png",
        imageAlt: "Uploaded driveway and walkway photo",
        sender: "customer",
        delay: 7500,
      },
      {
        text: "Thanks! I see some organic growth and a few oil spots. We'll use a professional-grade treatment for those. Based on the photo, your quote is $245",
        sender: "ai",
        delay: 8500,
      },
    ],
  },
  {
    title: "The customer is hosting an event soon and realized their property looks neglected.",
    messages: [
      { text: "Hey, I just realized my back deck is covered in green mold and I have a family BBQ this Saturday. Do you guys have any openings before then?", sender: "customer", delay: 0 },
      {
        text: "I understand the urgency! We can definitely help get that deck ready for your BBQ. To give you an instant quote while the office is closed, could you upload a photo of the deck area? I'll check our schedule for this week immediately after.",
        sender: "ai",
        delay: 1000,
      },
      {
        text: "",
        imageSrc: "/images/wooden_deck.png",
        imageAlt: "Uploaded wooden deck photo",
        sender: "customer",
        delay: 2500,
      },
      {
        text: "Got it. That's definitely some heavy organic growth. For a soft-wash treatment to safely remove that mold, your quote is $210. I actually have a cancellation this Tuesday at 10:00 AM. Would you like to lock that in?",
        sender: "ai",
        delay: 4000,
      },
    ],
  },
  {
    title: "A customer is looking for a specific solution rather than a general cleaning.",
    messages: [
      {
        text: "Do you guys handle oil stains? My teenager’s car leaked all over our paver driveway and it looks terrible.",
        sender: "customer",
        delay: 0,
      },
      {
        text: "We certainly do! Oil on pavers requires a specific degreasing treatment to lift the stain without damaging the stone. How old are the stains, and roughly how large is the affected area?",
        sender: "ai",
        delay: 1000,
      },
      { text: "They've been there about a week. There are three big spots right in the center.", sender: "customer", delay: 2500 },
      {
        text: "Understood. If you can snap a close-up photo of the spots, I can confirm if our deep-stain lifting process will work and give you a price right now.",
        sender: "ai",
        delay: 3500,
      },
      {
        text: "",
        imageSrc: "/images/oil_pavers.png",
        imageAlt: "Uploaded oil spots photo",
        sender: "customer",
        delay: 5000,
      },
      {
        text: "Thanks for the clear photo. We can definitely treat those. For the oil extraction and a full driveway rinse, it would be $195. Should I see when our next technician is available in your area?",
        sender: "ai",
        delay: 6000,
      },
    ],
  },
]

export function AITeamSection() {
  const sectionRef = useRef<HTMLElement>(null) // Added section ref for intersection observer
  const [isVisible, setIsVisible] = useState(false)
  const [currentConversation, setCurrentConversation] = useState(0)
  const [displayedMessages, setDisplayedMessages] = useState<
    { text: string; sender: string; delay: number; imageSrc?: string; imageAlt?: string }[]
  >([])
  const [isTyping, setIsTyping] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log("[v0] AI Team Section is now visible")
          setIsVisible(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      },
    )

    const currentRef = sectionRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [displayedMessages, isTyping])

  useEffect(() => {
    const conversation = conversations[currentConversation]
    setDisplayedMessages([])
    setIsTyping(false)

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    let messageIndex = 0

    const showNextMessage = () => {
      if (messageIndex >= conversation.messages.length) {
        // Wait 3 seconds then move to next conversation
        timeoutRef.current = setTimeout(() => {
          setCurrentConversation((prev) => (prev + 1) % conversations.length)
        }, 3000)
        return
      }

      const message = conversation.messages[messageIndex]

      timeoutRef.current = setTimeout(() => {
        if (message.sender === "ai") {
          setIsTyping(true)
          timeoutRef.current = setTimeout(() => {
            setDisplayedMessages((prev) => [...prev, message])
            setIsTyping(false)
            messageIndex++
            showNextMessage()
          }, 800) // Reduced typing delay from 1500ms to 800ms for faster replies
        } else {
          setDisplayedMessages((prev) => [...prev, message])
          messageIndex++
          showNextMessage()
        }
      }, message.delay)
    }

    showNextMessage()

    // Cleanup timeout on unmount or conversation change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentConversation])

  return (
    <section id="ai-team" ref={sectionRef} className="relative z-10">
      <div className="bg-white rounded-b-[3rem] pt-16 sm:pt-24 pb-16 sm:pb-24 px-4 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div
              className={`inline-flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 rounded-full text-sm font-medium mb-6 transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              AI Pressure Washing Assistant Demo
            </div>

            <h2
              className={`text-4xl md:text-5xl font-bold text-slate-900 mb-4 transition-all duration-1000 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              See AI Handle{" "}
              <span className="bg-gradient-to-r from-slate-600 to-slate-400 bg-clip-text text-transparent">
                Real Pressure Washing Sales
              </span>
            </h2>

            <p
              className={`text-xl text-slate-600 max-w-2xl mx-auto transition-all duration-1000 delay-400 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Watch how our AI handles pressure washing inquiries, generates quotes, and provides 24/7 support.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 max-w-7xl mx-auto">
            {/* Left side - Text content */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center lg:h-[600px] space-y-6 lg:space-y-8 order-2 lg:order-1">
              <div
                className={`transition-all duration-1000 delay-600 ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                }`}
              >
                <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 lg:mb-6">
                  This is what your pressure washing customers see
                </h3>

                <div className="space-y-3 lg:space-y-4 text-base lg:text-lg text-slate-700 leading-relaxed">
                  <p>
                    While you're closed, your AI assistant is answering pressure washing questions, generating quotes, and helping
                    customers 24/7.
                  </p>

                  <p>
                    Every conversation you're watching could be happening at midnight, on Sundays, or when your sales
                    team is with other customers.
                  </p>

                  <p className="text-lg lg:text-xl font-semibold text-slate-900">
                    Your competitors are losing these sales.
                  </p>
                </div>
              </div>

              <div
                className={`transition-all duration-1000 delay-800 ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                }`}
              >
                <div className="p-4 lg:p-6 bg-slate-50 rounded-xl border-l-4 border-slate-900">
                  <p className="text-slate-800 font-medium text-sm lg:text-base">
                    "We went from missing 70% of after-hours pressure washing inquiries to capturing every single lead. Our test
                    drive bookings increased 50% in the first month."
                  </p>
                  <p className="text-xs lg:text-sm text-slate-600 mt-2">— Mike Rodriguez, Pressure Washing Owner</p>
                </div>
              </div>
            </div>

            {/* Right side - Phone mockup */}
            <div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-2">
              <div className="max-w-md w-full">
                <div
                  className={`relative transition-all duration-1000 delay-600 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  <div className="bg-slate-900 rounded-[2.5rem] p-2 shadow-2xl">
                    <div className="bg-black rounded-[2rem] p-1">
                      <div className="bg-white rounded-[1.5rem] overflow-hidden">
                        {/* Status bar */}
                        <div className="bg-slate-50 px-6 py-3 flex justify-between items-center text-sm">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                            <span className="font-medium text-slate-700">Pressure Washing AI</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-500">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs">24/7</span>
                          </div>
                        </div>

                        <div className="bg-slate-900 px-6 py-4 text-white">
                          <div className="flex items-center gap-3">
                            <Image
                              src="/images/atlas.png"
                              alt="Atlas - AI Agent"
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded-full object-cover mr-2 mt-1 flex-shrink-0"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm">Atlas - AI Sales Agent</h3>
                              <p className="text-xs text-slate-300">Chat with 904 234 5678</p>
                            </div>
                            <div className="text-xs text-green-400 flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              Online
                            </div>
                          </div>
                        </div>

                        {/* Chat messages */}
                        <div
                          ref={chatContainerRef}
                          className="h-96 overflow-y-scroll scrollbar-hide p-4 space-y-3 bg-slate-50"
                          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                          {displayedMessages.map((message, index) => (
                            <div
                              key={index}
                              className={`flex ${message.sender === "customer" ? "justify-end" : "justify-start"}`}
                            >
                              {message.sender === "ai" && (
                                <Image
                                  src="/images/atlas.png"
                                  alt="Atlas"
                                  width={24}
                                  height={24}
                                  className="w-6 h-6 rounded-full object-cover mr-2 mt-1 flex-shrink-0"
                                />
                              )}
                              <div
                                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                                  message.sender === "customer"
                                    ? "bg-slate-900 text-white rounded-br-md"
                                    : "bg-white text-slate-800 shadow-sm border border-slate-200 rounded-bl-md"
                                }`}
                              >
                                {message.imageSrc ? (
                                  <div className="rounded-lg overflow-hidden shadow-md w-40">
                                    <Image
                                      src={message.imageSrc}
                                      alt={message.imageAlt ?? "Uploaded photo"}
                                      width={160}
                                      height={120}
                                      className="w-40 h-auto object-cover"
                                    />
                                  </div>
                                ) : null}
                                {message.text
                                  ? message.text.split("\n").map((line, i) => (
                                      <div key={i}>{line}</div>
                                    ))
                                  : null}
                              </div>
                              {message.sender === "customer" && (
                                <div className="w-6 h-6 rounded-full bg-slate-400 ml-2 mt-1 flex-shrink-0 flex items-center justify-center text-xs text-white font-medium">
                                  C
                                </div>
                              )}
                            </div>
                          ))}

                          {/* Typing indicator */}
                          {isTyping && (
                            <div className="flex justify-start items-start">
                              <Image
                                src="/images/atlas.png"
                                alt="Atlas"
                                width={24}
                                height={24}
                                className="w-6 h-6 rounded-full object-cover mr-2 mt-1 flex-shrink-0"
                              />
                              <div className="bg-white p-3 rounded-2xl rounded-bl-md shadow-sm border border-slate-200">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                  <div
                                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.1s" }}
                                  ></div>
                                  <div
                                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.2s" }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="p-4 bg-white border-t border-slate-200">
                          <div className="flex items-center gap-3 bg-slate-100 rounded-full px-4 py-2">
                            <span className="text-slate-500 text-sm lg:text-base flex-1">Atlas is responding...</span>
                            <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center">
                              <Zap className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
