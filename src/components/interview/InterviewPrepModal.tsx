import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  BookOpen,
  Target,
  Layers,
  ChevronDown,
  ChevronUp,
  Brain,
  Award,
  Terminal,
  Mic,
  MicOff,
  Radio,
  Play,
  RotateCcw,
  Volume2,
  AlertTriangle,
  Lightbulb,
  Send,
  MessageSquare,
  ThumbsUp,
  ListOrdered,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import {
  Job,
  ResumeVersion,
  InterviewPrepPack,
  InterviewQuestion,
  InterviewAnswerFeedback,
} from '../../types';
import { fetchInterviewPrep, evaluateInterviewAnswer } from '../../api';

interface InterviewPrepModalProps {
  job: Job | null;
  resumes: ResumeVersion[];
  onClose: () => void;
}

export const InterviewPrepModal: React.FC<InterviewPrepModalProps> = ({
  job,
  resumes,
  onClose,
}) => {
  if (!job) return null;

  // Active Tab
  const [activeTab, setActiveTab] = useState<'study' | 'mock'>('mock');

  // Prep pack state
  const [loading, setLoading] = useState(true);
  const [prepPack, setPrepPack] = useState<InterviewPrepPack | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [hiddenAnswers, setHiddenAnswers] = useState<Set<string>>(new Set());
  const [copiedAll, setCopiedAll] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<string>(
    resumes.find((r) => r.jobId === job.jobId)?.id || resumes[0]?.id || ''
  );

  // Mock Interview Mode States
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<InterviewAnswerFeedback | null>(null);
  const [evalHistory, setEvalHistory] = useState<{ [qId: string]: InterviewAnswerFeedback }>({});

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  const loadPrep = async (forceRefresh = false) => {
    try {
      setLoading(true);
      const data = await fetchInterviewPrep(job.jobId, selectedResumeId, forceRefresh);
      setPrepPack(data);
      if (data.questions.length > 0) {
        setExpandedQuestionId(data.questions[0].id);
      }
    } catch (err: any) {
      console.error('Error fetching interview prep:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrep();
  }, [job.jobId, selectedResumeId]);

  // Handle Recording Timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const startRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Default to Indian English, compatible with EN

      recognition.onstart = () => {
        setIsRecording(true);
        setRecordingSeconds(0);
        setInterimText('');
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            currentFinal += event.results[i][0].transcript + ' ';
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (currentFinal) {
          setTranscript((prev) => (prev ? `${prev.trim()} ${currentFinal.trim()}` : currentFinal.trim()));
        }
        setInterimText(currentInterim);
      };

      recognition.onerror = (event: any) => {
        console.warn('[Web Speech Error]:', event.error);
        if (event.error === 'not-allowed') {
          alert('Microphone access was denied. Please allow microphone permissions or type your answer manually.');
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setInterimText('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      console.error('Could not start speech recognition:', e);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  const handleEvaluate = async () => {
    if (!currentQuestion) return;
    const answerToEval = transcript.trim();
    if (!answerToEval) {
      alert('Please speak or type your answer before submitting for AI feedback.');
      return;
    }

    if (isRecording) {
      stopRecording();
    }

    try {
      setEvaluating(true);
      const result = await evaluateInterviewAnswer(job.jobId, currentQuestion, answerToEval);
      setFeedback(result);
      setEvalHistory((prev) => ({
        ...prev,
        [currentQuestion.id]: result,
      }));
    } catch (err: any) {
      alert(err.message || 'Evaluation failed. Please try again.');
    } finally {
      setEvaluating(false);
    }
  };

  const handleResetAnswer = () => {
    stopRecording();
    setTranscript('');
    setInterimText('');
    setRecordingSeconds(0);
    setFeedback(null);
  };

  const toggleHideAnswer = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(hiddenAnswers);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setHiddenAnswers(next);
  };

  const handleCopyAll = () => {
    if (!prepPack) return;
    const text = `# Technical Interview Prep — ${prepPack.jobTitle} at ${prepPack.company}
Generated: ${new Date(prepPack.generatedAt).toLocaleDateString()}

Focus Areas: ${prepPack.technicalFocusAreas.join(', ')}

${prepPack.questions
  .map(
    (q, i) => `Q${i + 1} [${q.category} • ${q.difficulty}]:
${q.question}

Why Interviewers Ask This:
${q.whyAsked}

Your Project Angle:
${q.candidateAngle}

Key Concepts: ${q.keyConceptsToCover.join(', ')}

Structured Answer Outline:
${q.sampleAnswerOutline}
----------------------------------------`
  )
  .join('\n\n')}
`;
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const categories = prepPack
    ? ['ALL', ...Array.from(new Set(prepPack.questions.map((q) => q.category)))]
    : ['ALL'];

  const filteredQuestions = prepPack
    ? prepPack.questions.filter(
        (q) => selectedCategory === 'ALL' || q.category === selectedCategory
      )
    : [];

  const currentQuestion: InterviewQuestion | undefined = prepPack?.questions[currentQuestionIndex];

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Hard':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Exceptional':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Strong':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'Needs Improvement':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 md:p-6 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-7 shadow-2xl text-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                <Brain className="h-3.5 w-3.5" /> Technical Interview Engine
              </span>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                {prepPack?.questions.length || '6-9'} Targeted Questions
              </span>
            </div>
            <h2 className="mt-2 text-xl font-bold text-white">
              {job.company} — {job.canonicalTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Role-specific questions grounded in {job.company}&apos;s engineering challenges and your verified project portfolio.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="mt-4 flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('mock')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                activeTab === 'mock'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Mic className="h-3.5 w-3.5" />
              <span>Live Mock Interview (Speech AI)</span>
              <span className="rounded bg-white/20 px-1.5 py-0.2 text-[10px] font-bold">
                Interactive
              </span>
            </button>

            <button
              onClick={() => setActiveTab('study')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                activeTab === 'study'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Question Bank & Model Outlines</span>
            </button>
          </div>

          {prepPack && (
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => loadPrep(true)}
                disabled={loading}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-300"
              >
                <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>
              <button
                onClick={handleCopyAll}
                className="flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-slate-700"
              >
                {copiedAll ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedAll ? 'Copied' : 'Export All'}</span>
              </button>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* MODE 1: LIVE MOCK INTERVIEW SIMULATOR (WEB SPEECH API) */}
        {/* ========================================================================= */}
        {activeTab === 'mock' && prepPack && currentQuestion && (
          <div className="mt-5 space-y-5 animate-in fade-in duration-150">
            {/* Question Selector & Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-300">
                  Question {currentQuestionIndex + 1} of {prepPack.questions.length}:
                </span>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300 border border-slate-700">
                  {currentQuestion.category}
                </span>
                <span
                  className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${getDifficultyBadge(
                    currentQuestion.difficulty
                  )}`}
                >
                  {currentQuestion.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    handleResetAnswer();
                    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
                  }}
                  disabled={currentQuestionIndex === 0}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-30"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
                <select
                  value={currentQuestionIndex}
                  onChange={(e) => {
                    handleResetAnswer();
                    setCurrentQuestionIndex(Number(e.target.value));
                  }}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-slate-200 focus:outline-none"
                >
                  {prepPack.questions.map((q, idx) => (
                    <option key={q.id} value={idx}>
                      Q{idx + 1}: {q.category} ({q.difficulty})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    handleResetAnswer();
                    setCurrentQuestionIndex((prev) =>
                      Math.min(prepPack.questions.length - 1, prev + 1)
                    );
                  }}
                  disabled={currentQuestionIndex === prepPack.questions.length - 1}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-30"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Current Question Display Card */}
            <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 via-slate-900 to-slate-950 p-6 space-y-3 shadow-md">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                <Brain className="h-4 w-4" />
                <span>Interviewer Prompt (Technical Round at {job.company})</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white leading-relaxed">
                &quot;{currentQuestion.question}&quot;
              </h3>
              <div className="text-xs text-slate-400 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="font-semibold text-slate-300">Context: </span>
                {currentQuestion.whyAsked}
              </div>
            </div>

            {/* Speech Recorder & Answer Console */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-slate-200 flex items-center gap-1.5">
                    <Radio className={`h-4 w-4 ${isRecording ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`} />
                    <span>Your Spoken Answer</span>
                  </span>
                  {isRecording && (
                    <span className="rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 px-2.5 py-0.5 text-[10px] font-mono font-bold animate-pulse">
                      REC {formatTimer(recordingSeconds)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-4 py-2 font-semibold text-white shadow-lg shadow-rose-600/25 hover:from-rose-500 hover:to-pink-500 transition"
                    >
                      <Mic className="h-4 w-4" />
                      <span>Start Speaking (Web Speech)</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 font-semibold text-slate-200 hover:bg-slate-700 transition"
                    >
                      <MicOff className="h-4 w-4 text-rose-400" />
                      <span>Pause Recording</span>
                    </button>
                  )}

                  {(transcript || isRecording) && (
                    <button
                      onClick={handleResetAnswer}
                      className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-slate-400 hover:text-white"
                      title="Clear & Restart"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Web Speech Warning if unsupported */}
              {!speechSupported && (
                <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 p-2.5 text-xs text-amber-300">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                  <span>
                    Your browser does not support the Web Speech API recognition interface. You can type or paste your response in the box below to receive real-time AI evaluation!
                  </span>
                </div>
              )}

              {/* Live Audio Visualizer / Pulse Bar */}
              {isRecording && (
                <div className="flex items-center justify-center gap-1.5 py-3">
                  <div className="h-4 w-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-8 w-1 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-6 w-1 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <div className="h-10 w-1 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
                  <div className="h-7 w-1 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '250ms' }} />
                  <div className="h-3 w-1 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '350ms' }} />
                  <span className="text-[11px] text-slate-400 ml-2 font-mono">
                    Listening for answer... Speak clearly into your mic
                  </span>
                </div>
              )}

              {/* Real-time Transcription Area (Editable) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Transcription (feel free to edit or correct misrecognized keywords):</span>
                  <span>{transcript.trim().split(/\s+/).filter(Boolean).length} words</span>
                </div>
                <div className="relative">
                  <textarea
                    rows={4}
                    value={transcript + (interimText ? ` ${interimText}` : '')}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Click 'Start Speaking' and answer the question as if you are in the interview room. Your spoken words will transcribe here in real time..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 text-xs text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:outline-none leading-relaxed font-sans"
                  />
                  {interimText && (
                    <div className="absolute bottom-2 right-3 text-[10px] text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/30 animate-pulse">
                      Live Transcribing...
                    </div>
                  )}
                </div>
              </div>

              {/* Submit for AI Evaluation Button */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-slate-500">
                  Gemini 3.8 Flash assesses technical depth, architectural nuance, and project grounding.
                </div>

                <button
                  onClick={handleEvaluate}
                  disabled={evaluating || (!transcript.trim() && !interimText)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-500 transition disabled:opacity-40"
                >
                  <Sparkles className={`h-4 w-4 ${evaluating ? 'animate-spin' : ''}`} />
                  <span>{evaluating ? 'Analyzing Technical Depth...' : 'Evaluate My Answer'}</span>
                </button>
              </div>
            </div>

            {/* Real-time AI Evaluation Feedback Card */}
            {feedback && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 animate-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        AI Technical Screen Evaluation
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getTierColor(
                          feedback.performanceTier
                        )}`}
                      >
                        {feedback.performanceTier}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {feedback.clarityAndDepthAnalysis}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black text-indigo-400">
                      {feedback.score}/100
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Technical Score
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Strengths */}
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 space-y-2">
                    <h4 className="font-semibold text-xs text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ThumbsUp className="h-3.5 w-3.5" /> What You Handled Well
                    </h4>
                    <ul className="space-y-1.5 list-disc list-inside text-slate-300 text-[11px]">
                      {feedback.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Missed Concepts */}
                  <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-4 space-y-2">
                    <h4 className="font-semibold text-xs text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" /> Missed Technical Keywords
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {feedback.missedConcepts.map((mc, i) => (
                        <span
                          key={i}
                          className="rounded bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 text-[11px] text-rose-300"
                        >
                          {mc}
                        </span>
                      ))}
                      {feedback.missedConcepts.length === 0 && (
                        <span className="text-[11px] text-slate-400">
                          All expected architectural concepts were referenced!
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actionable Suggestions */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs space-y-2">
                  <h4 className="font-semibold text-xs text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="h-3.5 w-3.5" /> Improvement Suggestions for {job.company}
                  </h4>
                  <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                    {feedback.suggestions.map((sug, i) => (
                      <li key={i}>{sug}</li>
                    ))}
                  </ul>
                </div>

                {/* Polished Model Revision */}
                <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 text-xs space-y-2">
                  <h4 className="font-semibold text-xs text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-indigo-400" /> Polished Model Answer Grounded in Your Background
                  </h4>
                  <p className="text-slate-200 text-[11px] leading-relaxed italic bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                    &quot;{feedback.polishedSampleRevision}&quot;
                  </p>
                </div>

                {/* Next Steps Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handleResetAnswer}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Try This Question Again</span>
                  </button>

                  {currentQuestionIndex < prepPack.questions.length - 1 && (
                    <button
                      onClick={() => {
                        handleResetAnswer();
                        setCurrentQuestionIndex((prev) => prev + 1);
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 shadow"
                    >
                      <span>Next Question</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 2: STUDY & QUESTION BANK */}
        {/* ========================================================================= */}
        {activeTab === 'study' && (
          <div className="mt-5 space-y-5 animate-in fade-in duration-150">
            {/* Focus Areas & Match Highlights */}
            {prepPack && (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 text-indigo-400" />
                    Target Engineering Focus Areas
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {prepPack.technicalFocusAreas.map((area, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-[11px] text-indigo-300 font-medium"
                    >
                      {area}
                    </span>
                  ))}
                  {prepPack.matchHighlights.map((hl, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] text-emerald-300 font-medium"
                    >
                      ✓ {hl}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Category Filters */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-semibold text-slate-500 mr-1">Filter Domain:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  {cat === 'ALL' ? 'All Questions' : cat}
                </button>
              ))}
            </div>

            {/* Questions Accordion List */}
            <div className="space-y-3">
              {filteredQuestions.map((q, idx) => {
                const isExpanded = expandedQuestionId === q.id;
                const isAnswerHidden = hiddenAnswers.has(q.id);

                return (
                  <div
                    key={q.id}
                    className={`rounded-xl border transition ${
                      isExpanded
                        ? 'border-indigo-500/40 bg-slate-950/90 shadow-md'
                        : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                    }`}
                  >
                    {/* Card Header / Question Trigger */}
                    <div
                      onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                      className="p-4 cursor-pointer flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-indigo-400">
                            Q{idx + 1}
                          </span>
                          <span className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] text-slate-300 font-medium">
                            {q.category}
                          </span>
                          <span
                            className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${getDifficultyBadge(
                              q.difficulty
                            )}`}
                          >
                            {q.difficulty}
                          </span>
                        </div>

                        <div className="font-semibold text-sm text-slate-100 leading-snug">
                          {q.question}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (prepPack) {
                              const foundIdx = prepPack.questions.findIndex((item) => item.id === q.id);
                              if (foundIdx >= 0) setCurrentQuestionIndex(foundIdx);
                            }
                            setActiveTab('mock');
                          }}
                          className="flex items-center gap-1 rounded bg-indigo-600/20 border border-indigo-500/30 px-2 py-1 text-[11px] text-indigo-300 hover:bg-indigo-600/30 font-medium"
                          title="Practice speaking answer to this question"
                        >
                          <Mic className="h-3 w-3" />
                          <span>Practice</span>
                        </button>

                        <button
                          onClick={(e) => toggleHideAnswer(q.id, e)}
                          title="Self-Test: Hide/Show Answer"
                          className="rounded bg-slate-800 px-2 py-1 text-[10px] text-slate-400 hover:text-white"
                        >
                          {isAnswerHidden ? 'Show Answer' : 'Hide Answer'}
                        </button>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Preparation Content */}
                    {isExpanded && !isAnswerHidden && (
                      <div className="px-4 pb-4 pt-1 space-y-3.5 border-t border-slate-800/80 text-xs animate-in fade-in duration-100">
                        {/* Why Asked at Company */}
                        <div className="rounded-lg bg-slate-900/90 p-3 border border-slate-800">
                          <div className="font-semibold text-indigo-300 text-[11px] mb-1 flex items-center gap-1.5">
                            <HelpCircle className="h-3.5 w-3.5 text-indigo-400" />
                            Why Interviewers at {job.company} Ask This
                          </div>
                          <p className="text-slate-300 leading-relaxed text-[11px]">
                            {q.whyAsked}
                          </p>
                        </div>

                        {/* Candidate Best Project Angle */}
                        <div className="rounded-lg bg-emerald-950/20 p-3 border border-emerald-500/20">
                          <div className="font-semibold text-emerald-300 text-[11px] mb-1 flex items-center gap-1.5">
                            <Award className="h-3.5 w-3.5 text-emerald-400" />
                            Your Strongest Angle / Project to Highlight
                          </div>
                          <p className="text-slate-300 leading-relaxed text-[11px]">
                            {q.candidateAngle}
                          </p>
                        </div>

                        {/* Key Concepts to Cover */}
                        {q.keyConceptsToCover && q.keyConceptsToCover.length > 0 && (
                          <div>
                            <span className="text-[11px] font-semibold text-slate-400">
                              Key Architectural Concepts to Mention:
                            </span>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {q.keyConceptsToCover.map((concept, i) => (
                                <span
                                  key={i}
                                  className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] text-cyan-300"
                                >
                                  {concept}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Structured Answer Outline */}
                        <div className="rounded-lg bg-slate-900 p-3.5 border border-slate-800">
                          <div className="font-semibold text-cyan-300 text-[11px] mb-2 flex items-center gap-1.5">
                            <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                            Structured Answer Outline & Talking Points
                          </div>
                          <pre className="whitespace-pre-wrap font-sans text-slate-300 text-[11px] leading-relaxed">
                            {q.sampleAnswerOutline}
                          </pre>
                        </div>
                      </div>
                    )}

                    {isExpanded && isAnswerHidden && (
                      <div className="px-4 pb-4 pt-1 text-center py-6 border-t border-slate-800/80">
                        <p className="text-xs text-slate-400">
                          Answer is hidden for self-test practice mode. Try verbalizing your response, then reveal.
                        </p>
                        <button
                          onClick={(e) => toggleHideAnswer(q.id, e)}
                          className="mt-2 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                        >
                          Reveal Model Response & Talking Points
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="py-20 text-center space-y-3">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            <div className="text-xs font-semibold text-slate-300">
              Generating High-Yield Questions with Gemini 3.8 Flash...
            </div>
            <p className="text-[11px] text-slate-500">
              Synthesizing JD requirements with your verified Python, FastAPI, and GenAI projects
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            <span>Mock interview speech engine active • Web Speech API integration</span>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
          >
            Close Interview Studio
          </button>
        </div>
      </div>
    </div>
  );
};
