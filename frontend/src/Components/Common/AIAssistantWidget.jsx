import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./AIAssistantWidget.css";

const baseUrl = "http://127.0.0.1:8000/api";

const NAVIGATION_PATTERNS = [
  { route: "/", aliases: ["home", "main", "landing page"], roles: ["student", "teacher"] },
  { route: "/user-login", aliases: ["user login", "student login"], roles: ["student", "teacher"] },
  { route: "/user-register", aliases: ["user register", "student register", "signup"], roles: ["student", "teacher"] },
  { route: "/teacher-login", aliases: ["teacher login", "instructor login"], roles: ["student", "teacher"] },
  { route: "/teacher-register", aliases: ["teacher register", "instructor register"], roles: ["student", "teacher"] },
  { route: "/all-courses", aliases: ["all courses", "course catalog", "course list"], roles: ["student", "teacher"] },
  { route: "/popular-courses", aliases: ["popular courses", "trending courses"], roles: ["student", "teacher"] },
  { route: "/aboutus", aliases: ["about", "about us"], roles: ["student", "teacher"] },
  { route: "/policy", aliases: ["policy", "privacy policy"], roles: ["student", "teacher"] },
  { route: "/category", aliases: ["category", "categories"], roles: ["student", "teacher"] },
  { route: "/work-shop", aliases: ["workshop", "work shop"], roles: ["student", "teacher"] },
  { route: "/blog", aliases: ["blog", "blogs", "articles"], roles: ["student", "teacher"] },

  { route: "/user-dashboard", aliases: ["dashboard", "dash board", "adshboard", "student dashboard", "user dashboard"], roles: ["student"] },
  { route: "/my-courses", aliases: ["my courses", "enrolled courses", "courses"], roles: ["student"] },
  { route: "/favorite-courses", aliases: ["favorite courses", "favourites", "favorites"], roles: ["student"] },
  { route: "/my-teachers", aliases: ["my teachers", "teachers"], roles: ["student"] },
  { route: "/recommended-courses", aliases: ["recommended courses", "recommendations", "suggested courses"], roles: ["student"] },
  { route: "/profile-setting", aliases: ["profile", "profile settings", "settings"], roles: ["student"] },
  { route: "/change-password", aliases: ["change password", "password settings"], roles: ["student"] },
  { route: "/user-logout", aliases: ["logout", "user logout"], roles: ["student"] },
  { route: "/my-assignments", aliases: ["assignments", "my assignments"], roles: ["student"] },
  { route: "/quizzes", aliases: ["quiz", "quizzes", "my quizzes"], roles: ["student"] },
  {
    route: ({ userId }) => (userId ? `/student/chat-dashboard/${userId}` : null),
    aliases: ["chat", "messages", "student chat", "chat dashboard"],
    roles: ["student"],
  },

  { route: "/teacher-dashboard", aliases: ["dashboard", "dash board", "adshboard", "teacher dashboard", "instructor dashboard"], roles: ["teacher"] },
  { route: "/teacher-change-password", aliases: ["change password", "password settings"], roles: ["teacher"] },
  { route: "/teacher-profile-setting", aliases: ["profile", "profile settings", "settings"], roles: ["teacher"] },
  { route: "/teacher-my-course", aliases: ["teacher my course", "teacher courses", "my courses"], roles: ["teacher"] },
  { route: "/add-course", aliases: ["add course", "create course", "new course"], roles: ["teacher"] },
  { route: "/my-users", aliases: ["my users", "students", "my students"], roles: ["teacher"] },
  { route: "/quiz", aliases: ["quiz", "quizzes", "quiz list"], roles: ["teacher"] },
  { route: "/add-quiz", aliases: ["add quiz", "create quiz", "new quiz"], roles: ["teacher"] },
  { route: "/teacher-quiz-page", aliases: ["teacher quiz page", "quiz page"], roles: ["teacher"] },
  { route: "/teacher-logout", aliases: ["logout", "teacher logout"], roles: ["teacher"] },
  {
    route: ({ userId }) => (userId ? `/teacher/chat-dashboard/${userId}` : null),
    aliases: ["chat", "messages", "teacher chat", "chat dashboard"],
    roles: ["teacher"],
  },
];

const NAVIGATION_INTENT_PREFIXES = [
  "go to",
  "go",
  "move to",
  "move",
  "navigate to",
  "navigate",
  "open",
  "take me to",
  "show me",
];

const normalizeText = (value = "") =>
  value.toLowerCase().replace(/[^a-z0-9\s/_-]/g, " ").replace(/\s+/g, " ").trim();

const levenshteinDistance = (a = "", b = "") => {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i += 1) dp[i][0] = i;
  for (let j = 0; j <= n; j += 1) dp[0][j] = j;

  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
};

const fuzzyIncludesAlias = (normalizedQuestion, normalizedAlias) => {
  if (!normalizedQuestion || !normalizedAlias) return false;
  if (normalizedQuestion.includes(normalizedAlias)) return true;

  const qWords = normalizedQuestion.split(" ").filter(Boolean);
  const aWords = normalizedAlias.split(" ").filter(Boolean);
  if (!qWords.length || !aWords.length) return false;

  const qJoined = qWords.join(" ");
  const aJoined = aWords.join(" ");
  if (qJoined.length >= 5 && aJoined.length >= 5) {
    const maxDistance = aJoined.length <= 8 ? 2 : 3;
    if (levenshteinDistance(qJoined, aJoined) <= maxDistance) return true;
  }

  for (let i = 0; i <= qWords.length - aWords.length; i += 1) {
    const chunk = qWords.slice(i, i + aWords.length).join(" ");
    const maxDistance = normalizedAlias.length <= 8 ? 2 : 3;
    if (levenshteinDistance(chunk, normalizedAlias) <= maxDistance) return true;
  }
  return false;
};

const scoreAliasMatch = (normalizedQuestion, normalizedAlias) => {
  if (!normalizedQuestion || !normalizedAlias) return -1;
  if (normalizedQuestion === normalizedAlias) return 100;
  if (normalizedQuestion.endsWith(` ${normalizedAlias}`)) return 90;
  if (normalizedQuestion.includes(` ${normalizedAlias} `)) return 80;
  if (normalizedQuestion.startsWith(`${normalizedAlias} `)) return 75;
  if (fuzzyIncludesAlias(normalizedQuestion, normalizedAlias)) return 60;
  return -1;
};

