import React, { useState } from "react";
import servicesData from "../data/services.json";
import "../App.css";

export default function Contact() {
  const services = (servicesData && servicesData.services) || [];

  return (
    <section id="contact" className="contact-section">
      <div className="container contact-card">
        <h2>Contact</h2>
        <form
          action="https://send.pageclip.co/zKXWmL6UblXejMyBvwbrHn3XWauUJCPU"
          class="pageclip-form contact-form"
          method="post"
        >
          <label>
            <span>Name*</span>
            <input name="name" placeholder="Your name" className="form-input" />
          </label>

          <label>
            <span>Email or Phone*</span>
            <input
              name="contact"
              placeholder="email@example.com or +123456789"
              className="form-input"
            />
          </label>

          <label>
            <span>Services (optional)</span>
            <select name="service" className="form-input">
              <option value="">-- Select a service (optional) --</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
              <option value="other">Other</option>
            </select>
          </label>

          <label>
            <span>Query*</span>
            <textarea
              name="query"
              placeholder="How can I help?"
              rows={4}
              className="form-input"
            />
          </label>

          <div className="contact-actions">
            <button type="submit" className="pageclip-form__submit btn-primary">
              <span>Send</span>
            </button>
            {status && (
              <span
                className={
                  "contact-status " +
                  (status.type === "error" ? "error" : "success")
                }
              >
                {status.message}
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
