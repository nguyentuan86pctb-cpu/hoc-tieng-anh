export type Grade = 1 | 2;

export type VocabularyItem = {
  id: string;
  word: string;
  meaning: string;
  example: string;
  image: string;
  audio: string;
};

export type PracticePhrase = {
  english: string;
  vietnamese: string;
};

export type DialogueLine = {
  speaker: string;
  english: string;
  vietnamese: string;
};

export type DialogueScenario = {
  situation: string;
  lines: DialogueLine[];
};

export type LessonRoutineStep = {
  title: string;
  description: string;
};

export type QuizQuestion = {
  id: string;
  type: "image" | "listen" | "meaning" | "word";
  prompt: string;
  options: string[];
  answer: string;
};

export type Lesson = {
  id: string;
  grade: Grade;
  order: number;
  title: string;
  description: string;
  image: string;
  audio: string;
  video: string;
  videoTitle: string;
  vocabulary: VocabularyItem[];
  phrases: PracticePhrase[];
  dialogues: DialogueScenario[];
  routine: LessonRoutineStep[];
  quiz: QuizQuestion[];
};

export type StudentProfile = {
  name: string;
  age: number;
  grade: Grade;
  avatar: string;
};

export type ProgressRecord = {
  lessonId: string;
  score: number;
  stars: number;
  attempts: number;
  completed: boolean;
  lastStudy: string;
};
