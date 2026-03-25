import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { baseUrl as apiHost } from './config'
import './Faq.css'

const baseUrl = `${apiHost}/api`

const Faq = () => {
  useEffect(()=>{
    document.title="LMS | FAQ's Help "
  }, [])

  const [faqData, setFaqData]=useState([]);

  useEffect(()=>{
    axios.get(baseUrl+'/faq/')
      .then((res)=>{
        setFaqData(Array.isArray(res.data) ? res.data : []);
      })
      .catch((error)=>{
        console.log(error);
      });
  },[]);

  return (
    <div className='faq-page-shell'>
      <div className='container faq-page-container'>
        <div className='faq-hero glass-card'>
          <p className='faq-kicker'>Help Center</p>
          <h2 className='faq-title'>Frequently Asked Questions</h2>
          <p className='faq-subtitle'>
            Quick answers for students and teachers about registration, approvals, courses,
            assignments, quizzes, certificates, and support.
          </p>
        </div>

        {!faqData.length && (
          <div className="faq-empty glass-card">No FAQ entries are available yet.</div>
        )}

        <div className="faq-list" id="faqAccordion">
          {faqData.map((row, index) => {
            const headingId = `faq-heading-${index}`;
            const collapseId = `faq-collapse-${index}`;
            const isFirst = index === 0;

            return (
              <div className="faq-item glass-card" key={collapseId}>
                <h2 className="accordion-header faq-item-header" id={headingId}>
                  <button
                    className={`faq-question ${isFirst ? '' : 'collapsed'}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${collapseId}`}
                    aria-expanded={isFirst ? 'true' : 'false'}
                    aria-controls={collapseId}
                  >
                    <span className='faq-question-index'>{String(index + 1).padStart(2, '0')}</span>
                    <span className='faq-question-text'>{row.question}</span>
                  </button>
                </h2>
                <div
                  id={collapseId}
                  className={`accordion-collapse collapse ${isFirst ? 'show' : ''}`}
                  aria-labelledby={headingId}
                  data-bs-parent="#faqAccordion"
                >
                  <div className="faq-answer">{row.answer}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default Faq
