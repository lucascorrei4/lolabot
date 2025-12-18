'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const faqs = [
  {
    question: "How does the 'Context Awareness' work?",
    answer: "Lolabot can read the content of the page it is embedded on (or receive specific data you pass to it). This means if a user is on a pricing page, Lolabot knows to talk about pricing. If they are on a technical doc, it switches to technical support mode. It feels like a real assistant looking at the screen with the user."
  },
  {
    question: "Is it safe? Will it hallucinate?",
    answer: "Safety is our priority. We implement strict RAG (Retrieval Augmented Generation) guardrails. Lolabot is instructed to only answer based on the knowledge base and policies you provide. If it doesn't know, it says so or escalates to a human, rather than making things up."
  },
  {
    question: "What is the 'BizAI Agent' briefing?",
    answer: "Instead of reading through hundreds of chat logs, our BizAI Agent analyzes every conversation and sends you a concise summary (Briefing). It highlights the user's intent, the outcome, and any action items for your team."
  },
  {
    question: "How does the Emergency Notification work?",
    answer: "Lolabot performs real-time sentiment analysis on every user message. If it detects frustration, anger, or specific keywords (like 'refund' or 'speak to manager'), it triggers an immediate alert to your team via email or webhook, so you can intervene before you lose the customer."
  },
  {
    question: "Can I customize the look and feel?",
    answer: "Absolutely. We customize the bot's appearance, tone of voice, and behavior to match your brand identity perfectly during the setup phase."
  },
  {
    question: "What happens after I pay the setup fee?",
    answer: "Our team immediately schedules a discovery call to gather your requirements, knowledge base materials, and business rules. We then build, test, and embed the bot for you. The monthly fee covers hosting, AI token usage, maintenance, and ongoing support."
  }
];

export function FAQ() {
  return (
    <section className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg leading-8 text-gray-400">
            Everything you need to know about getting started with Lolabot.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl divide-y divide-white/10">
          {faqs.map((faq) => (
            <Disclosure key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Disclosure({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-start justify-between text-left text-white"
      >
        <span className="text-base font-semibold leading-7">{question}</span>
        <span className="ml-6 flex h-7 items-center">
          <ChevronDownIcon
            className={`h-6 w-6 transform duration-200 ${isOpen ? '-rotate-180' : 'rotate-0'}`}
            aria-hidden="true"
          />
        </span>
      </button>
      <div
        className={`mt-2 pr-12 text-base leading-7 text-gray-400 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="pb-4">{answer}</p>
      </div>
    </div>
  );
}