const isStrictNavigationAlias = (alias = "") => {
  const normalizedAlias = normalizeText(alias);
  return ["home", "main", "about", "about us", "blog", "policy", "category", "categories"].includes(
    normalizedAlias
  );
};

const buildRoute = (route, role, userId) => {
  if (typeof route === "function") return route({ role, userId });
  return route;
};

const hasNavigationIntent = (text) => {
  const normalized = normalizeText(text);
  return NAVIGATION_INTENT_PREFIXES.some(
    (prefix) =>
      normalized === prefix ||
      normalized.startsWith(`${prefix} `) ||
      normalized.includes(` ${prefix} `)
  );
};

const pathMatchesPrefix = (path, prefix) =>
  path === prefix || path.startsWith(prefix.endsWith("/") ? prefix : `${prefix}/`);

const STUDENT_ONLY_PATH_PREFIXES = [
  "/user-dashboard",
  "/my-courses",
  "/favorite-courses",
  "/my-teachers",
  "/recommended-courses",
  "/profile-setting",
  "/change-password",
  "/user-logout",
  "/my-assignments",
  "/course-quiz/",
  "/quizzes",
  "/user/study-material/",
  "/take-quiz/",
  "/student/",
];

const TEACHER_ONLY_PATH_PREFIXES = [
  "/teacher-",
  "/teacher-dashboard",
  "/teacher-change-password",
  "/teacher-profile-setting",
  "/teacher-my-course",
  "/add-course",
  "/my-users",
  "/quiz",
  "/add-quiz",
  "/all-questions/",
  "/edit-question/",
  "/teacher/chat-dashboard/",
  "/teacher/chat/",
  "/add-question/",
  "/assign-quiz/",
  "/enrolled-students/",
  "/add-chapter/",
  "/edit-chapter/",
  "/edit-course/",
  "/study-material/",
  "/teacher-attempted-students/",
  "/teacher-quiz-results/",
  "/add-study/",
  "/quiz-result/",
  "/add-assignment/",
  "/show-assignment/",
  "/teacher-skill-courses/",
];

const canNavigateDirectPath = (path, role, userId) => {
  const uid = String(userId || "");

  const hasStudentOnlyPath = STUDENT_ONLY_PATH_PREFIXES.some((prefix) =>
    pathMatchesPrefix(path, prefix)
  );
  const hasTeacherOnlyPath = TEACHER_ONLY_PATH_PREFIXES.some((prefix) =>
    pathMatchesPrefix(path, prefix)
  );

  if (role === "student" && hasTeacherOnlyPath) return false;
  if (role === "teacher" && hasStudentOnlyPath) return false;

  const ownStudentChatDash = path.match(/^\/student\/chat-dashboard\/([^/]+)$/);
  if (ownStudentChatDash && role === "student") return ownStudentChatDash[1] === uid;

  const ownStudentChat = path.match(/^\/student\/chat\/([^/]+)\/[^/]+$/);
  if (ownStudentChat && role === "student") return ownStudentChat[1] === uid;

  const ownTeacherChatDash = path.match(/^\/teacher\/chat-dashboard\/([^/]+)$/);
  if (ownTeacherChatDash && role === "teacher") return ownTeacherChatDash[1] === uid;

  const ownTeacherChat = path.match(/^\/teacher\/chat\/([^/]+)\/[^/]+$/);
  if (ownTeacherChat && role === "teacher") return ownTeacherChat[1] === uid;

  const ownCertificate = path.match(/^\/certificate\/([^/]+)\/[^/]+$/);
  if (ownCertificate && role === "student") return ownCertificate[1] === uid;

  const ownTeacherSkill = path.match(/^\/teacher-skill-courses\/[^/]+\/([^/]+)$/);
  if (ownTeacherSkill && role === "teacher") return ownTeacherSkill[1] === uid;

  const ownAddAssignment = path.match(/^\/add-assignment\/([^/]+)\/[^/]+$/);
  if (ownAddAssignment && role === "teacher") return ownAddAssignment[1] === uid;

  const ownShowAssignment = path.match(/^\/show-assignment\/([^/]+)\/[^/]+$/);
  if (ownShowAssignment && role === "teacher") return ownShowAssignment[1] === uid;

  return true;
};

const resolveNavigationRoute = (question, role, userId) => {
  const raw = question.trim();
  const normalized = normalizeText(raw);
  if (!normalized) return null;

  // Prioritize dashboard intent over generic "about" keyword matches.
  // Example: "explain about my dashboard" should open dashboard, not About page.
  const hasDashboardIntent = /(dashboard|dash\s*board|dsahboard)/i.test(normalized);
  if (hasDashboardIntent) {
    if (role === "teacher") return "/teacher-dashboard";
    if (role === "student") return "/user-dashboard";
  }

  // Full/direct route command support: "/path" or "go to /path"
  const explicitPathMatch = raw.match(/\/[A-Za-z0-9/_-]*/);
  if (explicitPathMatch?.[0]) {
    const directPath = explicitPathMatch[0];
    return canNavigateDirectPath(directPath, role, userId) ? directPath : null;
  }

  const allowedPatterns = NAVIGATION_PATTERNS.filter((pattern) =>
    pattern.roles.includes(role)
  );

  const prefixedIntent = hasNavigationIntent(normalized);
  const wordCount = normalized.split(" ").filter(Boolean).length;
  const shortCommand = wordCount <= 4;
  const candidates = [];

  for (const pattern of allowedPatterns) {
    for (const alias of pattern.aliases) {
      const normalizedAlias = normalizeText(alias);
      const score = scoreAliasMatch(normalized, normalizedAlias);

      // Avoid misrouting dashboard queries to About page.
      if (
        hasDashboardIntent &&
        (normalizedAlias === "about" || normalizedAlias === "about us")
      ) {
        continue;
      }

      const exactAliasMatch =
        normalized === normalizedAlias ||
        normalized.startsWith(`${normalizedAlias} `) ||
        normalized.endsWith(` ${normalizedAlias}`) ||
        normalized.includes(` ${normalizedAlias} `);

      const allowMatch = prefixedIntent
        ? score >= 60
        : exactAliasMatch && shortCommand;

      if (!prefixedIntent && isStrictNavigationAlias(normalizedAlias) && !exactAliasMatch) {
        continue;
      }

      if (allowMatch) {
        const route = buildRoute(pattern.route, role, userId);
        if (route) {
          candidates.push({ route, score, aliasLength: normalizedAlias.length });
        }
      }
    }
  }

  if (candidates.length > 0) {
    candidates.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.aliasLength - a.aliasLength;
    });
    return candidates[0].route;
  }

  return null;
};

