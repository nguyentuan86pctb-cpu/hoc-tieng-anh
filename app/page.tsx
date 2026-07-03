"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Gauge,
  GraduationCap,
  Headphones,
  LayoutDashboard,
  Mic2,
  Pencil,
  PlayCircle,
  Repeat2,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  Volume2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Toast } from "@/components/ui/toast";
import { getLessonsByGrade, lessons } from "@/lib/seed-data";
import { formatDate, starsFromScore } from "@/lib/utils";
import type { Grade, Lesson, ProgressRecord, StudentProfile } from "@/types";

type View = "home" | "profile" | "roadmap" | "lesson" | "quiz" | "result" | "dashboard" | "admin";
type ToastState = { message: string; type: "success" | "error" };
type SpeechMode = "natural" | "slow" | "repeat";
type LessonGameStage = "classroom" | "cards" | "speak" | "roleplay";

const avatars = ["🦊", "🐼", "🐯", "🐻"];
const gameStages: Array<{ id: LessonGameStage; title: string; label: string }> = [
  { id: "classroom", title: "Lớp học vui", label: "Nghe cô và trả lời" },
  { id: "cards", title: "Săn thẻ từ", label: "Bấm đủ 6 thẻ" },
  { id: "speak", title: "Nói theo mẫu", label: "Nhại lại 5 câu" },
  { id: "roleplay", title: "Đóng vai", label: "Hoàn thành hội thoại" }
];

function getPreferredEnglishVoice() {
  const voices = window.speechSynthesis.getVoices();
  const englishVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith("en"));
  return (
    englishVoices.find((voice) => /natural|jenny|aria|guy|sonia|google|microsoft/i.test(voice.name)) ??
    englishVoices.find((voice) => voice.lang === "en-US") ??
    englishVoices[0]
  );
}

function makeUtterance(text: string, mode: SpeechMode) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.voice = getPreferredEnglishVoice() ?? null;
  utterance.rate = mode === "slow" ? 0.58 : 0.72;
  utterance.pitch = 0.98;
  utterance.volume = 1;
  return utterance;
}

function speakEnglish(text: string, mode: SpeechMode = "natural") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(makeUtterance(text, mode));
  if (mode === "repeat") {
    const secondUtterance = makeUtterance(text, "slow");
    secondUtterance.rate = 0.62;
    window.speechSynthesis.speak(secondUtterance);
  }
}

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<Grade>(1);
  const [selectedLessonId, setSelectedLessonId] = useState("g1-hello");
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [lastScore, setLastScore] = useState(0);
  const [toast, setToast] = useState<ToastState>({ message: "", type: "success" });
  const [loading, setLoading] = useState(true);
  const [speechMode, setSpeechMode] = useState<SpeechMode>("natural");

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 450);
    window.speechSynthesis?.getVoices();
    const savedStudent = window.localStorage.getItem("kids_student");
    const savedProgress = window.localStorage.getItem("kids_progress");
    if (savedStudent) {
      const parsed = JSON.parse(savedStudent) as StudentProfile;
      setStudent(parsed);
      setSelectedGrade(parsed.grade);
    }
    if (savedProgress) setProgress(JSON.parse(savedProgress));
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!toast.message) return;
    const timer = window.setTimeout(() => setToast({ message: "", type: "success" }), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const gradeLessons = useMemo(() => getLessonsByGrade(selectedGrade), [selectedGrade]);
  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId) ?? gradeLessons[0];
  const completedCount = progress.filter((item) => item.completed).length;
  const totalStars = progress.reduce((sum, item) => sum + item.stars, 0);
  const averageScore = progress.length ? Math.round(progress.reduce((sum, item) => sum + item.score, 0) / progress.length) : 0;
  const nextLesson = gradeLessons.find((lesson) => !progress.some((item) => item.lessonId === lesson.id && item.completed)) ?? gradeLessons[0];

  function saveStudent(formData: FormData) {
    const name = String(formData.get("studentName") || "").trim();
    const age = Number(formData.get("age") || 7);
    const grade = Number(formData.get("grade") || 1) as Grade;
    const avatar = String(formData.get("avatar") || avatars[0]);
    if (!name) {
      setToast({ message: "Bé cần có tên để bắt đầu học.", type: "error" });
      return;
    }
    const nextStudent = { name, age, grade, avatar };
    setStudent(nextStudent);
    setSelectedGrade(grade);
    setSelectedLessonId(getLessonsByGrade(grade)[0].id);
    window.localStorage.setItem("kids_student", JSON.stringify(nextStudent));
    setToast({ message: "Đã tạo hồ sơ bé!", type: "success" });
    setView("roadmap");
  }

  function openLesson(lesson: Lesson) {
    setSelectedLessonId(lesson.id);
    setAnswers({});
    setView("lesson");
  }

  function submitQuiz() {
    const correct = selectedLesson.quiz.filter((question) => answers[question.id] === question.answer).length;
    const score = Math.round((correct / selectedLesson.quiz.length) * 100);
    const stars = starsFromScore(score);
    const old = progress.find((item) => item.lessonId === selectedLesson.id);
    const nextProgress = [
      ...progress.filter((item) => item.lessonId !== selectedLesson.id),
      {
        lessonId: selectedLesson.id,
        score: Math.max(score, old?.score ?? 0),
        stars: Math.max(stars, old?.stars ?? 0),
        attempts: (old?.attempts ?? 0) + 1,
        completed: score >= 60,
        lastStudy: new Date().toISOString()
      }
    ];
    setLastScore(score);
    setProgress(nextProgress);
    window.localStorage.setItem("kids_progress", JSON.stringify(nextProgress));
    setToast({ message: score >= 60 ? "Tuyệt vời, đã lưu tiến độ!" : "Bé thử lại để lấy thêm sao nhé.", type: score >= 60 ? "success" : "error" });
    setView("result");
  }

  function resetDemo() {
    window.localStorage.removeItem("kids_student");
    window.localStorage.removeItem("kids_progress");
    setStudent(null);
    setProgress([]);
    setAnswers({});
    setView("home");
    setToast({ message: "Đã làm mới dữ liệu demo.", type: "success" });
  }

  return (
    <main className="min-h-screen overflow-hidden px-4 py-5 text-ink md:px-8">
      <Header student={student} view={view} setView={setView} resetDemo={resetDemo} />
      {loading ? (
        <div className="mx-auto mt-10 max-w-5xl">
          <Skeleton />
        </div>
      ) : (
        <div className="mx-auto max-w-7xl">
          {view === "home" && <HomeView setView={setView} student={student} />}
          {view === "profile" && <ProfileView saveStudent={saveStudent} />}
          {view === "roadmap" && (
            <RoadmapView selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade} gradeLessons={gradeLessons} progress={progress} openLesson={openLesson} student={student} />
          )}
          {view === "lesson" && <LevelLessonView lesson={selectedLesson} setView={setView} speechMode={speechMode} setSpeechMode={setSpeechMode} />}
          {view === "quiz" && <QuizView lesson={selectedLesson} answers={answers} setAnswers={setAnswers} submitQuiz={submitQuiz} />}
          {view === "result" && <ResultView score={lastScore} lesson={selectedLesson} setView={setView} />}
          {view === "dashboard" && <DashboardView student={student} completedCount={completedCount} totalStars={totalStars} averageScore={averageScore} nextLesson={nextLesson} progress={progress} openLesson={openLesson} />}
          {view === "admin" && <AdminView progress={progress} openLesson={openLesson} />}
        </div>
      )}
      <Toast message={toast.message} type={toast.type} />
    </main>
  );
}

