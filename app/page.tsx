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
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type DepartmentId = "mathematics" | "data-science";
export type Grade = 1 | 2 | 3 | 4;

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

export type Course = {
  name: string;
  count: number;
  percentage: number;
};

export type GradeData = {
  grade: Grade;
  label: string;
  stepName: string;
  description: string;
  respondents: number;
  totalSelections: number;
  courses: Course[];
};

export type Department = {
  id: DepartmentId;
  name: string;
  shortName: string;
  description: string;
  grades: Record<Grade, GradeData>;
};

export const departments: Department[] = [
  {
    id: "mathematics",
    name: "수학과",
    shortName: "MATH",
    description: "수와 구조를 탐구하는 학과",
    grades: {
      1: {
        grade: 1,
        label: "1학년",
        stepName: "기초 전공 탐색",
        description: "수학적 기초 역량 및 프로그래밍 입문",
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
      2: {
        grade: 2,
        label: "2학년",
        stepName: "전공 기초 심화",
        description: "순수수학과 응용수학의 기반 확립",
        respondents: 110,
        totalSelections: 378,
        courses: [
          { name: "해석학I", count: 92, percentage: 83.6 },
          { name: "선형대수학II", count: 85, percentage: 77.3 },
          { name: "미분방정식", count: 71, percentage: 64.5 },
          { name: "복소함수론", count: 58, percentage: 52.7 },
          { name: "수치해석입문", count: 42, percentage: 38.2 },
          { name: "정수론기초", count: 30, percentage: 27.3 },
        ],
      },
      3: {
        grade: 3,
        label: "3학년",
        stepName: "전공 심화 응용",
        description: "현대수학 핵심 이론과 응용 분야 연계",
        respondents: 95,
        totalSelections: 346,
        courses: [
          { name: "현대대수학I", count: 81, percentage: 85.3 },
          { name: "위상수학I", count: 73, percentage: 76.8 },
          { name: "실해석학", count: 62, percentage: 65.3 },
          { name: "확률및통계", count: 55, percentage: 57.9 },
          { name: "미분기하학", count: 44, percentage: 46.3 },
          { name: "금융수학개론", count: 31, percentage: 32.6 },
        ],
      },
      4: {
        grade: 4,
        label: "4학년",
        stepName: "캡스톤 및 진로",
        description: "AI·데이터 융합 수학 및 졸업연구",
        respondents: 80,
        totalSelections: 258,
        courses: [
          { name: "현대대수학II", count: 65, percentage: 81.3 },
          { name: "인공지능수학", count: 58, percentage: 72.5 },
          { name: "편미분방정식", count: 46, percentage: 57.5 },
          { name: "위상수학II", count: 38, percentage: 47.5 },
          { name: "빅데이터수학실습", count: 31, percentage: 38.8 },
          { name: "졸업연구및캡스톤", count: 20, percentage: 25.0 },
        ],
      },
    },
  },
  {
    id: "data-science",
    name: "데이터사이언스학과",
    shortName: "DATA",
    description: "데이터에서 의미를 찾는 학과",
    grades: {
      1: {
        grade: 1,
        label: "1학년",
        stepName: "기초 전공 탐색",
        description: "데이터사이언스 개론 및 기초 파이썬 실습",
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
      2: {
        grade: 2,
        label: "2학년",
        stepName: "전공 기초 심화",
        description: "머신러닝과 통계 모델링 알고리즘 체득",
        respondents: 115,
        totalSelections: 429,
        courses: [
          { name: "자료구조와알고리즘", count: 99, percentage: 86.1 },
          { name: "수리통계학", count: 88, percentage: 76.5 },
          { name: "머신러닝기초", count: 82, percentage: 71.3 },
          { name: "탐색적데이터분석(EDA)", count: 70, percentage: 60.9 },
          { name: "데이터베이스시스템", count: 54, percentage: 47.0 },
          { name: "웹데이터크롤링실습", count: 36, percentage: 31.3 },
        ],
      },
      3: {
        grade: 3,
        label: "3학년",
        stepName: "전공 심화 응용",
        description: "딥러닝·NLP·비전 등 첨단 AI 모델 심화",
        respondents: 100,
        totalSelections: 370,
        courses: [
          { name: "딥러닝응용", count: 87, percentage: 87.0 },
          { name: "빅데이터컴퓨팅", count: 79, percentage: 79.0 },
          { name: "자연어처리입문", count: 68, percentage: 68.0 },
          { name: "컴퓨터비전기초", count: 58, percentage: 58.0 },
          { name: "클라우드데이터엔지니어링", count: 45, percentage: 45.0 },
          { name: "추천시스템실습", count: 33, percentage: 33.0 },
        ],
      },
      4: {
        grade: 4,
        label: "4학년",
        stepName: "캡스톤 및 실무",
        description: "생성형 AI 산학 연계 및 실무 프로젝트",
        respondents: 85,
        totalSelections: 303,
        courses: [
          { name: "데이터사이언스캡스톤디자인", count: 76, percentage: 89.4 },
          { name: "생성형AI와LLM실무", count: 71, percentage: 83.5 },
          { name: "빅데이터분산처리실무", count: 55, percentage: 64.7 },
          { name: "시계열데이터예측특론", count: 43, percentage: 50.6 },
          { name: "AI윤리와데이터보안", count: 34, percentage: 40.0 },
          { name: "산학연계인턴십", count: 24, percentage: 28.2 },
        ],
      },
    },
  },
];

const GRADE_LIST: Grade[] = [1, 2, 3, 4];

export default function Home() {
  const [selectedDeptId, setSelectedDeptId] = useState<DepartmentId | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  const selectedDepartment = useMemo(
    () => departments.find((dept) => dept.id === selectedDeptId) ?? null,
    [selectedDeptId],
  );

  const currentGradeData = useMemo(() => {
    if (!selectedDepartment || !selectedGrade) return null;
    return selectedDepartment.grades[selectedGrade];
  }, [selectedDepartment, selectedGrade]);

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
          title: "학과 및 학년 통계 보기",
          description:
            "수학과 또는 데이터사이언스학과와 학년(1~4학년)을 선택하고 강의 선택 통계를 화면에 표시합니다.",
          inputSchema: {
            type: "object",
            properties: {
              department: {
                type: "string",
                enum: ["mathematics", "data-science"],
              },
              grade: {
                type: "integer",
                enum: [1, 2, 3, 4],
                description: "조회할 학년 (1~4학년)",
              },
            },
            required: ["department"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          async execute(input) {
            const params = input as { department?: unknown; grade?: unknown };
            const department = params.department;
            const grade = typeof params.grade === "number" && [1, 2, 3, 4].includes(params.grade)
              ? (params.grade as Grade)
              : 1;

            if (department !== "mathematics" && department !== "data-science") {
              throw new Error("지원하는 학과를 선택해 주세요.");
            }

            setSelectedDeptId(department);
            setSelectedGrade(grade);
            setShowResults(true);
            await new Promise<void>((resolve) =>
              window.requestAnimationFrame(() => resolve()),
            );
            const selected = departments.find((item) => item.id === department)!;
            const targetGradeData = selected.grades[grade];
            return {
              department: selected.name,
              grade: `${grade}학년`,
              respondentCount: targetGradeData.respondents,
              courseCount: targetGradeData.courses.length,
              view: "statistics",
            };
          },
        },
        { signal: lifecycle.signal },
      );

      await context.registerTool(
        {
          name: "show_department_selection",
          title: "학과 및 학년 선택으로 돌아가기",
          description: "통계 화면에서 학과/학년 선택 화면으로 돌아갑니다.",
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

  const handleSelectDept = (id: DepartmentId) => {
    if (id !== selectedDeptId) {
      setSelectedGrade(null);
    }
    setSelectedDeptId(id);
  };

  const handleSelectGrade = (grade: Grade) => {
    setSelectedGrade(grade);
  };

  const handleViewStatistics = () => {
    if (!selectedDeptId || !selectedGrade) return;
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
        <button
          className="brand brand-btn"
          onClick={goBack}
          type="button"
          aria-label="새내기 과목픽 처음으로"
        >
          <span className="brand-mark" aria-hidden="true">
            <BarChart3 size={20} strokeWidth={2.4} />
          </span>
          <span>새내기 과목픽</span>
        </button>
        <span className="header-chip">1~4학년 · 가상 목업</span>
      </header>

      <div id="top" className="app-frame">
        {!showResults ? (
          <section className="selection-view" aria-labelledby="selection-title">
            <div className="eyebrow">
              <span className="eyebrow-icon" aria-hidden="true">
                <GraduationCap size={16} />
              </span>
              학과 및 학년별 수강 선택 통계
            </div>

            <div className="intro-copy">
              <h1 id="selection-title">
                우리 학과 선배·동기들은
                <br />
                어떤 강의를 선택했을까요?
              </h1>
              <p>
                궁금한 학과와 학년을 선택하시면 해당 학년 학생들의 강의 선택
                기록을 집계한 통계를 보여드려요.
              </p>
            </div>

            {/* STEP 1: 학과 선택 */}
            <div className="flow-step">
              <div className="step-header">
                <span className="step-badge">STEP 1</span>
                <span className="step-title">궁금한 학과를 선택해 주세요</span>
              </div>

              <div className="department-list" aria-label="학과 선택">
                {departments.map((department, index) => {
                  const isSelected = selectedDeptId === department.id;
                  const Icon = department.id === "mathematics" ? Sigma : Database;

                  return (
                    <button
                      className={`department-card ${isSelected ? "is-selected" : ""}`}
                      key={department.id}
                      onClick={() => handleSelectDept(department.id)}
                      type="button"
                      aria-pressed={isSelected}
                      aria-label={`${department.name} 선택`}
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
            </div>

            {/* STEP 2: 학년 선택 */}
            <div className={`flow-step ${selectedDeptId ? "is-active" : "is-disabled"}`}>
              <div className="step-header">
                <span className="step-badge">STEP 2</span>
                <span className="step-title">
                  조회할 학년을 선택해 주세요
                  {!selectedDeptId && <span className="step-guide">(먼저 학과를 선택해 주세요)</span>}
                </span>
              </div>

              <div className="grade-grid" aria-label="학년 선택">
                {GRADE_LIST.map((grade) => {
                  const isSelected = selectedGrade === grade;
                  const gradeInfo = selectedDepartment?.grades[grade];

                  return (
                    <button
                      key={grade}
                      type="button"
                      disabled={!selectedDeptId}
                      className={`grade-card ${isSelected ? "is-selected" : ""}`}
                      onClick={() => handleSelectGrade(grade)}
                      aria-pressed={isSelected}
                    >
                      <div className="grade-card-top">
                        <span className="grade-num">{grade}학년</span>
                        {isSelected && (
                          <span className="grade-check-icon" aria-hidden="true">
                            <Check size={14} />
                          </span>
                        )}
                      </div>
                      <span className="grade-step-name">
                        {gradeInfo?.stepName ?? `${grade}학년`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 통계 확인 버튼 */}
            <div className="action-area">
              <Button
                className="confirm-button"
                size="lg"
                disabled={!selectedDeptId || !selectedGrade}
                onClick={handleViewStatistics}
                type="button"
              >
                {selectedDepartment && selectedGrade ? (
                  <>
                    <span>
                      <strong>{selectedDepartment.name}</strong> {selectedGrade}학년 통계 확인하기
                    </span>
                    <ArrowRight size={18} />
                  </>
                ) : (
                  selectedDepartment
                    ? "학년을 선택해 주세요"
                    : "학과를 먼저 선택해 주세요"
                )}
              </Button>
            </div>

            <div className="selection-hint">
              <Info size={16} aria-hidden="true" />
              <p>
                학생 한 명이 여러 강의를 담을 수 있는 <strong>복수 선택 기준 통계</strong>이며,
                1~4학년 전 학년 통계를 지원해요.
              </p>
            </div>
          </section>
        ) : selectedDepartment && currentGradeData ? (
          <section className="results-view" aria-labelledby="results-title">
            <Button
              className="back-button"
              variant="ghost"
              onClick={goBack}
              type="button"
            >
              <ArrowLeft size={17} />
              학과 · 학년 다시 선택
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
                {selectedDepartment.name} · {selectedGrade}학년
              </div>
              <h1 id="results-title" ref={resultHeadingRef} tabIndex={-1}>
                {selectedGrade}학년 학생들이 선택한 강의
              </h1>
              <p>
                {selectedDepartment.name} {selectedGrade}학년 학생들의 가상 강의 선택
                기록을 집계한 결과입니다.
              </p>
            </div>

            {/* 빠른 학년 변경 탭 (Segmented Control) */}
            <div className="grade-tab-container" aria-label="학년 빠른 변경">
              <span className="grade-tab-label">학년 전환:</span>
              <div className="grade-tab-group" role="tablist">
                {GRADE_LIST.map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    role="tab"
                    aria-selected={selectedGrade === grade}
                    className={`grade-tab-item ${selectedGrade === grade ? "is-active" : ""}`}
                    onClick={() => setSelectedGrade(grade)}
                  >
                    {grade}학년
                  </button>
                ))}
              </div>
            </div>

            <div className="summary-grid" aria-label="통계 요약">
              <div className="summary-card primary-summary">
                <span className="summary-icon" aria-hidden="true">
                  <Users size={18} />
                </span>
                <span className="summary-label">응답 학생</span>
                <strong>{currentGradeData.respondents}명</strong>
              </div>
              <div className="summary-card">
                <span className="summary-icon" aria-hidden="true">
                  <BookOpen size={18} />
                </span>
                <span className="summary-label">총 선택</span>
                <strong>{currentGradeData.totalSelections}건</strong>
              </div>
              <div className="summary-card">
                <span className="summary-icon" aria-hidden="true">
                  <BarChart3 size={18} />
                </span>
                <span className="summary-label">1인 평균</span>
                <strong>
                  {(currentGradeData.totalSelections / currentGradeData.respondents).toFixed(1)}개
                </strong>
              </div>
            </div>

            <div className="basis-note">
              <Info size={17} aria-hidden="true" />
              <p>
                비율은 전체 {currentGradeData.respondents}명 중 해당 강의를 선택한
                학생의 비율입니다. 복수 선택이 가능하여 비율 합계는 100%를 초과할 수
                있습니다.
              </p>
            </div>

            <div className="course-section">
              <div className="course-section-header">
                <div>
                  <p className="step-label">COURSE RANKING · {selectedGrade}학년</p>
                  <h2>강의 선택 현황</h2>
                </div>
                <span>전체 {currentGradeData.courses.length}개</span>
              </div>

              <ol className="course-list">
                {currentGradeData.courses.map((course, index) => {
                  const isTop3 = index < 3;
                  const isHighRate = course.percentage >= 80;

                  return (
                    <li className="course-item" key={course.name}>
                      <div className="course-row">
                        <span className={`rank ${isTop3 ? "top-rank" : ""}`}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="course-name-wrap">
                          <div className="course-title-line">
                            <strong>{course.name}</strong>
                            {isHighRate && (
                              <span className="badge-high-pick">
                                <Sparkles size={11} aria-hidden="true" />
                                인기선택
                              </span>
                            )}
                          </div>
                          <span>{course.count}명 선택</span>
                        </div>
                        <strong className="percentage">
                          {course.percentage.toFixed(1)}%
                        </strong>
                      </div>
                      <div
                        className="bar-track"
                        role="progressbar"
                        aria-label={`${course.name} 선택 비율`}
                        aria-valuenow={course.percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <span
                          className="bar-fill"
                          style={{ width: `${course.percentage}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <Button className="change-department-button" size="lg" onClick={goBack}>
              다른 학과 · 학년 선택하기
              <ArrowRight size={18} />
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