const getUiRouteName = (path, role = "student") => {
  const uiMap = {
    "/user-dashboard": "Student Dashboard",
    "/my-courses": "My Courses",
    "/favorite-courses": "Favorite Courses",
    "/my-teachers": "My Teachers",
    "/recommended-courses": "Recommended Courses",
    "/profile-setting": "Profile Settings",
    "/change-password": "Change Password",
    "/my-assignments": "My Assignments",
    "/quizzes": "Quiz List",
    "/teacher-dashboard": "Teacher Dashboard",
    "/teacher-my-course": "Teacher My Courses",
    "/my-users": "My Users",
    "/quiz": "All Quiz",
    "/add-quiz": "Add Quiz",
    "/teacher-quiz-page": "Teacher Quiz Page",
    "/teacher-profile-setting": "Teacher Profile Settings",
    "/teacher-change-password": "Teacher Change Password",
    "/aboutus": "About Us",
    "/policy": "Policy",
    "/all-courses": "All Courses",
    "/popular-courses": "Popular Courses",
    "/work-shop": "Workshop",
    "/blog": "Blog",
    "/category": "Category",
    "/": "Home",
  };

  if (uiMap[path]) return uiMap[path];
  if (/^\/student\/chat-dashboard\/\d+$/.test(path)) return "Student Chat Dashboard";
  if (/^\/teacher\/chat-dashboard\/\d+$/.test(path)) return "Teacher Chat Dashboard";
  if (/^\/user\/detail\/\d+$/.test(path)) return "Course Detail";
  if (/^\/user\/study-material\/\d+$/.test(path)) return "Study Material";
  if (/^\/course-quiz\/\d+$/.test(path)) return "Course Quiz";
  if (/^\/take-quiz\/\d+$/.test(path)) return "Take Quiz";
  return role === "teacher" ? "Teacher Page" : "Student Page";
};

const buildWelcomeMessage = (name, role) => {
  const roleLabel = role === "teacher" ? "Teacher" : "Student";
  const safeName = (name || "").trim();
  if (safeName) {
    return `Hi ${safeName}. I am your LMS assistant. Ask me about your dashboard, courses, documents, quizzes, or assignments.`;
  }
  return `Hi ${roleLabel}. I am your LMS assistant. Ask me about your dashboard, courses, documents, quizzes, or assignments.`;
};

const buildVoiceFriendlyText = (text = "") => {
  return String(text || "")
    .replace(/\r/g, " ")
    .replace(/\n+/g, ". ")
    .replace(/[*#`>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const formatAssistantSections = (text = "") => {
  const normalized = String(text || "").replace(/\r/g, "").trim();
  if (!normalized) return [];

  const lines = normalized
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length >= 2) {
    return lines.map((line) => {
      const bullet = line.match(/^([-*]|\d+[.)])\s+(.*)$/);
      if (bullet) {
        return { type: "bullet", content: bullet[2].trim() };
      }
      return { type: "paragraph", content: line };
    });
  }

  const parts = normalized
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    return parts.map((part) => ({ type: "paragraph", content: part }));
  }

  return [{ type: "paragraph", content: normalized }];
};

