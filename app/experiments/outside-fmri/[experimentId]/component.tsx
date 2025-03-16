"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ExperimentPage({
  experimentId,
}: {
  experimentId: string;
}) {
  const [words, setWords] = useState<string[]>([]);
  const [inputWord, setInputWord] = useState("");
  const [wordCount, setWordCount] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    async function fetchExperiment() {
      try {
        const response = await axios.get(`/api/experiments/${experimentId}`);
        setWords([response.data.seedWord]);
        setWordCount(0);
      } catch (error) {
        console.error("Error fetching experiment data:", error);
      }
    }
    fetchExperiment();
  }, [experimentId]);

  useEffect(() => {
    if (wordCount >= 20) {
      router.push("/experiments");
      return;
    }
  }, [router, wordCount]);

  const handleAddWord = async () => {
    if (!inputWord.trim()) return;

    try {
      await axios.post("/api/words", {
        experimentId,
        word: inputWord,
      });
      setWords((prevWords) => [...prevWords.slice(-1), inputWord]);
      setInputWord("");
      setWordCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error("Error adding word:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddWord();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <p className="text-lg text-gray-700">단어 입력: {wordCount}/20</p>

      <div className="relative w-full max-w-2xl h-48 flex flex-col items-center justify-center mt-6">
        <p className="absolute top-1/3 text-4xl font-bold text-black">
          {words[words.length - 1] ?? ""}
        </p>
      </div>

      <div className="flex">
        <input
          type="text"
          placeholder="단어 입력"
          value={inputWord}
          onChange={(e) => setInputWord(e.target.value)}
          onKeyDown={handleKeyPress}
          className="mt-4 p-2 border border-gray-300 rounded-lg text-black"
        />
        <button
          onClick={handleAddWord}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
        >
          단어 추가
        </button>
      </div>
    </div>
  );
}
