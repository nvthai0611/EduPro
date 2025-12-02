import React, { useState } from "react";

const QuestionPage = () => {
  const avatarURL = "https://www.gravatar.com/avatar?d=mp&s=80";

  // Data fake
  const [questions, setQuestions] = useState([
    {
      id: 1,
      userName: "Nguyễn Văn A",
      avatar: avatarURL,
      messages: [
        { id: 1, sender: "student", text: "Em chưa hiểu về useState trong ReactJS" },
      ],
      createdAt: "30-11-2025",
    },
    {
      id: 2,
      userName: "Trần Thị B",
      avatar: avatarURL,
      messages: [
        { id: 1, sender: "student", text: "Em chưa hiểu lắm về Components trong ReactJS" },
      ],
      createdAt: "1-12-2025",
    },
  ]);

  const [answerDraft, setAnswerDraft] = useState({});
  const [replyTarget, setReplyTarget] = useState(null); 
  const [replyQuestionId, setReplyQuestionId] = useState(null);

  // Tạo object message
  const createMessageObject = (text, sender, replyTo = null) => {
    return {
      id: Math.random().toString(36).slice(2),
      text,
      sender,
      replyTo: replyTo ? replyTo.id : null,
      createdAt: new Date(),
    };
  };

  // Thêm message vào câu hỏi
  const addMessageToQuestion = (questionId, newMessage) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, messages: [...q.messages, newMessage] } : q
      )
    );
  };

  // Khi bấm tin nhắn để reply
  const handleSelectReply = (qId, msg) => {
    setReplyTarget(msg);
    setReplyQuestionId(qId);
  };

  // Gửi tin nhắn
  const handleSend = (questionId) => {
    const text = answerDraft[questionId];
    if (!text?.trim()) return;

    let newMsg;

    // Nếu đang reply
    if (replyTarget && replyQuestionId === questionId) {
      newMsg = createMessageObject(text, "admin", replyTarget);
    } else {
      // Gửi bình thường
      newMsg = createMessageObject(text, "admin");
    }

    addMessageToQuestion(questionId, newMsg);

    // Reset
    setAnswerDraft((prev) => ({ ...prev, [questionId]: "" }));
    setReplyTarget(null);
    setReplyQuestionId(null);
  };

  // Lấy text tin nhắn khi reply
  const getMessageText = (questionId, msgId) => {
    const q = questions.find((q) => q.id === questionId);
    const msg = q?.messages.find((m) => m.id === msgId);
    return msg?.text || "";
  };

  // Bubble message UI
  const renderMessageBubble = (msg, qId) => (
    <div key={msg.id} className="flex flex-col">
      {msg.replyTo && (
        <div className="text-xs text-gray-500 ml-2 mb-1">
          ↪ "{getMessageText(qId, msg.replyTo)}"
        </div>
      )}

      <div
        className={`p-2 rounded-lg text-sm w-fit max-w-[75%] cursor-pointer ${
          msg.sender === "admin" ? "ml-auto bg-blue-100" : "mr-auto bg-gray-200"
        }`}
        onClick={() => handleSelectReply(qId, msg)}
      >
        {msg.text}
      </div>
    </div>
  );

  return (
    <div className="p-5">
      <h1 className="text-xl font-semibold mb-5">CÂU HỎI CỦA HỌC VIÊN</h1>

      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="border rounded-xl bg-white shadow-sm p-4">
            <div className="flex items-center gap-3">
              <img src={question.avatar} className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold">{question.userName}</p>
                <p className="text-xs text-gray-500">{question.createdAt}</p>
              </div>
            </div>

            <p className="mt-3 text-gray-800 font-medium">
              {question.messages[0].text}
            </p>

            {/* Bubble list */}
            <div className="mt-3 space-y-2">
              {question.messages.map((msg) =>
                renderMessageBubble(msg, question.id)
              )}
            </div>

            {/* Reply preview nằm ngay trên ô nhập */}
            {replyTarget && replyQuestionId === question.id && (
              <div className="mt-3 p-2 bg-yellow-100 rounded text-sm flex justify-between">
                <span>Đang trả lời: "{replyTarget.text}"</span>
                <button
                  className="text-red-600 text-xs"
                  onClick={() => {
                    setReplyTarget(null);
                    setReplyQuestionId(null);
                  }}
                >
                  Hủy
                </button>
              </div>
            )}

            {/* Ô nhập */}
            <textarea
              placeholder="Nhập câu trả lời"
              className="mt-3 w-full border rounded-lg p-2 text-sm"
              rows={2}
              value={answerDraft[question.id] || ""}
              onChange={(e) =>
                setAnswerDraft((prev) => ({ ...prev, [question.id]: e.target.value }))
              }
            />

            <button
              className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              onClick={() => handleSend(question.id)}
            >
              Gửi
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionPage;
