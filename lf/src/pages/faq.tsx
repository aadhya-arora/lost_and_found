import { useState } from "react";
import faq from "../assets/faq.png";
import "../styling/faq.css";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";

interface Question {
  question: string;
  answer: string;
}

interface Category {
  title: string;
  questions: Question[];
}

const Faq = () => {
  const navigate = useNavigate();
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(
    null
  );

  const categories: Category[] = [
    {
      title: "About us",
      questions: [
        {
          question: "What is this lost and found platform about?",
          answer:
            "Our platform helps people report lost items and connect with those who may have found them, making it easier to recover valuable belongings.",
        },
        {
          question: "Is this service free to use?",
          answer:
            "Yes, listing and searching for lost or found items on our platform is completely free.",
        },
        {
          question: "How do I get started?",
          answer:
            "Simply create an account, and you can start posting lost or found items immediately.",
        },
        {
          question: "Is my personal information safe?",
          answer:
            "Yes, we take your privacy seriously. Your contact information is only shared when you approve a claim.",
        },
        {
          question: "How do you verify found items?",
          answer:
            "We ask finders to provide clear photos and detailed descriptions to help owners identify their items accurately.",
        },
        {
          question: "Can I use this platform internationally?",
          answer:
            "Currently, we support listings primarily in select countries. Please check our supported locations page for details.",
        },
        {
          question: "What types of items can I list?",
          answer:
            "You can list anything from personal belongings like wallets and keys to electronics, documents, and even pets.",
        },
        {
          question: "Do I need to pay to claim an item?",
          answer:
            "No, there is no fee for claiming items. We encourage honest and community-driven exchanges.",
        },
        {
          question: "Can I report suspicious activity?",
          answer:
            "Yes, you can report suspicious or fraudulent activity directly through our support page.",
        },
        {
          question: "How do I delete my account?",
          answer:
            "You can deactivate or delete your account from the account settings page anytime.",
        },
      ],
    },
    {
      title: "Guest relations",
      questions: [
        {
          question: "How do I contact someone who listed a found item?",
          answer:
            "Once you find a potential match, you can send a secure message through our platform.",
        },
        {
          question: "How do I confirm if the item is mine?",
          answer:
            "Provide specific details, proof of ownership (like photos or receipts), or unique identifiers to verify your claim.",
        },
        {
          question: "What if someone falsely claims my item?",
          answer:
            "We thoroughly review each claim and encourage you to provide detailed evidence to avoid wrongful claims.",
        },
        {
          question: "Can I leave feedback for a finder?",
          answer:
            "Yes, after successfully recovering an item, you can leave feedback to appreciate the finder’s honesty.",
        },
        {
          question: "What should I do if I suspect a scam?",
          answer:
            "Report the listing or user immediately using the 'Report' button on the item page.",
        },
        {
          question: "Can I block certain users?",
          answer:
            "Yes, you can block users from messaging or interacting with your listings in your privacy settings.",
        },
        {
          question: "Can I share my listing on social media?",
          answer:
            "Yes, you can share directly via Facebook, Twitter, WhatsApp, and other platforms to increase reach.",
        },
      ],
    },
    {
      title: "One Key™",
      questions: [
        {
          question: "What is One Key™?",
          answer:
            "One Key™ is our optional verification badge program to build trust among users.",
        },
        {
          question: "How can I get verified with One Key™?",
          answer:
            "Submit a government-issued ID and complete a quick video verification process.",
        },
        {
          question: "Is One Key™ mandatory?",
          answer:
            "No, but we recommend it to enhance credibility and increase the chances of reuniting items safely.",
        },
        {
          question: "What benefits do I get with One Key™?",
          answer:
            "Verified users receive higher visibility, priority support, and trust badges on their listings.",
        },
      ],
    },
    {
      title: "Property listing",
      questions: [
        {
          question: "How do I list a found item?",
          answer:
            "Click on 'Post Found Item', provide details, photos, and your contact preferences, then publish.",
        },
        {
          question: "Can I update my listing later?",
          answer:
            "Yes, you can edit descriptions, update photos, or mark it as returned once claimed.",
        },
        {
          question: "What information should I include?",
          answer:
            "Include location where found, time, a detailed description, and any unique identifiers.",
        },
        {
          question: "Can I remove my listing after it's claimed?",
          answer:
            "Yes, you can mark it as returned or delete the listing permanently.",
        },
        {
          question: "How long will my listing stay active?",
          answer:
            "Listings remain active for 60 days by default, but you can extend or close them anytime.",
        },
        {
          question: "Can I list multiple items at once?",
          answer:
            "Yes, you can create separate listings for each item to ensure clarity and easier searching.",
        },
        {
          question: "Do I need to upload photos?",
          answer:
            "Photos are highly recommended as they help owners recognize their items more easily.",
        },
        {
          question: "Can I change the location on my listing?",
          answer:
            "Yes, you can update the location details anytime from your listing dashboard.",
        },
      ],
    },
  ];

  const currentCategory = categories[activeCategoryIndex];

  const handleCategoryClick = (index: number) => {
    setActiveCategoryIndex(index);
    setActiveQuestionIndex(null);
  };

  const toggleQuestion = (index: number) => {
    setActiveQuestionIndex(activeQuestionIndex === index ? null : index);
  };

  return (
    <div>
      <div className="faq-hero">
        <div className="faq-hero-left">
          <h1 className="faq-info-heading">FAQs</h1>
          <div className="faq-info-para">
            <p>
              Have questions? Here you’ll find answers valued by our partners
              and community members. We’ve gathered clear explanations, helpful
              guidance, and step-by-step instructions to support you throughout
              your lost and found journey. Whether you’re reporting an item,
              searching for something important, or learning how the platform
              works, this section will help you navigate with confidence.
            </p>
           <button 
              className="ask-btn" 
              onClick={() => navigate("/contact")}
            >
              Ask Your Own Questions <span className="arrow">→</span>{" "}
            </button>
          </div>
        </div>
        <div className="faq-hero-right">
          <img src={faq} className="faq-img" alt="FAQ illustration" />
        </div>
      </div>

      <div className="faq-content">
        <div className="faq-sidebar">
          <ul>
            {categories.map((category, index) => (
              <li
                key={index}
                onClick={() => handleCategoryClick(index)}
                style={{
                  fontWeight: activeCategoryIndex === index ? "bold" : "normal",
                  textDecoration:
                    activeCategoryIndex === index ? "underline" : "none",
                }}
              >
                {category.title}
              </li>
            ))}
          </ul>
        </div>

        <div className="faq-main">
          <h2>{currentCategory.title}</h2>
          {currentCategory.questions.map((q, index) => (
            <div key={index} className="faq-question-item">
              <div
                className="faq-question"
                onClick={() => toggleQuestion(index)}
              >
                {q.question}
                <span
                  className={`arrow ${
                    activeQuestionIndex === index ? "open" : ""
                  }`}
                >
                  ▼
                </span>
              </div>
              {activeQuestionIndex === index && (
                <div className="faq-answer">{q.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Faq;
