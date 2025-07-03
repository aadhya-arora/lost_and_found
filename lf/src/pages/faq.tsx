import faq from "../assets/faq.png";
import "../styling/faq.css";
import Footer from "../components/footer";
const Faq = () => {
  return (
    <div>
      <div className="faq-hero">
        <div className="faq-hero-left">
          <h1 className="faq-info-heading">FAQs</h1>
          <div className="faq-info-para">
            <p>
              Have questions? Here you’ll find the answers most valued by our
              partners, along with access to step-by-step instructions and
              support.
            </p>
          </div>
        </div>
        <div className="faq-hero-right">
          <img src={faq} className="faq-img" alt="FAQ illustration" />
        </div>
      </div>
      <div className="faq-sections-questions">
        <div className="sections"></div>
        <div className="questions"></div>
      </div>
      <Footer />
    </div>
  );
};

export default Faq;