function Header({ student, view, setView, resetDemo }: { student: StudentProfile | null; view: View; setView: (view: View) => void; resetDemo: () => void }) {
  return (
    <header className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 rounded-[28px] bg-white/80 px-4 py-3 shadow-soft backdrop-blur">
      <button className="flex items-center gap-3 text-left" onClick={() => setView("home")}>
        <span className="flex size-12 items-center justify-center rounded-2xl bg-banana text-2xl">⭐</span>
        <span>
          <span className="block text-lg font-black">Bé Học Tiếng Anh</span>
          <span className="text-xs font-bold text-ink/60">English Kids Roadmap</span>
        </span>
      </button>
      <nav className="flex flex-wrap items-center gap-2">
        {student && <SmallNav active={view === "roadmap"} label="Roadmap" icon={<BookOpen size={16} />} onClick={() => setView("roadmap")} />}
        {student && <SmallNav active={view === "dashboard"} label="Phụ huynh" icon={<LayoutDashboard size={16} />} onClick={() => setView("dashboard")} />}
        <SmallNav active={view === "admin"} label="Admin" icon={<ShieldCheck size={16} />} onClick={() => setView("admin")} />
        {student ? (
          <Button variant="ghost" className="py-2" onClick={resetDemo}>Làm mới demo</Button>
        ) : (
          <Button className="py-2" onClick={() => setView("profile")}>Tạo hồ sơ bé</Button>
        )}
      </nav>
    </header>
  );
}

