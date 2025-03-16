"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<
    {
      experimentId: string;
      username: string;
      seedWord: string;
      wordCount: number;
      createdAt: string;
    }[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchExperiments() {
      try {
        const response = await axios.get("/api/experiments");
        setExperiments(response.data);
      } catch (error) {
        console.error("실험 데이터를 불러오는 중 오류 발생:", error);
      }
    }
    fetchExperiments();
  }, []);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">실험 목록</h1>
      <table className="w-full max-w-4xl bg-white shadow-md rounded-lg p-4">
        <thead>
          <tr className="bg-gray-200 text-black">
            <th className="py-2 px-4 text-black">사용자</th>
            <th className="py-2 px-4 text-black">시드 단어</th>
            <th className="py-2 px-4 text-black">단어 개수</th>
            <th className="py-2 px-4 text-black">생성일</th>
            <th className="py-2 px-4 text-black">작업</th>
          </tr>
        </thead>
        <tbody>
          {experiments.map((experiment) => (
            <tr
              key={experiment.experimentId}
              className="border-b hover:bg-gray-100"
            >
              <td className="py-2 px-4 text-center text-black">
                {experiment.username}
              </td>
              <td className="py-2 px-4 text-center text-black">
                {experiment.seedWord}
              </td>
              <td className="py-2 px-4 text-center text-black">
                {experiment.wordCount}
              </td>
              <td className="py-2 px-4 text-center text-black">
                {new Date(experiment.createdAt).toLocaleString()}
              </td>
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() =>
                    router.push(`/experiments/${experiment.experimentId}`)
                  }
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-700 mr-2"
                >
                  상세 보기
                </button>
                <button
                  onClick={() =>
                    router.push(
                      `/experiments/inside-fmri/${experiment.experimentId}`
                    )
                  }
                  className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-700"
                >
                  실험 보기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => router.push("/users")}
        className="mt-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-800"
      >
        사용자 선택으로 돌아가기
      </button>
    </div>
  );
}
