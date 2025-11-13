import React, { useState } from 'react';
import { StudentResponse } from './types';
import { EMOJIS, GRADES, SECTIONS } from './constants';

// --- SVG Icons ---

const PaperPlaneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="m22 2-7 20-4-9-9-4Z"/>
    <path d="m22 2-11 11"/>
  </svg>
);

const PlusCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="10"/>
    <path d="M8 12h8"/>
    <path d="M12 8v8"/>
  </svg>
);

// --- UI Components ---

const Header: React.FC = () => (
  <header className="text-center mb-12">
    <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-500">
      كيف الحال؟
    </h1>
    <p className="text-slate-600 mt-2">تطبيق لمتابعة مشاعر الطلاب</p>
  </header>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 sm:p-8 ${className}`}>
    {children}
  </div>
);

interface EducatorFormProps {
  setQuestion: (question: string) => void;
}

const EducatorForm: React.FC<EducatorFormProps> = ({ setQuestion }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setQuestion(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold text-slate-800 mb-4">أيها المربي، اطرح سؤالك</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="مثال: كيف تشعرون اليوم؟"
            className="flex-grow w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            aria-label="اطرح سؤالك"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={!inputValue.trim()}
          >
            <PaperPlaneIcon />
            <span>إرسال السؤال</span>
          </button>
        </div>
      </form>
    </Card>
  );
};

interface QuestionDisplayProps {
  question: string;
  onReset: () => void;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question, onReset }) => (
    <div className="mb-8 p-6 bg-indigo-50 border-r-4 border-indigo-500 rounded-lg flex justify-between items-center">
        <p className="text-lg text-slate-800">
            <strong>السؤال الحالي:</strong> "{question}"
        </p>
        <button
            onClick={onReset}
            className="flex items-center gap-2 text-sm bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition"
            aria-label="طرح سؤال جديد"
        >
            <PlusCircleIcon />
            <span>سؤال جديد</span>
        </button>
    </div>
);


interface StudentResponseFormProps {
  addResponse: (response: Omit<StudentResponse, 'id'>) => void;
}

const StudentResponseForm: React.FC<StudentResponseFormProps> = ({ addResponse }) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [section, setSection] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmoji || !name.trim() || !grade || !section) {
        alert('الرجاء تعبئة الاسم واختيار الصف والشعبة والرمز التعبيري.');
        return;
    }
    const className = `الصف ${grade} / شعبة ${section}`;
    addResponse({ name: name.trim(), className, emoji: selectedEmoji, text: text.trim() });
    setSelectedEmoji(null);
    setText('');
    setName('');
    setGrade('');
    setSection('');
  };

  return (
    <Card className="mb-8">
      <form onSubmit={handleSubmit}>
        <h3 className="text-lg font-bold text-slate-700 mb-4">شاركنا شعورك</h3>
        
        <div className="mb-4">
          <label htmlFor="studentName" className="block text-slate-600 mb-2">1. ما هو اسمك؟</label>
          <input
            id="studentName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اكتب اسمك هنا"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            required
            aria-required="true"
          />
        </div>

        <div className="mb-4">
          <p className="block text-slate-600 mb-2">2. في أي صف أنت؟</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="grade" className="sr-only">الصف</label>
              <select
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                required
                aria-required="true"
              >
                <option value="" disabled>اختر الصف</option>
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="section" className="sr-only">الشعبة</label>
              <select
                id="section"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                required
                aria-required="true"
              >
                <option value="" disabled>اختر الشعبة</option>
                {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-slate-600 mb-2">3. اختر الرمز الذي يعبر عن حالك:</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 p-3 bg-slate-100 rounded-lg">
            {EMOJIS.map((emojiData) => (
              <button
                key={emojiData.emoji}
                type="button"
                onClick={() => setSelectedEmoji(emojiData.emoji)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-transform transform hover:scale-110 ${selectedEmoji === emojiData.emoji ? 'bg-indigo-200 ring-2 ring-indigo-500 scale-110' : 'hover:bg-slate-200'}`}
                aria-label={`اختر ${emojiData.label}`}
              >
                <span className="text-4xl">{emojiData.emoji}</span>
                <span className="text-xs mt-1 text-slate-700 font-medium">{emojiData.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="responseText" className="block text-slate-600 mb-2">4. (اختياري) هل تود مشاركة المزيد؟</label>
          <textarea
            id="responseText"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="يمكنك الكتابة هنا..."
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
          />
        </div>
        <button
          type="submit"
          disabled={!selectedEmoji || !name.trim() || !grade || !section}
          className="w-full bg-teal-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-600 transition-transform transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100"
        >
          إرسال الإجابة
        </button>
      </form>
    </Card>
  );
};

interface ResponseListProps {
  responses: StudentResponse[];
}

const ResponseList: React.FC<ResponseListProps> = ({ responses }) => (
    <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">إجابات الطلاب</h2>
        {responses.length === 0 ? (
            <p className="text-center text-slate-500 py-8">لم يتم استلام أي إجابات بعد.</p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {responses.map((response) => (
                <div key={response.id} className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center text-center transition-transform transform hover:-translate-y-1">
                  <h4 className="font-bold text-slate-800 text-lg">{response.name}</h4>
                  <p className="text-sm text-slate-500 mb-3">{response.className}</p>
                  <span className="text-6xl mb-4">{response.emoji}</span>
                  {response.text && <p className="text-slate-600 italic break-words w-full">"{response.text}"</p>}
                </div>
            ))}
            </div>
        )}
    </div>
);


// --- Main App Component ---

function App() {
  const [question, setQuestion] = useState<string>('');
  const [responses, setResponses] = useState<StudentResponse[]>([]);

  const handleSetQuestion = (newQuestion: string) => {
    setQuestion(newQuestion);
    setResponses([]); // Reset responses for the new question
  };

  const handleAddResponse = (response: Omit<StudentResponse, 'id'>) => {
    setResponses(prev => [...prev, { ...response, id: Date.now() }]);
  };

  const resetForNewQuestion = () => {
    setQuestion('');
    setResponses([]);
  };

  return (
    <div className="min-h-screen text-slate-800 py-10 px-4">
      <main className="max-w-4xl mx-auto">
        <Header />

        {!question ? (
          <EducatorForm setQuestion={handleSetQuestion} />
        ) : (
          <div>
            <QuestionDisplay question={question} onReset={resetForNewQuestion} />
            <StudentResponseForm addResponse={handleAddResponse} />
            <ResponseList responses={responses} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