function SmallNav({ active, label, icon, onClick }: { active: boolean; label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold transition ${active ? "bg-skytoy text-white" : "bg-white text-ink ring-2 ring-ink/10 hover:bg-banana/25"}`} onClick={onClick}>
      {icon}
      {label}
    </button>
  );
}

function SpeechModeButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${
        active ? "bg-ink text-white shadow-lg shadow-slate-200" : "bg-white text-ink ring-2 ring-ink/10 hover:bg-banana/25"
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

function HomeView({ setView, student }: { setView: (view: View) => void; student: StudentProfile | null }) {
  return (
    <section className="grid items-center gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
      <div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-coral shadow-soft">
          <Sparkles size={18} /> Lộ trình Pre-A1 cho lớp 1-2
        </motion.div>
        <h1 className="max-w-3xl text-5xl font-black leading-tight md:text-7xl">Bé luyện nghe nói tiếng Anh theo từng cụm câu tự nhiên.</h1>
        <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-ink/70">Mỗi bài có video, từ vựng, câu mẫu luyện nói, hội thoại theo tình huống, quiz và dashboard phụ huynh. Thiết kế theo cách học ngắn, lặp lại, có hình ảnh và role-play để bé nói được từng câu thật.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button onClick={() => setView(student ? "roadmap" : "profile")}><PlayCircle size={20} /> {student ? "Học tiếp" : "Bắt đầu học"}</Button>
          <Button variant="ghost" onClick={() => setView("profile")}><UserRound size={20} /> Hồ sơ bé</Button>
          <Button variant="secondary" onClick={() => setView("dashboard")}><LayoutDashboard size={20} /> Dành cho phụ huynh</Button>
        </div>
        <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
          {[
            ["24", "câu nói mỗi bài"],
            ["3", "tình huống hội thoại"],
            ["Chậm", "giọng đọc luyện nhại"]
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl bg-white/85 px-4 py-3 shadow-soft ring-2 ring-white/70">
              <p className="text-2xl font-black text-skytoy">{value}</p>
              <p className="text-sm font-bold text-ink/60">{label}</p>
            </div>
          ))}
        </div>
      </div>
      <motion.div initial={{ rotate: -4, scale: 0.96 }} animate={{ rotate: 0, scale: 1 }} className="confetti rounded-[40px] bg-white p-6 shadow-soft">
        <div className="rounded-[32px] bg-gradient-to-br from-banana via-white to-sky-100 p-6">
          <div className="text-center text-8xl">🦊</div>
          <div className="mt-4 rounded-[28px] bg-white/90 p-5 text-center">
            <p className="text-sm font-black text-coral">Mascot Buddy nói:</p>
            <p className="mt-2 text-3xl font-black">Ready, steady, learn!</p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {["Hello", "Star", "Great"].map((word) => <span key={word} className="rounded-2xl bg-leaf/25 px-3 py-3 font-black">{word}</span>)}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function ProfileView({ saveStudent }: { saveStudent: (formData: FormData) => void }) {
  return (
    <section className="mx-auto max-w-4xl py-10">
      <Card>
        <h2 className="text-3xl font-black">Tạo hồ sơ bé</h2>
        <p className="mt-2 font-semibold text-ink/65">Thông tin này giúp app chọn bài học phù hợp.</p>
        <form action={saveStudent} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-black">Tên bé<Input name="studentName" placeholder="Ví dụ: Minh Anh" className="mt-2" /></label>
          <label className="block text-sm font-black">Tuổi<Input name="age" type="number" min={5} max={9} defaultValue={7} className="mt-2" /></label>
          <label className="block text-sm font-black">Chọn lớp<Select name="grade" defaultValue="1" className="mt-2"><option value="1">Lớp 1</option><option value="2">Lớp 2</option></Select></label>
          <label className="block text-sm font-black">Mascot yêu thích<Select name="avatar" defaultValue={avatars[0]} className="mt-2">{avatars.map((avatar) => <option key={avatar} value={avatar}>{avatar}</option>)}</Select></label>
          <Button type="submit" className="md:col-span-2">Tạo hồ sơ và chọn lớp</Button>
        </form>
      </Card>
    </section>
  );
}

function RoadmapView({ selectedGrade, setSelectedGrade, gradeLessons, progress, openLesson, student }: { selectedGrade: Grade; setSelectedGrade: (grade: Grade) => void; gradeLessons: Lesson[]; progress: ProgressRecord[]; openLesson: (lesson: Lesson) => void; student: StudentProfile | null }) {
  return (
    <section className="py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><p className="font-black text-coral">{student ? `${student.avatar} ${student.name}` : "Học thử"}</p><h2 className="text-4xl font-black">Roadmap lớp {selectedGrade}</h2></div>
        <div className="flex gap-2"><Button variant={selectedGrade === 1 ? "secondary" : "ghost"} onClick={() => setSelectedGrade(1)}>Lớp 1</Button><Button variant={selectedGrade === 2 ? "secondary" : "ghost"} onClick={() => setSelectedGrade(2)}>Lớp 2</Button></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {gradeLessons.map((lesson) => {
          const done = progress.find((item) => item.lessonId === lesson.id);
          return (
            <Card key={lesson.id} className="transition hover:-translate-y-1">
              <div className="flex items-start justify-between gap-3"><div className="flex size-14 items-center justify-center rounded-2xl bg-banana text-2xl font-black">{lesson.order}</div><span className="rounded-full bg-leaf/20 px-3 py-1 text-xs font-black text-ink">{done?.completed ? "Đã học" : "Sẵn sàng"}</span></div>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-4xl">{lesson.image}</span>
                <h3 className="text-2xl font-black">{lesson.title}</h3>
              </div>
              <p className="mt-2 font-semibold text-ink/65">{lesson.description}</p>
              <p className="mt-3 text-sm font-bold text-ink/55">{lesson.vocabulary.length} từ vựng · {lesson.phrases.length} câu mẫu · {lesson.dialogues.length} tình huống</p>
              <div className="mt-4 flex items-center gap-1 text-banana">{Array.from({ length: 3 }).map((_, index) => <Star key={index} size={20} fill={index < (done?.stars ?? 0) ? "currentColor" : "none"} />)}</div>
              <Button className="mt-5 w-full" onClick={() => openLesson(lesson)}>Vào bài học</Button>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function LevelLessonView({ lesson, setView, speechMode, setSpeechMode }: { lesson: Lesson; setView: (view: View) => void; speechMode: SpeechMode; setSpeechMode: (mode: SpeechMode) => void }) {
  const [level, setLevel] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [talkIndex, setTalkIndex] = useState(0);
  const [speakIndex, setSpeakIndex] = useState(0);
  const gameWords = lesson.vocabulary.slice(0, 6);
  const talkLines = lesson.dialogues[0]?.lines.slice(0, 6) ?? [];
  const speakLines = lesson.phrases.slice(1, 4);
  const currentWord = gameWords[Math.min(wordIndex, gameWords.length - 1)];
  const currentTalk = talkLines[Math.min(talkIndex, Math.max(talkLines.length - 1, 0))];
  const currentSpeak = speakLines[Math.min(speakIndex, speakLines.length - 1)];
  const levelTitle = ["Chuẩn bị", "Màn 1", "Màn 2", "Màn 3", "Nhận thưởng"][level] ?? "Bài học";
  const progress = Math.min(level, 4);

  useEffect(() => {
    setLevel(0);
    setWordIndex(0);
    setTalkIndex(0);
    setSpeakIndex(0);
  }, [lesson.id]);

  function nextWord() {
    if (!currentWord) return;
    speakEnglish(currentWord.word, speechMode);
    if (wordIndex + 1 >= gameWords.length) {
      setLevel(2);
      return;
    }
    setWordIndex((value) => value + 1);
  }

  function nextTalk() {
    if (!currentTalk) return;
    speakEnglish(currentTalk.english, speechMode);
    if (talkIndex + 1 >= talkLines.length) {
      setLevel(3);
      return;
    }
    setTalkIndex((value) => value + 1);
  }

  function nextSpeak() {
    if (!currentSpeak) return;
    speakEnglish(currentSpeak.english, speechMode);
    if (speakIndex + 1 >= speakLines.length) {
      setLevel(4);
      return;
    }
    setSpeakIndex((value) => value + 1);
  }

  function resetLevelGame() {
    setLevel(0);
    setWordIndex(0);
    setTalkIndex(0);
    setSpeakIndex(0);
  }

  return (
    <section className="py-8">
      <div className="mx-auto max-w-6xl">
        <Card className="overflow-hidden bg-white p-0">
          <div className="game-stage-bg p-5 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-black text-coral">{levelTitle} · {lesson.title}</p>
                <h2 className="mt-1 text-4xl font-black md:text-5xl">{lesson.image} Đi qua các màn nhỏ</h2>
              </div>
              <Button variant="ghost" onClick={() => setView("roadmap")}>Roadmap</Button>
            </div>

            <div className="mt-5 rounded-3xl bg-white/85 p-4">
              <div className="h-4 overflow-hidden rounded-full bg-ink/10">
                <div className="h-full rounded-full bg-leaf transition-all" style={{ width: `${(progress / 4) * 100}%` }} />
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs font-black text-ink/60">
                <span>Từ</span>
                <span>Nói chuyện</span>
                <span>Nói lại</span>
                <span>Thưởng</span>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <SpeechModeButton active={speechMode === "natural"} icon={<Headphones size={17} />} label="Tự nhiên" onClick={() => setSpeechMode("natural")} />
              <SpeechModeButton active={speechMode === "slow"} icon={<Gauge size={17} />} label="Nghe chậm" onClick={() => setSpeechMode("slow")} />
              <SpeechModeButton active={speechMode === "repeat"} icon={<Repeat2 size={17} />} label="Lặp 2 lần" onClick={() => setSpeechMode("repeat")} />
            </div>

            <motion.div key={level} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-[36px] bg-white p-5 shadow-soft md:p-8">
              {level === 0 && (
                <div className="grid items-center gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="text-center">
                    <div className="text-9xl">👩‍🏫</div>
                    <div className="mt-3 inline-flex rounded-3xl bg-banana/30 px-5 py-3 text-xl font-black">Cô sẽ dẫn con qua từng màn.</div>
                  </div>
                  <div>
                    <p className="text-lg font-black text-skytoy">Nhiệm vụ rất dễ</p>
                    <h3 className="mt-2 text-4xl font-black">Bấm, nghe, trả lời, rồi qua màn.</h3>
                    <p className="mt-4 text-xl font-bold text-ink/65">Mỗi lần chỉ làm một việc. Không cần đọc nhiều.</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button onClick={() => speakEnglish(`Let's learn ${lesson.title}. Click and play.`, speechMode)}><Volume2 size={20} /> Nghe cô nói</Button>
                      <Button variant="secondary" onClick={() => setLevel(1)}><PlayCircle size={20} /> Bắt đầu màn 1</Button>
                    </div>
                  </div>
                </div>
              )}

              {level === 1 && currentWord && (
                <div className="text-center">
                  <p className="text-lg font-black text-coral">Màn 1 · Bấm thẻ từ</p>
                  <div className="mx-auto mt-5 max-w-xl rounded-[40px] bg-cloud p-8 ring-4 ring-banana/70">
                    <div className="text-9xl">{currentWord.image}</div>
                    <h3 className="mt-5 text-6xl font-black">{currentWord.word}</h3>
                    <p className="mt-2 text-2xl font-bold text-coral">{currentWord.meaning}</p>
                  </div>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Button onClick={() => speakEnglish(currentWord.word, speechMode)}><Volume2 size={22} /> Nghe từ</Button>
                    <Button variant="secondary" onClick={nextWord}><Star size={22} /> Con nghe xong</Button>
                  </div>
                  <p className="mt-4 font-black text-ink/55">Thẻ {Math.min(wordIndex + 1, gameWords.length)}/{gameWords.length}</p>
                </div>
              )}

              {level === 2 && currentTalk && (
                <div>
                  <p className="text-center text-lg font-black text-coral">Màn 2 · Hỏi đáp giao tiếp</p>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <SimpleActor active={["Teacher", "Parent", "Buddy"].includes(currentTalk.speaker)} icon="👩‍🏫" label="Cô hỏi" />
                    <SimpleActor active={["Student", "Child"].includes(currentTalk.speaker)} icon="🧒" label="Bé trả lời" />
                  </div>
                  <div className="mt-5 rounded-[32px] bg-cloud p-5 text-center">
                    <p className="text-sm font-black text-skytoy">Nghe từng lượt hỏi - đáp</p>
                    <p className="mt-2 text-4xl font-black">{currentTalk.english}</p>
                    <p className="mt-2 text-xl font-bold text-ink/60">{currentTalk.vietnamese}</p>
                  </div>
                  <div className="mt-6 flex justify-center">
                    <Button className="px-8 py-5 text-lg" onClick={nextTalk}><Volume2 size={24} /> Nghe lượt này</Button>
                  </div>
                  <p className="mt-4 text-center font-black text-ink/55">Lượt {Math.min(talkIndex + 1, talkLines.length)}/{talkLines.length}</p>
                </div>
              )}

              {level === 3 && currentSpeak && (
                <div className="text-center">
                  <p className="text-lg font-black text-coral">Màn 3 · Con nói lại</p>
                  <div className="mx-auto mt-5 max-w-3xl rounded-[36px] bg-cloud p-7">
                    <div className="text-8xl">🎤</div>
                    <p className="mt-5 text-5xl font-black">{currentSpeak.english}</p>
                    <p className="mt-3 text-xl font-bold text-ink/60">{currentSpeak.vietnamese}</p>
                  </div>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Button onClick={() => speakEnglish(currentSpeak.english, speechMode)}><Volume2 size={22} /> Nghe mẫu</Button>
                    <Button variant="secondary" onClick={nextSpeak}><Mic2 size={22} /> Con nói xong</Button>
                  </div>
                  <p className="mt-4 font-black text-ink/55">Câu {Math.min(speakIndex + 1, speakLines.length)}/{speakLines.length}</p>
                </div>
              )}

              {level === 4 && (
                <div className="confetti text-center">
                  <div className="text-9xl">🏆</div>
                  <h3 className="mt-4 text-5xl font-black">Qua màn rồi!</h3>
                  <p className="mt-3 text-xl font-bold text-ink/65">Bé đã nghe từ, nói chuyện và nói lại câu mẫu.</p>
                  <div className="mt-6 flex justify-center gap-2 text-banana">
                    {[0, 1, 2].map((item) => <Star key={item} size={46} fill="currentColor" />)}
                  </div>
                  <div className="mt-7 flex flex-wrap justify-center gap-3">
                    <Button onClick={() => setView("quiz")}><Pencil size={20} /> Làm quiz lấy sao</Button>
                    <Button variant="secondary" onClick={resetLevelGame}><Repeat2 size={20} /> Chơi lại</Button>
                    <Button variant="ghost" onClick={() => setView("roadmap")}>Roadmap</Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </Card>
      </div>
    </section>
  );
}

