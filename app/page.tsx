"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  ChevronRight,
  Database,
  GraduationCap,
  Info,
  Sigma,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type DepartmentId = "mathematics" | "data-science";

type ModelTool = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute: (input: unknown) => Promise<Record<string, unknown>>;
};

declare global {
  interface Document {
    modelContext?: {
      registerTool: (
        tool: ModelTool,
        options?: { signal?: AbortSignal },
      ) => void | Promise<void>;
    };
  }
}

type Course = {
  name: string;
  count: number;
  percentage: number;
};

type Department = {
  id: DepartmentId;
  name: string;
  shortName: string;
  description: string;
  respondents: number;
  totalSelections: number;
  courses: Course[];
};

const departments: Department[] = [
  {
    id: "mathematics",
    name: "수학과",
    shortName: "MATH",
    description: "수와 구조를 탐구하는 학과",
    respondents: 120,
    totalSelections: 383,
    courses: [
      { name: "미적분학입문", count: 98, percentage: 81.7 },
      { name: "선형대수기초", count: 86, percentage: 71.7 },
      { name: "수학적사고와증명", count: 74, percentage: 61.7 },
      { name: "이산수학입문", count: 59, percentage: 49.2 },
      { name: "기초통계학", count: 41, percentage: 34.2 },
      { name: "수학프로그래밍", count: 25, percentage: 20.8 },
    ],
  },
  {
    id: "data-science",
    name: "데이터사이언스학과",
    shortName: "DATA",
    description: "데이터에서 의미를 찾는 학과",
    respondents: 120,
    totalSelections: 417,
    courses: [
      { name: "데이터사이언스입문", count: 101, percentage: 84.2 },
      { name: "파이썬프로그래밍기초", count: 92, percentage: 76.7 },
      { name: "통계학기초", count: 79, percentage: 65.8 },
      { name: "데이터시각화입문", count: 66, percentage: 55.0 },
      { name: "데이터베이스기초", count: 48, percentage: 40.0 },
      { name: "인공지능개론", count: 31, percentage: 25.8 },
    ],
  },
];

