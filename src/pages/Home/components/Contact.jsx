import React, { useState } from 'react';
import '../styles/Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            setStatus('error');
            return;
        }
        // Simulate submission
        setStatus('success');
        setTimeout(() => setStatus(''), 3000);
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <section id="contact" className="contact-section">
            <div className="contact-container">
                <div className="contact-header">
                    <h2>Get in Touch</h2>
                    <p>Have questions? We're here to help.</p>
                    <p>Email us at: <a href="mailto:nadeemsahun@gmail.com">nadeemsahun@gmail.com</a></p>
                </div>
                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="How can we help you?"
                            rows="4"
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary submit-btn">
                        Send Message
                    </button>
                    {status === 'success' && <p className="success-msg">Message sent successfully!</p>}
                    {status === 'error' && <p className="error-msg">Please fill in all fields.</p>}
                </form>
            </div>
        </section>
    );
};

export default Contact;
