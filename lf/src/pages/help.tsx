import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/help.css";

interface Message {
  sender: "bot" | "user";
  text: string;
}

interface Category {
  name: string;
  questions: { q: string; a: string | null }[];
}

const Help: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stage, setStage] = useState<"category" | "question">("category");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const navigate = useNavigate();

  const categories: Category[] = [
    {
      name: "General Assistance",
      questions: [
        {
          q: "What is a lost and found service?",
          a: "A lost and found service helps people report items they have lost and allows others to report items they have found. Our goal is to help reunite owners with their lost belongings as quickly as possible.",
        },
        {
          q: "How does this process work?",
          a: "You can report a lost or found item through our website. Our system matches reports and notifies you if there's a possible match. You can also search for items or contact support for more help.",
        },
        {
          q: "Can I see a list of all lost or found items?",
          a: "Yes, you can browse our listings of lost and found items.",
        },
        {
          q: "Is my information kept private?",
          a: "Absolutely. Your contact details and personal information are kept confidential and are only shared when necessary to help recover your item.",
        },
        {
          q: "How do I know if my lost item has been found?",
          a: "We’ll notify you via email or phone if there’s a possible match with your report. You can also check the listings anytime.",
        },
      ],
    },
    {
      name: "Contact Support",
      questions: [
        {
          q: "How can I contact a support representative?",
          a: "You can reach our support team by using the chatbox, calling our helpline, or sending an email through the contact form on our website. We’re here to help!",
        },
        {
          q: "What are your support hours?",
          a: "Our support team is available Monday to Friday, from 9:00 AM to 6:00 PM. For urgent issues outside these hours, please leave a message and we will get back to you as soon as possible.",
        },
        {
          q: "Can I get help if I don’t understand how to use the lost and found service?",
          a: "Absolutely! Our support team can guide you through reporting, searching, or claiming items. Just reach out through the chat or call, and we’ll assist you step-by-step.",
        },
      ],
    },
    {
      name: "Report Lost Item",
      questions: [
        {
          q: "How do I report a lost item?",
          a: "You can report a lost item by providing a detailed description of the item, when and where you lost it, and your contact information. Uploading a photo helps us identify it more easily.",
        },
        {
          q: "Can I update my lost item report if I remember more information later?",
          a: "Yes, you can update or add details to your existing report at any time through your account or by contacting support.",
        },
        {
          q: "Is there a deadline for reporting a lost item?",
          a: "It’s best to report your lost item as soon as possible to increase the chances of recovery. However, you can report an item at any time.",
        },
        {
          q: "Will I be notified if my lost item is found?",
          a: "Yes, if there’s a match with a found item, we will notify you by email or phone using the contact information you provided.",
        },
      ],
    },
    {
      name: "Report Found Item",
      questions: [
        {
          q: "How do I report a found item?",
          a: "You can report a found item by providing a detailed description of the item, where and when you found it, and your contact information. Uploading a photo is very helpful to identify the item.",
        },
        {
          q: "What information should I include when reporting a found item?",
          a: "Please include a clear description of the item, the exact location and date where you found it, any distinguishing features, and your preferred way to be contacted.",
        },
        {
          q: "Can I update my found item report if I remember additional details?",
          a: "Yes, you can update or add more information to your found item report anytime through your account or by contacting support.",
        },
      ],
    },

    {
      name: "Claim Item",
      questions: [
        {
          q: "How can I claim an item?",
          a: " To claim an item, you will need to provide a description of the item, details of when and where you lost it, and your contact information. You may be asked to verify ownership by answering specific questions or showing identification.",
        },
        {
          q: "What proof do I need to claim a found item?",
          a: "Proof of ownership can include a detailed description, a photo of the item, receipts, or distinctive features only the owner would know. For security, identification such as a government-issued ID may also be required.",
        },
        {
          q: "Can someone else claim the item on my behalf?",
          a: "Yes, but the person claiming on your behalf will usually need a letter of authorization and valid identification. They should also have specific details about the item to confirm ownership.",
        },
        {
          q: "What is the process after I request to claim an item?",
          a: "After you submit your claim, the lost and found team will verify your details and contact you to arrange pick-up or delivery. Some places require claims to be made during specified hours.",
        },
        {
          q: "How long do I have to claim my lost item?",
          a: " Items are typically kept for a set period depending on the policy. If not claimed within that time, items may be donated, disposed of, or handled according to the organization's lost and found rules.",
        },
      ],
    },
    {
      name: "Update or Cancel Report",
      questions: [
        {
          q: "How can I update the details of my lost or found item report?",
          a: "Go to 'My Reports' and click 'Edit' to update details.",
        },
        {
          q: "How to cancel my report?",
          a: "To cancel a report, please log into your account and delete the report, or contact our support team to help you cancel it.",
        },
        {
          q: "What happens after I cancel my report?",
          a: "Once your report is canceled, it will be removed from the system and no longer visible to others. If someone finds the item, no notifications will be sent to you.",
        },
        {
          q: "Can I reactivate a canceled report if I change my mind?",
          a: "Typically, canceled reports cannot be reactivated. However, you can create a new report at any time if you still need assistance with the item.",
        },
      ],
    },
  ];

  useEffect(() => {
    setMessages([{ sender: "bot", text: "Please choose a category:" }]);
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName);
    if (!category) return;

    setSelectedCategory(category);
    setMessages((prev) => [...prev, { sender: "user", text: categoryName }]);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: `Here are the questions for ${categoryName}:` },
    ]);
    setStage("question");
  };

  const handleQuestionClick = (question: string) => {
    if (question === "Done — Go Back to Home") {
      navigate("/");
      return;
    }

    setMessages((prev) => [...prev, { sender: "user", text: question }]);

    const answer =
      selectedCategory?.questions.find((f) => f.q === question)?.a ||
      "Sorry, I don't have an answer for that.";

    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: answer },
      { sender: "bot", text: "Please choose a category:" },
    ]);

    setStage("category");
    setSelectedCategory(null);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Support Center</div>

      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}

        {stage === "category" && (
          <div className="options">
            {categories.map((cat, idx) => (
              <button key={idx} onClick={() => handleCategoryClick(cat.name)}>
                {cat.name}
              </button>
            ))}
            <button
              onClick={() => handleQuestionClick("Done — Go Back to Home")}
            >
              Done — Go Back to Home
            </button>
          </div>
        )}

        {stage === "question" && selectedCategory && (
          <div className="options">
            {selectedCategory.questions.map((q, idx) => (
              <button key={idx} onClick={() => handleQuestionClick(q.q)}>
                {q.q}
              </button>
            ))}
            <button onClick={() => setStage("category")}>
              Back to Categories
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Help;