export default function Home() {
  const [selectedId, setSelectedId] = useState<DepartmentId | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  const selectedDepartment = useMemo(
    () => departments.find((department) => department.id === selectedId) ?? null,
    [selectedId],
  );

  useEffect(() => {
    if (showResults) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.setTimeout(() => resultHeadingRef.current?.focus(), 180);
    }
  }, [showResults]);

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;

    const lifecycle = new AbortController();
    const register = async () => {
      await context.registerTool(
        {
          name: "show_department_statistics",
          title: "학과 통계 보기",
          description:
            "수학과 또는 데이터사이언스학과를 선택하고 해당 학과의 강의 선택 통계를 화면에 표시합니다.",
          inputSchema: {
            type: "object",
            properties: {
              department: {
                type: "string",
                enum: ["mathematics", "data-science"],
              },
            },
            required: ["department"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          async execute(input) {
            const department =
              typeof input === "object" && input !== null && "department" in input
                ? (input as { department?: unknown }).department
                : undefined;

            if (department !== "mathematics" && department !== "data-science") {
              throw new Error("지원하는 학과를 선택해 주세요.");
            }

            setSelectedId(department);
            setShowResults(true);
            await new Promise<void>((resolve) =>
              window.requestAnimationFrame(() => resolve()),
            );
            const selected = departments.find((item) => item.id === department)!;
            return {
              department: selected.name,
              respondentCount: selected.respondents,
              courseCount: selected.courses.length,
              view: "statistics",
            };
          },
        },
        { signal: lifecycle.signal },
      );

      await context.registerTool(
        {
          name: "show_department_selection",
          title: "학과 선택으로 돌아가기",
          description: "통계 화면에서 학과 선택 화면으로 돌아갑니다.",
          inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          async execute(input) {
            if (typeof input !== "object" || input === null || Array.isArray(input)) {
              throw new Error("입력은 빈 객체여야 합니다.");
            }
            setShowResults(false);
            await new Promise<void>((resolve) =>
              window.requestAnimationFrame(() => resolve()),
            );
            return { view: "department-selection" };
          },
        },
        { signal: lifecycle.signal },
      );
    };

    void register().catch(() => {
      lifecycle.abort();
    });
    return () => lifecycle.abort();
  }, []);

  const selectDepartment = (id: DepartmentId) => {
    setSelectedId(id);
    setShowResults(true);
  };

  const goBack = () => {
    setShowResults(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="site-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="새내기 과목픽 처음으로">
          <span className="brand-mark" aria-hidden="true">
            <BarChart3 size={20} strokeWidth={2.4} />
          </span>
          <span>새내기 과목픽</span>
        </a>
        <span className="header-chip">27학번 · 목업</span>
      </header>

      <div id="top" className="app-frame">
        {!showResults ? (
          <section className="selection-view" aria-labelledby="selection-title">
            <div className="eyebrow">
              <span className="eyebrow-icon" aria-hidden="true">
                <GraduationCap size={16} />
              </span>
              1학년 · 가상 수강 선택 통계
            </div>

            <div className="intro-copy">
              <p className="step-label">STEP 1</p>
              <h1 id="selection-title">
                우리 학과 학생들은
                <br />
                어떤 강의를 선택했을까요?
              </h1>
              <p>
                관심 학과를 선택하면 학생별 강의 선택 기록을 집계한 결과를
                보여드려요.
              </p>
            </div>

            <div className="department-list" aria-label="학과 선택">
              {departments.map((department, index) => {
                const isSelected = selectedId === department.id;
                const Icon = department.id === "mathematics" ? Sigma : Database;

                return (
                  <button
                    className={`department-card ${isSelected ? "is-selected" : ""}`}
                    key={department.id}
                    onClick={() => selectDepartment(department.id)}
                    type="button"
                    aria-label={`${department.name} 통계 보기`}
                  >
                    <span className="department-index">0{index + 1}</span>
                    <span className="department-icon" aria-hidden="true">
                      <Icon size={25} strokeWidth={1.9} />
                    </span>
                    <span className="department-copy">
                      <span className="department-code">{department.shortName}</span>
                      <strong>{department.name}</strong>
                      <small>{department.description}</small>
                    </span>
                    <span className="department-action" aria-hidden="true">
                      {isSelected ? <Check size={18} /> : <ChevronRight size={20} />}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="selection-hint">
              <Info size={16} aria-hidden="true" />
              <p>한 학생이 여러 강의를 선택할 수 있는 복수 선택 통계예요.</p>
            </div>
          </section>
        ) : selectedDepartment ? (
          <section className="results-view" aria-labelledby="results-title">
            <Button
              className="back-button"
              variant="ghost"
              onClick={goBack}
              type="button"
            >
              <ArrowLeft />
              다른 학과 보기
            </Button>

            <div className="results-heading">
              <div className="eyebrow compact">
                <span className="eyebrow-icon" aria-hidden="true">
                  {selectedDepartment.id === "mathematics" ? (
                    <Sigma size={15} />
                  ) : (
                    <Database size={15} />
                  )}
                </span>
                {selectedDepartment.name} · 1학년
              </div>
              <h1 id="results-title" ref={resultHeadingRef} tabIndex={-1}>
                학생들이 선택한 강의
              </h1>
              <p>가상 학생별 선택 기록을 강의 단위로 집계했어요.</p>
            </div>

            <div className="summary-grid" aria-label="통계 요약">
              <div className="summary-card primary-summary">
                <span className="summary-icon" aria-hidden="true">
                  <Users size={18} />
                </span>
                <span className="summary-label">응답 학생</span>
                <strong>{selectedDepartment.respondents}명</strong>
              </div>
              <div className="summary-card">
                <span className="summary-icon" aria-hidden="true">
                  <BookOpen size={18} />
                </span>
                <span className="summary-label">총 선택</span>
                <strong>{selectedDepartment.totalSelections}건</strong>
              </div>
              <div className="summary-card">
                <span className="summary-icon" aria-hidden="true">
                  <BarChart3 size={18} />
                </span>
                <span className="summary-label">1인 평균</span>
                <strong>
                  {(selectedDepartment.totalSelections / selectedDepartment.respondents).toFixed(1)}개
                </strong>
              </div>
            </div>

            <div className="basis-note">
              <Info size={17} aria-hidden="true" />
              <p>
                비율은 전체 응답 학생 중 해당 강의를 선택한 학생의 비율입니다.
                복수 선택이 가능해 합계는 100%를 넘을 수 있어요.
              </p>
            </div>

            <div className="course-section">
              <div className="course-section-header">
                <div>
                  <p className="step-label">COURSE RANKING</p>
                  <h2>강의 선택 현황</h2>
                </div>
                <span>전체 {selectedDepartment.courses.length}개</span>
              </div>

              <ol className="course-list">
                {selectedDepartment.courses.map((course, index) => (
                  <li className="course-item" key={course.name}>
                    <div className="course-row">
                      <span className={`rank ${index < 3 ? "top-rank" : ""}`}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="course-name-wrap">
                        <strong>{course.name}</strong>
                        <span>{course.count}명 선택</span>
                      </div>
                      <strong className="percentage">{course.percentage.toFixed(1)}%</strong>
                    </div>
                    <div
                      className="bar-track"
                      role="progressbar"
                      aria-label={`${course.name} 선택 비율`}
                      aria-valuenow={course.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <span className="bar-fill" style={{ width: `${course.percentage}%` }} />
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <Button className="change-department-button" size="lg" onClick={goBack}>
              다른 학과 통계 보기
              <ArrowRight />
            </Button>
          </section>
        ) : null}
      </div>

      <footer className="site-footer">
        <p>
          본 서비스의 학과·강의명·응답 학생 수·선택 비율은 목업 체험을 위한
          완전한 가상 예시입니다.
        </p>
        <p>실제 재학생 조사·학교 개설 강의·수강 신청률·수강 추천이 아닙니다.</p>
      </footer>
    </main>
  );
}