const renderInlineEmphasis = (text = "") => {
  const value = String(text || "");
  if (!value.includes("**")) return value;

  return value.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={`${index}-${part.slice(2, 10)}`}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const isHeadingLikeText = (text = "") => {
  const value = String(text || "").trim();
  if (!value) return false;
  if (value.endsWith(":") && value.length <= 80) return true;
  return /^[A-Z][A-Za-z\s]{2,40}:$/.test(value);
};

const getSupportedPageHints = (role, userId) => {
  if (role === "teacher") {
    return [
      "Teacher Dashboard",
      "My Courses",
      "Quiz Management",
      "My Users",
      "Profile Settings",
      "Change Password",
      "Chat Dashboard",
    ];
  }

  return [
    "Student Dashboard",
    "My Courses",
    "Favorite Courses",
    "My Assignments",
    "Quizzes",
    "Profile Settings",
    "Change Password",
    "Chat Dashboard",
  ];
};

const getRoleCapabilityPrompts = (role, currentPath) => {
  const common = [
    "Ask what you can do on this page",
    "Ask for a summary of the current page",
    "Ask to open a page by name",
  ];

  if (role === "teacher") {
    return [
      ...common,
      "Ask for dashboard totals and student progress",
      "Ask about your courses, chapters, and study materials",
      "Ask about quizzes, assignments, and enrolled students",
      `Current page: ${getUiRouteName(currentPath, role)}`,
    ];
  }

  return [
    ...common,
    "Ask about enrolled courses and learning progress",
    "Ask about assignments, quizzes, and study materials",
    "Ask about favorite courses and chat dashboard",
    `Current page: ${getUiRouteName(currentPath, role)}`,
  ];
};

const getRoleScopeSummary = (role) => {
  if (role === "teacher") {
    return [
      "Teacher scope:",
      "dashboard metrics",
      "your courses",
      "student enrollments",
      "chapters and materials",
      "quizzes and assignments",
      "chat dashboard",
    ].join(" ");
  }

  return [
    "Student scope:",
    "dashboard progress",
    "your enrolled courses",
    "documents and study materials",
    "assignments and quizzes",
    "favorites and chat dashboard",
  ].join(" ");
};

const AI_VOICE_OPTIONS = [
  { value: "alloy", label: "Alloy" },
  { value: "verse", label: "Verse" },
  { value: "marin", label: "Marin" },
  { value: "cedar", label: "Cedar" },
  { value: "coral", label: "Coral" },
  { value: "sage", label: "Sage" },
  { value: "ash", label: "Ash" },
  { value: "shimmer", label: "Shimmer" },
];

const LANGUAGE_OPTIONS = [
  { value: "english", label: "English" },
  { value: "tamil", label: "Tamil" },
  { value: "hindi", label: "Hindi" },
];

const isDashboardSummaryIntent = (text = "") => {
  const normalized = normalizeText(text);
  if (!normalized) return false;

  const dashboardWords = /(dashboard|dash board|dsahboard)/i;
  const summaryWords =
    /(explain|details|detail|summary|status|progress|report|how many|count|what i did|what they did|done|completed|quiz|assignment|video|student|teacher)/i;
  const directStatsWords =
    /(how many students?|student count|what they done|quiz.*done|assignment.*done|video.*done|progress.*students?)/i;

  return (
    (dashboardWords.test(normalized) && summaryWords.test(normalized)) ||
    directStatsWords.test(normalized)
  );
};

const isEnrolledStudentsIntent = (text = "") => {
  const normalized = normalizeText(text);
  if (!normalized) return false;
  return /(enrolled students?|student list|students list|students details?|enrollment details?|who enrolled)/i.test(
    normalized
  );
};

const isDashboardDetailIntent = (text = "") => {
  const normalized = normalizeText(text);
  return /(view detail|show details|full details|dashboard details|details in dashboard)/i.test(
    normalized
  );
};

const isCurrentPageDetailsIntent = (text = "") => {
  const normalized = normalizeText(text);
  return /(details of this page|details of this|this page details|current page details|explain this page|what is in this page|show everything here)/i.test(
    normalized
  );
};

const AIAssistantWidget = ({ role, userId, title = "AI Assistant" }) => {
  const effectiveRole = useMemo(() => {
    const normalized = String(role || "").toLowerCase().trim();
    if (normalized === "teacher" || normalized === "student") return normalized;

    const teacherLoggedIn = localStorage.getItem("teacherLoginStatus") === "true";
    const studentLoggedIn = localStorage.getItem("studentLoginStatus") === "true";
    if (teacherLoggedIn && !studentLoggedIn) return "teacher";
    return "student";
  }, [role]);

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: buildWelcomeMessage("", effectiveRole),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceReply, setVoiceReply] = useState(true);
  const [voiceName, setVoiceName] = useState("alloy");
  const [language, setLanguage] = useState("english");

  const recognitionRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const audioUrlRef = useRef("");
  const ttsAbortRef = useRef(null);
  const transcriptRef = useRef("");
  const finalTranscriptRef = useRef("");
  const silenceTimerRef = useRef(null);
  const manualStopRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const tokenStorageKey =
    effectiveRole === "teacher" ? "chatAuthTokenTeacher" : "chatAuthTokenStudent";
  const getChatToken = () =>
    localStorage.getItem(tokenStorageKey) || localStorage.getItem("chatAuthToken");

  const historyPayload = useMemo(() => {
    return messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-8)
      .map((m) => ({ role: m.role, content: m.content }));
  }, [messages]);

  const currentPageName = useMemo(
    () => getUiRouteName(location.pathname, effectiveRole),
    [effectiveRole, location.pathname]
  );

  useEffect(() => {
    if (!userId) return;

    const endpoint =
      effectiveRole === "teacher"
        ? `${baseUrl}/teacher/${userId}/`
        : `${baseUrl}/student/${userId}/`;

    axios
      .get(endpoint)
      .then((res) => {
        const fetchedName =
          effectiveRole === "teacher"
            ? res?.data?.full_name
            : res?.data?.fullname || res?.data?.full_name || res?.data?.username;
        setDisplayName(fetchedName || "");
      })
      .catch(() => {
        setDisplayName("");
      });
  }, [effectiveRole, userId]);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0]?.role === "assistant") {
        return [{ ...prev[0], content: buildWelcomeMessage(displayName, effectiveRole) }];
      }
      return prev;
    });
  }, [displayName, effectiveRole]);

  useEffect(() => {
    if (!voiceReply) {
      if (ttsAbortRef.current) {
        ttsAbortRef.current.abort();
        ttsAbortRef.current = null;
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = "";
      }
      setSpeaking(false);
    }
  }, [voiceReply]);

  useEffect(() => {
    const savedVoice = localStorage.getItem("assistantVoiceName");
    if (savedVoice) {
      setVoiceName(savedVoice);
    }
    const savedLanguage = localStorage.getItem("assistantLanguage");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("assistantVoiceName", voiceName);
  }, [voiceName]);

  useEffect(() => {
    localStorage.setItem("assistantLanguage", language);
  }, [language]);

  useEffect(() => {
    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onresult = null;
      }
      if (ttsAbortRef.current) {
        ttsAbortRef.current.abort();
        ttsAbortRef.current = null;
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = "";
      }
    };
  }, []);

  const translateIfNeeded = async (text) => {
    const cleanedText = String(text || "").trim();
    const chatToken = getChatToken();
    if (!cleanedText || language === "english" || !chatToken || !userId) {
      return cleanedText;
    }

    try {
      const response = await fetch(`${baseUrl}/ai-translate/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${chatToken}`,
        },
        body: JSON.stringify({
          text: cleanedText,
          role: effectiveRole,
          user_id: userId,
          target_language: language,
        }),
      });

      if (!response.ok) return cleanedText;

      const data = await response.json();
      return data?.text || cleanedText;
    } catch {
      return cleanedText;
    }
  };

  const pushAssistantMessage = async (text, options = {}) => {
    const translatedText = options.skipTranslate ? String(text || "").trim() : await translateIfNeeded(text);
    setMessages((prev) => [...prev, { role: "assistant", content: translatedText }]);
    if (options.speak !== false) {
      await speakText(translatedText);
    }
    return translatedText;
  };

  const speakText = async (text) => {
    const cleanedText = buildVoiceFriendlyText(text);
    const chatToken = getChatToken();
    if (!voiceReply || !cleanedText || !chatToken || !userId) return;

    stopSpeaking();

    const controller = new AbortController();
    ttsAbortRef.current = controller;
    setSpeaking(true);

    try {
      const response = await fetch(`${baseUrl}/ai-voice/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${chatToken}`,
        },
        body: JSON.stringify({
          text: cleanedText,
          role: effectiveRole,
          user_id: userId,
          voice: voiceName,
          preferred_language: language,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Voice generation failed with status ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
      audioUrlRef.current = audioUrl;

      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;
      ttsAbortRef.current = null;

      audio.onended = () => {
        setSpeaking(false);
      };
      audio.onerror = () => {
        setSpeaking(false);
      };

      await audio.play();
    } catch (err) {
      if (err?.name !== "AbortError") {
        setSpeaking(false);
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }
  };

  const stopSpeaking = () => {
    if (ttsAbortRef.current) {
      ttsAbortRef.current.abort();
      ttsAbortRef.current = null;
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      audioPlayerRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = "";
    }
    setSpeaking(false);
  };

  const parseQuizQuestionCommand = (text) => {
    const raw = text.trim();
    const hasIntent =
      /(add|create|make)\s+(a\s+)?(new\s+)?(quiz\s+)?question/i.test(raw) ||
      /quiz\s+question/i.test(raw);
    if (!hasIntent) return null;

    const pathQuizMatch = location.pathname.match(/^\/add-question\/([^/]+)$/);
    const textQuizMatch = raw.match(/quiz(?:\s*id)?\s*[:#-]?\s*(\d+)/i);
    const quizId = pathQuizMatch?.[1] || textQuizMatch?.[1] || "";

    const qPattern =
      /question\s*[:\-]?\s*(.*?)\s*(?:option\s*(?:1|one)|ans1)\s*[:\-]?\s*(.*?)\s*(?:option\s*(?:2|two)|ans2)\s*[:\-]?\s*(.*?)\s*(?:option\s*(?:3|three)|ans3)\s*[:\-]?\s*(.*?)\s*(?:option\s*(?:4|four)|ans4)\s*[:\-]?\s*(.*?)\s*(?:right\s*answer|correct\s*answer|right\s*ans|answer)\s*[:\-]?\s*(.*)$/i;
    const matched = raw.match(qPattern);

    if (!quizId) {
      return {
        error:
          "Quiz ID missing. Open an Add Question page first, or say quiz id in command.",
      };
    }

    if (!matched) {
      return {
        error:
          "Use format: add quiz question: question: ... option 1: ... option 2: ... option 3: ... option 4: ... right answer: ...",
      };
    }

    return {
      quizId,
      questions: matched[1]?.trim(),
      ans1: matched[2]?.trim(),
      ans2: matched[3]?.trim(),
      ans3: matched[4]?.trim(),
      ans4: matched[5]?.trim(),
      right_ans: matched[6]?.trim(),
    };
  };

  const getDashboardSummary = async () => {
    if (!userId) {
      return "I could not find your login user id. Please login again.";
    }

    if (effectiveRole === "teacher") {
      const [dashRes, progressRes] = await Promise.all([
        axios.get(`${baseUrl}/teacher/dashboard/${userId}/`).catch(() => ({ data: {} })),
        axios
          .get(`${baseUrl}/teacher/student-course-progress/${userId}/`)
          .catch(() => ({ data: [] })),
      ]);

      const dash = dashRes?.data || {};
      const progress = Array.isArray(progressRes?.data) ? progressRes.data : [];

      const totalRows = progress.length;
      const videosDone = progress.filter((r) => r?.videos_done).length;
      const assignmentsDone = progress.filter((r) => r?.assignments_done).length;
      const quizPassed = progress.filter((r) => r?.quiz_passed).length;
      const certificateEligible = progress.filter((r) => r?.eligible_for_certificate).length;

      return [
        "Teacher dashboard summary:",
        `Total courses: ${dash?.total_teacher_course ?? 0}`,
        `Total students: ${dash?.total_teacher_students ?? 0}`,
        `Total chapters: ${dash?.total_teacher_chapters ?? 0}`,
        `Tracked student-course progress rows: ${totalRows}`,
        `Rows with videos completed: ${videosDone}`,
        `Rows with assignments completed: ${assignmentsDone}`,
        `Rows with quiz passed: ${quizPassed}`,
        `Certificate eligible rows: ${certificateEligible}`,
      ].join("\n");
    }

    const [dashRes, quizzesRes, assignmentsRes, coursesRes] = await Promise.all([
      axios.get(`${baseUrl}/student/dashboard/${userId}`).catch(() => ({ data: {} })),
      axios.get(`${baseUrl}/student-assigned-quizzes/${userId}/`).catch(() => ({ data: [] })),
      axios.get(`${baseUrl}/my-assignments/${userId}/`).catch(() => ({ data: [] })),
      axios.get(`${baseUrl}/fetch-enrolled-courses/${userId}`).catch(() => ({ data: [] })),
    ]);

    const dash = dashRes?.data || {};
    const quizzes = Array.isArray(quizzesRes?.data) ? quizzesRes.data : [];
    const assignments = Array.isArray(assignmentsRes?.data) ? assignmentsRes.data : [];
    const courses = Array.isArray(coursesRes?.data) ? coursesRes.data : [];

    const submittedAssignments = assignments.filter(
      (a) =>
        a?.is_submitted ||
        a?.submitted ||
        a?.submitted_file ||
        a?.submission ||
        a?.answer_file
    ).length;

    const videoDoneCourses = courses.filter((c) => c?.progress?.videos?.ok).length;
    const assignmentDoneCourses = courses.filter((c) => c?.progress?.assignments?.ok).length;
    const quizDoneCourses = courses.filter((c) => c?.progress?.quiz?.ok).length;

    return [
      "Student dashboard summary:",
      `Enrolled courses: ${dash?.enrolled_courses ?? 0}`,
      `Favorite courses: ${dash?.favorite_courses ?? 0}`,
      `Assignments completed: ${dash?.complete_assignments ?? 0}`,
      `Assignments pending: ${dash?.pending_assignments ?? 0}`,
      `Assigned quizzes: ${quizzes.length}`,
      `Assignments submitted: ${submittedAssignments}/${assignments.length}`,
      `Courses with videos done: ${videoDoneCourses}/${courses.length}`,
      `Courses with assignments done: ${assignmentDoneCourses}/${courses.length}`,
      `Courses with quiz done: ${quizDoneCourses}/${courses.length}`,
    ].join("\n");
  };

  const getEnrolledStudentsDetails = async () => {
    if (!userId) {
      return "I could not find your login user id. Please login again.";
    }

    if (effectiveRole !== "teacher") {
      return "Enrolled students details are available on the teacher side only.";
    }

    const res = await axios
      .get(`${baseUrl}/fetch-all-enrolled-students/${userId}/`)
      .catch(() => ({ data: [] }));

    const rows = Array.isArray(res?.data) ? res.data : [];
    if (!rows.length) {
      return "No enrolled students found yet.";
    }

    const map = new Map();
    rows.forEach((item) => {
      const sid = item?.student?.id;
      if (!sid) return;

      if (!map.has(sid)) {
        map.set(sid, {
          name: item?.student?.fullname || item?.student?.name || "Student",
          email: item?.student?.email || "-",
          latestEnrolled: item?.enrolled_time || "",
          courses: [],
        });
      }

      const row = map.get(sid);
      const courseTitle = item?.course?.title;
      if (courseTitle && !row.courses.includes(courseTitle)) {
        row.courses.push(courseTitle);
      }

      if (
        item?.enrolled_time &&
        (!row.latestEnrolled || item.enrolled_time > row.latestEnrolled)
      ) {
        row.latestEnrolled = item.enrolled_time;
      }
    });

    const students = Array.from(map.values());
    const preview = students.slice(0, 10);

    const lines = [`Enrolled students (${students.length}):`];
    preview.forEach((s, i) => {
      lines.push(
        `${i + 1}. ${s.name} | ${s.email} | Courses: ${s.courses.length} | Latest Enrolled: ${
          s.latestEnrolled ? s.latestEnrolled.slice(0, 10) : "-"
        }`
      );
    });

    if (students.length > preview.length) {
      lines.push(`Showing ${preview.length} of ${students.length}. Open My Users for full list.`);
    }

    return lines.join("\n");
  };

  const verifyNavigationPermission = async (path) => {
    if (!userId) {
      return { allowed: false, reason: "Please login again to continue." };
    }

    if (!canNavigateDirectPath(path, effectiveRole, userId)) {
      return { allowed: false, reason: "You do not have permission for that page." };
    }

    if (effectiveRole !== "student") {
      return { allowed: true };
    }

    const enrolledCourseMatch = path.match(/^\/(user\/detail|user\/study-material|course-quiz)\/(\d+)$/);
    if (enrolledCourseMatch) {
      const courseId = Number(enrolledCourseMatch[2]);
      const enrolledRes = await axios
        .get(`${baseUrl}/fetch-enrolled-courses/${userId}`)
        .catch(() => ({ data: [] }));
      const enrollments = Array.isArray(enrolledRes?.data) ? enrolledRes.data : [];
      const allowed = enrollments.some((e) => Number(e?.course?.id) === courseId);
      if (!allowed) {
        return { allowed: false, reason: "This course is not in your enrolled list." };
      }
    }

    const takeQuizMatch = path.match(/^\/take-quiz\/(\d+)$/);
    if (takeQuizMatch) {
      const quizId = Number(takeQuizMatch[1]);
      const quizRes = await axios
        .get(`${baseUrl}/student-assigned-quizzes/${userId}/`)
        .catch(() => ({ data: [] }));
      const quizzes = Array.isArray(quizRes?.data) ? quizRes.data : [];
      const allowed = quizzes.some((q) => Number(q?.id) === quizId);
      if (!allowed) {
        return { allowed: false, reason: "This quiz is not assigned to your enrolled courses." };
      }
    }

    return { allowed: true };
  };

  const getCurrentPageDetails = async () => {
    const path = location.pathname;
    if (!userId) return "Please login again to fetch your page details.";

    if (effectiveRole === "student") {
      if (path === "/user-dashboard") return getDashboardSummary();

      if (path === "/my-courses") {
        const res = await axios.get(`${baseUrl}/fetch-enrolled-courses/${userId}`).catch(() => ({ data: [] }));
        const rows = Array.isArray(res?.data) ? res.data : [];
        const names = rows.map((r) => r?.course?.title).filter(Boolean).slice(0, 5);
        return [
          "My Courses details:",
          `Total enrolled courses: ${rows.length}`,
          names.length ? `Sample courses: ${names.join(", ")}` : "No course titles available.",
        ].join("\n");
      }

      if (path === "/my-assignments") {
        const res = await axios.get(`${baseUrl}/my-assignments/${userId}/`).catch(() => ({ data: [] }));
        const rows = Array.isArray(res?.data) ? res.data : [];
        const submitted = rows.filter((r) => r?.student_status).length;
        return [
          "My Assignments details:",
          `Total assignments: ${rows.length}`,
          `Submitted: ${submitted}`,
          `Pending: ${rows.length - submitted}`,
        ].join("\n");
      }

      if (path === "/quizzes") {
        const res = await axios.get(`${baseUrl}/student-assigned-quizzes/${userId}/`).catch(() => ({ data: [] }));
        const quizzes = Array.isArray(res?.data) ? res.data : [];
        const attempts = await Promise.all(
          quizzes.map((q) =>
            axios
              .get(`${baseUrl}/fetch-quiz-attempt-status/${q.id}/${userId}`)
              .then((r) => Boolean(r?.data?.bool))
              .catch(() => false)
          )
        );
        const attended = attempts.filter(Boolean).length;
        return [
          "Quiz page details:",
          `Assigned quizzes: ${quizzes.length}`,
          `Attended quizzes: ${attended}`,
          `Pending quizzes: ${quizzes.length - attended}`,
        ].join("\n");
      }

      if (/^\/student\/chat-dashboard\/\d+$/.test(path)) {
        const res = await axios.get(`${baseUrl}/student/chat-dashboard/${userId}/`).catch(() => ({ data: {} }));
        const individuals = Array.isArray(res?.data?.individuals) ? res.data.individuals : [];
        const unread = individuals.reduce((a, t) => a + Number(t?.unread || 0), 0);
        return [
          "Chat dashboard details:",
          `Teachers in chat list: ${individuals.length}`,
          `Total unread messages: ${unread}`,
        ].join("\n");
      }
    }

    if (effectiveRole === "teacher") {
      if (path === "/teacher-dashboard") return getDashboardSummary();

      if (path === "/teacher-my-course") {
        const res = await axios.get(`${baseUrl}/teacher-course/${userId}`).catch(() => ({ data: [] }));
        const rows = Array.isArray(res?.data) ? res.data : [];
        const totalStudents = rows.reduce((a, c) => a + Number(c?.total_enrolled_students || 0), 0);
        return [
          "Teacher My Courses details:",
          `Total courses: ${rows.length}`,
          `Total enrolled students across courses: ${totalStudents}`,
        ].join("\n");
      }

      if (path === "/my-users") return getEnrolledStudentsDetails();

      if (path === "/quiz" || path === "/teacher-quiz-page") {
        const res = await axios.get(`${baseUrl}/teacher-quiz/${userId}`).catch(() => ({ data: [] }));
        const rows = Array.isArray(res?.data) ? res.data : [];
        return [
          "Teacher quiz details:",
          `Total quizzes created: ${rows.length}`,
        ].join("\n");
      }

      if (/^\/teacher\/chat-dashboard\/\d+$/.test(path)) {
        const res = await axios.get(`${baseUrl}/teacher/chat-dashboard/${userId}/`).catch(() => ({ data: {} }));
        const individuals = Array.isArray(res?.data?.individuals) ? res.data.individuals : [];
        const unread = individuals.reduce((a, s) => a + Number(s?.unread || 0), 0);
        return [
          "Teacher chat dashboard details:",
          `Students in chat list: ${individuals.length}`,
          `Total unread messages: ${unread}`,
        ].join("\n");
      }
    }

    return "I can explain this page in detail for dashboard, courses, assignments, quizzes, users, and chat pages.";
  };

  const sendMessage = async (textOverride) => {
    const question = (textOverride ?? input).trim();
    if (!question || loading) return;

    if (isCurrentPageDetailsIntent(question)) {
      setMessages((prev) => [...prev, { role: "user", content: question }]);
      setInput("");
      setLoading(true);
      try {
        const detail = await getCurrentPageDetails();
        await pushAssistantMessage(detail);
      } catch (err) {
        const msg = "I could not fetch current page details right now. Please try again.";
        await pushAssistantMessage(msg);
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (isDashboardDetailIntent(question) || isDashboardSummaryIntent(question)) {
      setMessages((prev) => [...prev, { role: "user", content: question }]);
      setInput("");
      setLoading(true);
      try {
        const summary = await getDashboardSummary();
        await pushAssistantMessage(summary);
      } catch (err) {
        const msg = "I could not fetch dashboard details right now. Please try again.";
        await pushAssistantMessage(msg);
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (isEnrolledStudentsIntent(question)) {
      setMessages((prev) => [...prev, { role: "user", content: question }]);
      setInput("");
      setLoading(true);
      try {
        const detailText = await getEnrolledStudentsDetails();
        await pushAssistantMessage(detailText);
      } catch (err) {
        const msg = "I could not fetch enrolled students details right now. Please try again.";
        await pushAssistantMessage(msg);
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        setLoading(false);
      }
      return;
    }

    const navRoute = resolveNavigationRoute(question, effectiveRole, userId);
    if (navRoute) {
      const permission = await verifyNavigationPermission(navRoute);
      if (!permission.allowed) {
        const denyMsg = permission.reason || "You do not have access to that page.";
        setMessages((prev) => [...prev, { role: "user", content: question }]);
        setInput("");
        await pushAssistantMessage(denyMsg);
        return;
      }

      const uiName = getUiRouteName(navRoute, effectiveRole);
      const navMsg = `Sure. Opening ${uiName}.`;
      setMessages((prev) => [...prev, { role: "user", content: question }]);
      setInput("");
      await pushAssistantMessage(navMsg);
      navigate(navRoute);
      return;
    }

    if (hasNavigationIntent(question)) {
      const pageHints = getSupportedPageHints(effectiveRole, userId).join(", ");
      const restrictedMsg =
        `I could not match that page command. Try one of these: ${pageHints}.`;
      setMessages((prev) => [...prev, { role: "user", content: question }]);
      setInput("");
      await pushAssistantMessage(restrictedMsg);
      return;
    }

    if (effectiveRole === "teacher") {
      const parsedQuizQuestion = parseQuizQuestionCommand(question);
      if (parsedQuizQuestion) {
        setMessages((prev) => [...prev, { role: "user", content: question }]);
        setInput("");

        if (parsedQuizQuestion.error) {
          const errorMsg = parsedQuizQuestion.error;
          await pushAssistantMessage(errorMsg);
          return;
        }

        setLoading(true);
        try {
          const formData = new FormData();
          formData.append("quiz", parsedQuizQuestion.quizId);
          formData.append("questions", parsedQuizQuestion.questions);
          formData.append("ans1", parsedQuizQuestion.ans1);
          formData.append("ans2", parsedQuizQuestion.ans2);
          formData.append("ans3", parsedQuizQuestion.ans3);
          formData.append("ans4", parsedQuizQuestion.ans4);
          formData.append("right_ans", parsedQuizQuestion.right_ans);

          await axios.post(`${baseUrl}/quiz-questions/`, formData, {
            headers: { "content-type": "multipart/form-data" },
          });

          const successMsg = "Quiz question added successfully.";
          await pushAssistantMessage(successMsg);
        } catch (err) {
          const failMsg = "Could not add quiz question. Please try again.";
          await pushAssistantMessage(failMsg);
          // eslint-disable-next-line no-console
          console.error(err);
        } finally {
          setLoading(false);
        }
        return;
      }
    }

    const chatToken =
      localStorage.getItem(tokenStorageKey) || localStorage.getItem("chatAuthToken");

    if (!chatToken) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Chat auth missing. Please login again.",
        },
      ]);
      return;
    }

    const nextMessages = [...messages, { role: "user", content: question }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${baseUrl}/ai-chat/`,
        {
          question,
          role: effectiveRole,
          user_id: userId,
          history: historyPayload,
          current_path: location.pathname,
          current_page: currentPageName,
          capability_prompts: getRoleCapabilityPrompts(effectiveRole, location.pathname),
          role_scope: getRoleScopeSummary(effectiveRole),
          preferred_language: language,
        },
        {
          headers: chatToken ? { Authorization: `Bearer ${chatToken}` } : {},
        }
      );

      const answer = res?.data?.answer || "No response";
      await pushAssistantMessage(answer, { skipTranslate: true });
    } catch (err) {
      const status = err?.response?.status;
      const errMsg =
        status === 401 || status === 403
          ? "Chat auth expired. Please login again."
          : "Assistant is temporarily unavailable. Please try again.";

      if (status === 401 || status === 403) {
        localStorage.removeItem(tokenStorageKey);
        localStorage.removeItem("chatAuthToken");
      }

      await pushAssistantMessage(errMsg);
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderMessageContent = (message) => {
    if (message.role !== "assistant") return message.content;

    const sections = formatAssistantSections(message.content);
    const bulletItems = sections.filter((section) => section.type === "bullet");
    const paragraphItems = sections.filter((section) => section.type === "paragraph");

    if (sections.length <= 1) return message.content;

    return (
      <div className="ai-msg-rich">
        {paragraphItems.map((section, index) => (
          <p
            key={`${index}-${section.content.slice(0, 20)}`}
            className={`ai-msg-paragraph ${isHeadingLikeText(section.content) ? "ai-msg-heading" : ""}`}
          >
            {renderInlineEmphasis(section.content)}
          </p>
        ))}
        {bulletItems.length > 0 && (
          <ul className="ai-msg-points">
            {bulletItems.map((point, index) => (
              <li key={`${index}-${point.content.slice(0, 20)}`}>{renderInlineEmphasis(point.content)}</li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const toggleListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    stopSpeaking();

    if (listening && recognitionRef.current) {
      manualStopRef.current = true;
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang =
      language === "tamil" ? "ta-IN" : language === "hindi" ? "hi-IN" : "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    const resetSilenceTimer = () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      silenceTimerRef.current = setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }, 2500);
    };

    recognition.onstart = () => {
      manualStopRef.current = false;
      transcriptRef.current = "";
      finalTranscriptRef.current = "";
      setListening(true);
      setInput("");
    };
    recognition.onend = () => {
      setListening(false);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (manualStopRef.current) {
        manualStopRef.current = false;
        transcriptRef.current = "";
        finalTranscriptRef.current = "";
        return;
      }
      const transcript = (finalTranscriptRef.current || transcriptRef.current).trim();
      transcriptRef.current = "";
      finalTranscriptRef.current = "";
      if (transcript) {
        sendMessage(transcript);
      }
    };
    recognition.onerror = (event) => {
      setListening(false);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      transcriptRef.current = "";
      finalTranscriptRef.current = "";
      const code = event?.error || "unknown";
      let message = "Voice input failed. Please try again.";
      if (code === "not-allowed" || code === "service-not-allowed") {
        message = "Microphone permission is blocked. Please allow mic access in your browser.";
      } else if (code === "no-speech") {
        message = "No speech detected. Please speak a little louder and try again.";
      } else if (code === "audio-capture") {
        message = "No microphone was detected. Check your mic connection and browser settings.";
      }
      pushAssistantMessage(message, { speak: false });
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = finalTranscriptRef.current;

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const transcript = result?.[0]?.transcript || "";
        if (!transcript) continue;
        if (result.isFinal) {
          finalTranscript = `${finalTranscript} ${transcript}`.trim();
        } else {
          interimTranscript = `${interimTranscript} ${transcript}`.trim();
        }
      }

      finalTranscriptRef.current = finalTranscript;
      transcriptRef.current = `${finalTranscript} ${interimTranscript}`.trim();
      setInput(transcriptRef.current);
      resetSilenceTimer();
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <>
      <button
        type="button"
        className="ai-assistant-launcher"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <i className="bi bi-robot"></i>
        <span>{title}</span>
      </button>

      {isOpen && (
        <div className="ai-assistant-panel">
          <div className="ai-assistant-header">
            <h6>{title}</h6>
            <button type="button" onClick={() => setIsOpen(false)}>
              <i className="bi bi-x"></i>
            </button>
          </div>

          <div className="ai-assistant-messages">
            {messages.map((m, idx) => (
              <div key={idx} className={`ai-msg ai-msg-${m.role}`}>
                {renderMessageContent(m)}
              </div>
            ))}
            {loading && <div className="ai-msg ai-msg-assistant">Thinking...</div>}
          </div>

          <div className="ai-assistant-actions">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              rows={2}
              placeholder={`Ask about ${currentPageName.toLowerCase()}, courses, quizzes, assignments, or type "what can I ask here?"`}
            />
            <button
              type="button"
              onClick={toggleListening}
              className={listening ? "active" : ""}
            >
              <i className={`bi ${listening ? "bi-stop-fill" : "bi-mic"}`}></i>
            </button>
            <button
              type="button"
              onClick={stopSpeaking}
              className={speaking ? "active" : ""}
              title="Stop voice"
            >
              <i className="bi bi-volume-mute"></i>
            </button>
            <button type="button" onClick={sendMessage}>
              <i className="bi bi-send"></i>
            </button>
          </div>

          <label className="ai-assistant-voice-toggle">
            <input
              type="checkbox"
              checked={voiceReply}
              onChange={(e) => setVoiceReply(e.target.checked)}
            />
            AI voice reply
          </label>
          <div className="ai-assistant-voice-select-wrap">
            <label htmlFor={`ai-language-${effectiveRole}`}>Language</label>
            <select
              id={`ai-language-${effectiveRole}`}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="ai-assistant-voice-select-wrap">
            <label htmlFor={`ai-voice-${effectiveRole}`}>Voice</label>
            <select
              id={`ai-voice-${effectiveRole}`}
              value={voiceName}
              onChange={(e) => setVoiceName(e.target.value)}
            >
              {AI_VOICE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistantWidget;
