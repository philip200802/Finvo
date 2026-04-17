import { Send } from 'lucide-react'

function SupportView() {
    return (
        <div className="support-container">
            <div className="mb-4">
                <h2 className="page-title mb-2">AI Support Assistant</h2>
                <p className="text-secondary">Chat with our AI to get help with invoicing, clients, reports, and more.</p>
            </div>

            <div className="chat-container">
                <div className="chat-messages">
                    <div className="chat-message bot">
                        <div className="chat-bubble">
                            <p className="mb-0">Hello! 👋 I'm your Finvo AI Support Assistant. How can I help you today?</p>
                        </div>
                    </div>
                </div>

                <div className="chat-input-wrap">
                    <div className="d-flex gap-2 align-items-flex-end">
                        <textarea
                            className="form-control finvo-input flex-grow-1"
                            placeholder="Type your question here... (Shift+Enter for new line)"
                            rows="3"
                            style={{ maxHeight: '120px', resize: 'none' }}
                        />
                        <button
                            className="btn btn-primary d-flex align-items-center gap-2"
                            type="button"
                        >
                            <Send size={16} />
                            <span className="d-none d-sm-inline">Send</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SupportView
