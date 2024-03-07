import React, { useState } from "react";
import "./style.css";

export const Faq = (props) => {
  const [openIndex, setOpenIndex] = useState(null);
  const handleAccordionClick = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <>
      <section id="FAQ" className="mt-5 mb-5">
        <div className="container">
          <div className="col-md-12 m-4 mt-5 text-center">
            <h1>FAQ`s</h1>
          </div>
          <div className="accordion accordion-flush" id="accordionFlushExample">
            {props?.reviews?.map((item, index) => (
              <div className="accordion-item" key={index}>
                <h2 className="accordion-header" id={`flush-heading${index}`}>
                  <button
                    className={`accordion-button ${openIndex === index ? "" : "collapsed"}`}
                    type="button"
                    onClick={() => handleAccordionClick(index)}
                    aria-expanded={openIndex === index}
                    aria-controls={`flush-collapse${index}`}
                  >
                    {item.question}
                  </button>
                </h2>
                <div
                  id={`flush-collapse${index}`}
                  className={`accordion-collapse collapse ${openIndex === index ? "show" : ""}`}
                  aria-labelledby={`flush-heading${index}`}
                  data-bs-parent="#accordionFlushExample"
                  style={{ visibility: 'visible' }} // Add this line
                >
                  <div className="accordion-body">{item.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