function SimpleActor({ active, icon, label }: { active: boolean; icon: string; label: string }) {
  return (
    <div className={`rounded-[32px] p-5 text-center transition ${active ? "bg-banana/35 ring-4 ring-banana" : "bg-cloud opacity-45 ring-2 ring-ink/10"}`}>
      <div className={`text-8xl ${active ? "character-button" : ""}`}>{icon}</div>
      <p className="mt-3 text-2xl font-black">{label}</p>
      <p className="mt-1 text-sm font-bold text-ink/60">{active ? "Đang tới lượt" : "Chờ lượt"}</p>
    </div>
  );
}

// Legacy layout kept as a fallback while the simpler level flow is being validated.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function GameLessonView({ lesson, setView, speechMode, setSpeechMode }: { lesson: Lesson; setView: (view: View) => void; speechMode: SpeechMode; setSpeechMode: (mode: SpeechMode) => void }) {
  const [stage, setStage] = useState<LessonGameStage>("classroom");
  const [teacherDone, setTeacherDone] = useState(false);
  const [studentDone, setStudentDone] = useState(false);
  const [heardWords, setHeardWords] = useState<Set<string>>(new Set());
  const [spokenPhrases, setSpokenPhrases] = useState<Set<string>>(new Set());
  const [roleplayIndex, setRoleplayIndex] = useState(0);
  const [bubble, setBubble] = useState("Bấm vào cô giáo để bắt đầu nhé!");

  const classroomTeacherLine = lesson.dialogues[0]?.lines.find((line) => ["Teacher", "Parent", "Buddy"].includes(line.speaker)) ?? lesson.dialogues[0]?.lines[0];
  const classroomStudentLine = lesson.dialogues[0]?.lines.find((line) => ["Student", "Child"].includes(line.speaker)) ?? lesson.dialogues[0]?.lines[1];
  const practicePhrases = lesson.phrases.slice(0, 5);
  const roleplayLines = lesson.dialogues[0]?.lines ?? [];
  const currentRoleplayLine = roleplayLines[Math.min(roleplayIndex, Math.max(roleplayLines.length - 1, 0))];
  const classDone = teacherDone && studentDone;
  const cardsDone = heardWords.size >= lesson.vocabulary.length;
  const speakDone = spokenPhrases.size >= practicePhrases.length;
  const roleplayDone = roleplayIndex >= roleplayLines.length;
  const finishedStages = [classDone, cardsDone, speakDone, roleplayDone].filter(Boolean).length;
  const currentStageIndex = gameStages.findIndex((item) => item.id === stage);
  const canGoNext = stage === "classroom" ? classDone : stage === "cards" ? cardsDone : stage === "speak" ? speakDone : roleplayDone;

  useEffect(() => {
    setStage("classroom");
    setTeacherDone(false);
    setStudentDone(false);
    setHeardWords(new Set());
    setSpokenPhrases(new Set());
    setRoleplayIndex(0);
    setBubble("Bấm vào cô giáo để bắt đầu nhé!");
  }, [lesson.id]);

  function goNextStage() {
    const next = gameStages[currentStageIndex + 1];
    if (next) {
      setStage(next.id);
      setBubble(next.id === "cards" ? "Bấm từng thẻ từ để nghe và thu sao." : next.id === "speak" ? "Bấm loa, nói theo, rồi bấm Con đã nói xong." : "Bấm đúng nhân vật đang sáng để đóng vai.");
      return;
    }
    setView("quiz");
  }

  function playTeacher() {
    if (!classroomTeacherLine) return;
    speakEnglish(classroomTeacherLine.english, speechMode);
    setTeacherDone(true);
    setBubble(classroomTeacherLine.vietnamese);
  }

  function playStudent() {
    if (!classroomStudentLine) return;
    speakEnglish(classroomStudentLine.english, speechMode);
    setStudentDone(true);
    setBubble(classroomStudentLine.vietnamese);
  }

  function collectWord(wordId: string, text: string) {
    speakEnglish(text, speechMode);
    setHeardWords((old) => new Set(old).add(wordId));
    setBubble(`Tốt lắm! Con vừa thu thập từ "${text}".`);
  }

  function markPhraseDone(english: string) {
    speakEnglish(english, speechMode);
    setSpokenPhrases((old) => new Set(old).add(english));
    setBubble("Giỏi lắm! Câu này đã hoàn thành.");
  }

  function playRoleplayLine() {
    if (!currentRoleplayLine || roleplayDone) return;
    speakEnglish(currentRoleplayLine.english, speechMode);
    setBubble(currentRoleplayLine.vietnamese);
    setRoleplayIndex((value) => value + 1);
  }

  return (
    <section className="py-8">
      <Card className="overflow-hidden bg-white/95 p-0">
        <div className="game-stage-bg p-5 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-black text-coral">Bài {lesson.order} · Game tự học</p>
              <h2 className="mt-2 text-4xl font-black md:text-5xl">{lesson.image} {lesson.title}</h2>
              <p className="mt-3 max-w-2xl text-lg font-semibold text-ink/70">{lesson.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => speakEnglish(lesson.title, speechMode)}><Volume2 size={18} /> Nghe chủ đề</Button>
              <Button variant="ghost" onClick={() => setView("roadmap")}>Roadmap</Button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <SpeechModeButton active={speechMode === "natural"} icon={<Headphones size={17} />} label="Tự nhiên" onClick={() => setSpeechMode("natural")} />
            <SpeechModeButton active={speechMode === "slow"} icon={<Gauge size={17} />} label="Nghe chậm" onClick={() => setSpeechMode("slow")} />
            <SpeechModeButton active={speechMode === "repeat"} icon={<Repeat2 size={17} />} label="Lặp 2 lần" onClick={() => setSpeechMode("repeat")} />
          </div>

          <div className="mt-6 rounded-[28px] bg-white/85 p-4 ring-2 ring-white/70">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-ink/50">Hành trình hôm nay</p>
                <p className="text-2xl font-black">{finishedStages}/4 chặng đã xong</p>
              </div>
              <div className="flex gap-1 text-banana">
                {gameStages.map((item, index) => (
                  <Star key={item.id} size={30} fill={index < finishedStages ? "currentColor" : "none"} />
                ))}
              </div>
            </div>
            <div className="mt-4 grid gap-2 lg:grid-cols-4">
              {gameStages.map((item, index) => {
                const active = item.id === stage;
                const done = index < finishedStages;
                return (
                  <button key={item.id} className={`rounded-2xl px-4 py-3 text-left transition ${active ? "bg-ink text-white" : done ? "bg-leaf/25 text-ink" : "bg-cloud text-ink/70 hover:bg-banana/25"}`} onClick={() => setStage(item.id)}>
                    <span className="block text-sm font-black">{done ? "Đã xong" : `Chặng ${index + 1}`}</span>
                    <span className="mt-1 block font-black">{item.title}</span>
                    <span className="mt-1 block text-xs font-bold opacity-70">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_0.42fr]">
            <motion.div key={stage} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-[32px] bg-white p-5 shadow-soft">
              {stage === "classroom" && (
                <div>
                  <StageTitle title="Chặng 1: Bấm nhân vật để nghe đối thoại" subtitle="Bấm cô giáo trước, rồi bấm học sinh để nghe câu trả lời." />
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <CharacterButton role="teacher" title="Cô giáo hỏi" text={classroomTeacherLine?.english ?? "Let's start!"} done={teacherDone} onClick={playTeacher} />
                    <CharacterButton role="student" title="Học sinh trả lời" text={classroomStudentLine?.english ?? "I am ready."} done={studentDone} onClick={playStudent} />
                  </div>
                  <Bubble text={bubble} />
                </div>
              )}

              {stage === "cards" && (
                <div>
                  <StageTitle title="Chặng 2: Săn đủ thẻ từ" subtitle="Mỗi thẻ là một lần nghe. Bấm đủ 6 thẻ để mở chặng nói." />
                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {lesson.vocabulary.map((item) => {
                      const done = heardWords.has(item.id);
                      return (
                        <button key={item.id} className={`group min-h-44 rounded-3xl p-4 text-left transition hover:-translate-y-1 ${done ? "bg-leaf/25 ring-2 ring-leaf" : "bg-cloud ring-2 ring-ink/10 hover:bg-banana/25"}`} onClick={() => collectWord(item.id, item.word)}>
                          <span className="block text-5xl transition group-hover:scale-110">{item.image}</span>
                          <span className="mt-4 flex items-center gap-2 text-2xl font-black"><Volume2 size={19} /> {item.word}</span>
                          <span className="mt-1 block font-bold text-coral">{item.meaning}</span>
                          <span className="mt-3 block text-sm font-semibold text-ink/60">{done ? "Đã thu thập sao" : "Bấm để nghe"}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {stage === "speak" && (
                <div>
                  <StageTitle title="Chặng 3: Nói theo mẫu" subtitle="Bấm loa để nghe, bé nói theo, rồi bấm Con đã nói xong." />
                  <div className="mt-5 space-y-3">
                    {practicePhrases.map((phrase, index) => {
                      const done = spokenPhrases.has(phrase.english);
                      return (
                        <div key={phrase.english} className={`grid gap-3 rounded-3xl p-4 md:grid-cols-[auto_1fr_auto] md:items-center ${done ? "bg-leaf/20" : "bg-cloud"}`}>
                          <span className="flex size-12 items-center justify-center rounded-2xl bg-white text-lg font-black">{index + 1}</span>
                          <button className="text-left" onClick={() => speakEnglish(phrase.english, speechMode)}>
                            <span className="flex items-center gap-2 text-xl font-black"><Volume2 size={18} /> {phrase.english}</span>
                            <span className="mt-1 block font-semibold text-ink/60">{phrase.vietnamese}</span>
                          </button>
                          <Button variant={done ? "secondary" : "primary"} className="py-2" onClick={() => markPhraseDone(phrase.english)}>
                            {done ? <CheckCircle2 size={18} /> : <Mic2 size={18} />} {done ? "Đã nói" : "Con đã nói xong"}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {stage === "roleplay" && (
                <div>
                  <StageTitle title="Chặng 4: Đóng vai giáo viên - học sinh" subtitle="Nhân vật nào đang sáng thì bấm nhân vật đó để nghe câu tiếp theo." />
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <CharacterButton role="teacher" title="Vai cô giáo" text="Bấm khi tới lượt cô giáo" done={roleplayDone} active={!roleplayDone && !!currentRoleplayLine && ["Teacher", "Parent", "Buddy"].includes(currentRoleplayLine.speaker)} onClick={playRoleplayLine} />
                    <CharacterButton role="student" title="Vai học sinh" text="Bấm khi tới lượt học sinh" done={roleplayDone} active={!roleplayDone && !!currentRoleplayLine && ["Student", "Child"].includes(currentRoleplayLine.speaker)} onClick={playRoleplayLine} />
                  </div>
                  <div className="mt-5 rounded-3xl bg-cloud p-4">
                    <p className="font-black text-coral">{roleplayDone ? "Hoàn thành hội thoại!" : `Lượt ${Math.min(roleplayIndex + 1, roleplayLines.length)}/${roleplayLines.length}: ${currentRoleplayLine?.speaker}`}</p>
                    <p className="mt-2 text-2xl font-black">{roleplayDone ? "Great job! Time for quiz." : currentRoleplayLine?.english}</p>
                    <p className="mt-1 font-semibold text-ink/60">{bubble}</p>
                  </div>
                </div>
              )}
            </motion.div>

            <aside className="space-y-4">
              <Card className="bg-ink text-white">
                <div className="flex items-center gap-3">
                  <Mic2 className="text-banana" size={30} />
                  <div>
                    <h3 className="text-2xl font-black">Nhiệm vụ</h3>
                    <p className="font-semibold text-white/65">Hoàn thành từng chặng để lấy sao.</p>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {lesson.routine.map((step, index) => (
                    <div key={step.title} className="rounded-2xl bg-white/10 p-3">
                      <p className="font-black text-banana">{gameStages[index]?.title ?? step.title}</p>
                      <p className="mt-1 text-sm font-semibold text-white/70">{step.description}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-white">
                <h3 className="text-xl font-black">Video chủ đề</h3>
                <div className="mt-3 overflow-hidden rounded-2xl bg-ink">
                  <iframe
                    className="aspect-video w-full"
                    src={lesson.video}
                    title={lesson.videoTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <p className="mt-3 text-sm font-bold text-ink/60">{lesson.videoTitle}</p>
              </Card>

              <div className="flex flex-col gap-3">
                <Button disabled={!canGoNext} onClick={goNextStage}>{currentStageIndex === gameStages.length - 1 ? "Làm quiz" : "Qua chặng tiếp theo"} <Pencil size={18} /></Button>
                <Button variant="ghost" onClick={() => setView("quiz")}>Bỏ qua và làm quiz</Button>
              </div>
            </aside>
          </div>
        </div>
      </Card>
    </section>
  );
}

function StageTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <p className="font-black text-skytoy">Nhiệm vụ đang chơi</p>
      <h3 className="mt-1 text-3xl font-black">{title}</h3>
      <p className="mt-2 font-semibold text-ink/60">{subtitle}</p>
    </div>
  );
}

function Bubble({ text }: { text: string }) {
  return (
    <div className="mt-5 rounded-3xl bg-banana/25 p-4 ring-2 ring-banana/60">
      <p className="text-sm font-black text-coral">Gợi ý</p>
      <p className="mt-1 text-xl font-black">{text}</p>
    </div>
  );
}

function CharacterButton({ role, title, text, done, active = true, onClick }: { role: "teacher" | "student"; title: string; text: string; done: boolean; active?: boolean; onClick: () => void }) {
  return (
    <button
      className={`character-button min-h-72 rounded-[32px] p-5 text-left transition ${active ? "ring-4 ring-banana hover:-translate-y-1" : "opacity-55 ring-2 ring-ink/10"} ${done ? "bg-leaf/25" : "bg-cloud"}`}
      onClick={onClick}
      disabled={!active}
    >
      <span className="mx-auto flex size-28 items-center justify-center rounded-[32px] bg-white text-7xl shadow-soft">{role === "teacher" ? "👩‍🏫" : "🧒"}</span>
      <span className="mt-5 block text-center text-2xl font-black">{title}</span>
      <span className="mt-2 block text-center text-lg font-bold text-ink/65">{text}</span>
      <span className={`mt-5 flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black ${done ? "bg-leaf text-ink" : "bg-white text-skytoy"}`}>
        {done ? <CheckCircle2 size={18} /> : <Volume2 size={18} />} {done ? "Đã hoàn thành" : "Bấm để nghe"}
      </span>
    </button>
  );
}

// Legacy layout kept as a fallback while the new game flow is being validated.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LessonView({ lesson, setView, speechMode, setSpeechMode }: { lesson: Lesson; setView: (view: View) => void; speechMode: SpeechMode; setSpeechMode: (mode: SpeechMode) => void }) {
  return (
    <section className="grid gap-6 py-8 xl:grid-cols-[1.05fr_0.95fr]">
      <Card className="bg-sky-50">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-black text-skytoy">Bài {lesson.order}</p>
            <h2 className="mt-2 text-4xl font-black">{lesson.image} {lesson.title}</h2>
            <p className="mt-3 text-lg font-semibold text-ink/70">{lesson.description}</p>
          </div>
          <Button variant="secondary" onClick={() => speakEnglish(lesson.title, speechMode)}><Volume2 size={18} /> Nghe chủ đề</Button>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <SpeechModeButton active={speechMode === "natural"} icon={<Headphones size={17} />} label="Tự nhiên" onClick={() => setSpeechMode("natural")} />
          <SpeechModeButton active={speechMode === "slow"} icon={<Gauge size={17} />} label="Nghe chậm" onClick={() => setSpeechMode("slow")} />
          <SpeechModeButton active={speechMode === "repeat"} icon={<Repeat2 size={17} />} label="Lặp 2 lần" onClick={() => setSpeechMode("repeat")} />
        </div>
        <div className="mt-6 overflow-hidden rounded-[28px] bg-white p-3 shadow-inner">
          <div className="aspect-video overflow-hidden rounded-[22px] bg-ink">
            <iframe
              className="h-full w-full"
              src={lesson.video}
              title={lesson.videoTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <p className="mt-3 px-2 text-sm font-bold text-ink/60">Video: {lesson.videoTitle}</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3"><Button onClick={() => setView("quiz")}>Làm quiz <Pencil size={18} /></Button><Button variant="ghost" onClick={() => setView("roadmap")}>Quay lại roadmap</Button></div>
      </Card>
      <div className="space-y-4">
        <Card className="bg-ink text-white">
          <div className="flex items-center gap-3">
            <Mic2 className="text-banana" size={28} />
            <div>
              <h3 className="text-2xl font-black">Quy trình học 12 phút</h3>
              <p className="font-semibold text-white/65">Nghe ngắn, nhắc lại nhiều, rồi nói trong tình huống.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {lesson.routine.map((step) => (
              <div key={step.title} className="rounded-2xl bg-white/10 p-4">
                <p className="font-black text-banana">{step.title}</p>
                <p className="mt-1 text-sm font-semibold text-white/70">{step.description}</p>
              </div>
            ))}
          </div>
        </Card>
        {lesson.vocabulary.map((item) => (
          <Card key={item.id} className="flex gap-4">
            <button className="flex size-20 shrink-0 items-center justify-center rounded-3xl bg-banana/60 text-4xl transition hover:scale-105" onClick={() => speakEnglish(item.word, speechMode)} title={`Nghe từ ${item.word}`}>{item.image}</button>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-2xl font-black">{item.word}</h3>
                <button className="inline-flex items-center gap-1 rounded-full bg-skytoy px-3 py-1 text-xs font-black text-white" onClick={() => speakEnglish(item.word, speechMode)}><Volume2 size={14} /> Nghe</button>
              </div>
              <p className="font-bold text-coral">{item.meaning}</p>
              <p className="mt-1 font-semibold text-ink/65">{item.example}</p>
              <button className="mt-2 text-xs font-black text-skytoy underline" onClick={() => speakEnglish(item.example, speechMode)}>Nghe câu ví dụ</button>
            </div>
          </Card>
        ))}
      </div>
      <Card className="xl:col-span-2">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-2xl font-black">Câu mẫu luyện nói</h3>
            <p className="mt-1 font-semibold text-ink/60">Bấm từng câu, nghe chậm rồi cho bé nhại lại theo nhịp.</p>
          </div>
          <span className="rounded-full bg-leaf/20 px-4 py-2 text-sm font-black text-ink">{lesson.phrases.length} câu mẫu</span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {lesson.phrases.map((phrase) => (
            <button key={phrase.english} className="rounded-2xl bg-cloud p-4 text-left transition hover:bg-banana/30" onClick={() => speakEnglish(phrase.english, speechMode)}>
              <span className="flex items-center gap-2 text-lg font-black"><Volume2 size={18} /> {phrase.english}</span>
              <span className="mt-1 block font-semibold text-ink/60">{phrase.vietnamese}</span>
            </button>
          ))}
        </div>
      </Card>
      <Card className="xl:col-span-2">
        <h3 className="text-2xl font-black">Câu thoại theo tình huống</h3>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {lesson.dialogues.map((dialogue) => (
            <div key={dialogue.situation} className="rounded-2xl bg-white p-4 ring-2 ring-ink/10">
              <p className="font-black text-coral">{dialogue.situation}</p>
              <div className="mt-3 space-y-3">
                {dialogue.lines.map((line, index) => (
                  <button key={`${line.speaker}-${index}`} className="w-full rounded-2xl bg-cloud px-4 py-3 text-left transition hover:bg-sky-50" onClick={() => speakEnglish(line.english, speechMode)}>
                    <span className="block text-xs font-black text-ink/50">{line.speaker}</span>
                    <span className="flex items-center gap-2 font-black"><Volume2 size={16} /> {line.english}</span>
                    <span className="block text-sm font-semibold text-ink/60">{line.vietnamese}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

function QuizView({ lesson, answers, setAnswers, submitQuiz }: { lesson: Lesson; answers: Record<string, string>; setAnswers: (answers: Record<string, string>) => void; submitQuiz: () => void }) {
  const ready = lesson.quiz.every((question) => answers[question.id]);
  return (
    <section className="mx-auto max-w-5xl py-8">
      <div className="mb-5"><p className="font-black text-coral">Quiz 5 câu</p><h2 className="text-4xl font-black">{lesson.title}</h2></div>
      <div className="space-y-4">
        {lesson.quiz.map((question, index) => (
          <Card key={question.id}>
            <div className="mb-4 flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-2xl bg-skytoy font-black text-white">{index + 1}</span><h3 className="text-lg font-black">{question.prompt}</h3></div>
            <div className="grid gap-3 md:grid-cols-2">
              {question.options.map((option) => {
                const selected = answers[question.id] === option;
                return <button key={option} className={`rounded-2xl border-2 px-4 py-4 text-left font-bold transition ${selected ? "border-leaf bg-leaf/25" : "border-ink/10 bg-white hover:border-skytoy hover:bg-sky-50"}`} onClick={() => setAnswers({ ...answers, [question.id]: option })}>{selected ? <CheckCircle2 className="mr-2 inline text-leaf" size={18} /> : null}{option}</button>;
              })}
            </div>
          </Card>
        ))}
      </div>
      <Button className="mt-6 w-full" disabled={!ready} onClick={submitQuiz}>Nộp bài và nhận sao</Button>
    </section>
  );
}

function ResultView({ score, lesson, setView }: { score: number; lesson: Lesson; setView: (view: View) => void }) {
  const stars = starsFromScore(score);
  return (
    <section className="mx-auto max-w-3xl py-10">
      <Card className="confetti text-center">
        <div className="text-7xl">{score >= 60 ? "🎉" : "💪"}</div>
        <h2 className="mt-4 text-4xl font-black">{score >= 60 ? "Chúc mừng bé!" : "Bé thử thêm lần nữa nhé!"}</h2>
        <p className="mt-2 text-xl font-bold">{lesson.title}: {score}/100 điểm</p>
        <div className="mt-5 flex justify-center gap-2 text-banana">{Array.from({ length: 3 }).map((_, index) => <Star key={index} size={42} fill={index < stars ? "currentColor" : "none"} />)}</div>
        <div className="mt-7 flex flex-wrap justify-center gap-3"><Button onClick={() => setView("roadmap")}>Về roadmap</Button><Button variant="secondary" onClick={() => setView("dashboard")}>Xem dashboard</Button><Button variant="ghost" onClick={() => setView("quiz")}>Làm lại quiz</Button></div>
      </Card>
    </section>
  );
}

function DashboardView({ student, completedCount, totalStars, averageScore, nextLesson, progress, openLesson }: { student: StudentProfile | null; completedCount: number; totalStars: number; averageScore: number; nextLesson: Lesson; progress: ProgressRecord[]; openLesson: (lesson: Lesson) => void }) {
  return (
    <section className="py-8">
      <div className="mb-6"><p className="font-black text-coral">Dashboard phụ huynh</p><h2 className="text-4xl font-black">{student ? `Tiến độ của ${student.name}` : "Chưa có hồ sơ bé"}</h2></div>
      <div className="grid gap-4 md:grid-cols-4"><Metric label="Điểm TB" value={`${averageScore}`} /><Metric label="Số bài" value={`${completedCount}`} /><Metric label="Số sao" value={`${totalStars}`} /><Metric label="Bài tiếp theo" value={nextLesson.title} /></div>
      <Card className="mt-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-2xl font-black">Gợi ý học tiếp</h3><p className="font-semibold text-ink/65">{nextLesson.description}</p></div><Button onClick={() => openLesson(nextLesson)}>Mở bài tiếp theo</Button></div></Card>
      <div className="mt-6 grid gap-3">
        {progress.length === 0 ? <Card className="text-center font-bold text-ink/65">Chưa có dữ liệu tiến độ. Bé làm quiz xong sẽ hiện ở đây.</Card> : progress.map((item) => {
          const lesson = lessons.find((entry) => entry.id === item.lessonId);
          return <Card key={item.lessonId} className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto] md:items-center"><strong>{lesson?.title}</strong><span>{item.score} điểm</span><span>{item.stars} sao</span><span className="text-sm font-semibold text-ink/60">{formatDate(item.lastStudy)}</span></Card>;
        })}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <Card className="bg-white/90"><p className="text-sm font-black text-ink/55">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></Card>;
}

function AdminView({ progress, openLesson }: { progress: ProgressRecord[]; openLesson: (lesson: Lesson) => void }) {
  return (
    <section className="py-8">
      <div className="mb-6"><p className="font-black text-coral">Admin cơ bản</p><h2 className="text-4xl font-black">Quản lý lesson, từ vựng, quiz</h2><p className="mt-2 font-semibold text-ink/65">MVP dùng JSON seed, thiết kế sẵn để mở rộng CRUD thật bằng Supabase.</p></div>
      <div className="grid gap-4 lg:grid-cols-[1fr_0.75fr]">
        <Card>
          <h3 className="mb-4 text-2xl font-black">Danh sách 40 bài học</h3>
          <div className="max-h-[560px] space-y-3 overflow-auto pr-2">
            {lessons.map((lesson) => <div key={lesson.id} className="grid gap-3 rounded-2xl bg-cloud p-4 md:grid-cols-[auto_1fr_auto] md:items-center"><span className="rounded-xl bg-white px-3 py-2 text-sm font-black">Lớp {lesson.grade}</span><div><strong>{lesson.title}</strong><p className="text-sm font-semibold text-ink/60">{lesson.vocabulary.length} từ vựng · {lesson.quiz.length} câu quiz</p></div><Button variant="ghost" className="py-2" onClick={() => openLesson(lesson)}>Xem</Button></div>)}
          </div>
        </Card>
        <Card className="bg-ink text-white">
          <GraduationCap size={42} />
          <h3 className="mt-4 text-2xl font-black">Học sinh & tiến độ</h3>
          <p className="mt-2 font-semibold text-white/70">Có {progress.length} bài đã phát sinh dữ liệu tiến độ trên trình duyệt này.</p>
          <div className="mt-5 space-y-3">{["Lesson CRUD", "Vocabulary CRUD", "Quiz CRUD", "Video URL", "Audio", "Image"].map((item) => <div key={item} className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 font-bold">{item}<span className="rounded-full bg-banana px-3 py-1 text-xs text-ink">Seed ready</span></div>)}</div>
        </Card>
      </div>
    </section>
  );
}
