// ... (keep all the existing code above)

{/* Quick Actions */}
<div className="grid grid-cols-2 gap-3">
  <button 
    onClick={() => setShowGuidelines(true)}
    className="wf-card flex flex-col items-center gap-2 py-4 hover:border-wf-gold transition-colors"
  >
    <FileText size={24} className="text-wf-gold" />
    <span className="text-wf-ivory text-sm font-medium">Guidelines</span>
  </button>
  <button 
    onClick={() => setShowBugReport(true)}
    className="wf-card flex flex-col items-center gap-2 py-4 hover:border-wf-gold transition-colors"
  >
    <Bug size={24} className="text-wf-gold" />
    <span className="text-wf-ivory text-sm font-medium">Report Issue</span>
  </button>
</div>

// ... (keep all existing code)

{/* Report Issue Modal */}
{showBugReport && (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div 
      className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
      onClick={() => setShowBugReport(false)} 
    />
    <div className="relative bg-wf-black border border-wf-gray-light rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
      <div className="sticky top-0 bg-wf-black/95 backdrop-blur-md border-b border-wf-gray-light px-4 py-3 flex items-center justify-between">
        <h2 className="font-serif text-lg text-wf-ivory">Submit a Report</h2>
        <button 
          onClick={() => setShowBugReport(false)}
          className="p-1 hover:bg-wf-gray rounded-lg"
        >
          <X size={20} className="text-gray-400" />
        </button>
      </div>
      <div className="px-4 py-4">
        {bugSent ? (
          <div className="text-center py-8">
            <MessageSquare size={40} className="text-green-400 mx-auto mb-3" />
            <p className="text-green-400 font-medium text-lg">Report submitted!</p>
            <p className="text-gray-500 text-sm mt-1">Thanks for helping keep our community safe.</p>
          </div>
        ) : (
          <form onSubmit={handleBugSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Subject *</label>
              <input
                type="text"
                value={bugForm.subject}
                onChange={e => setBugForm({ ...bugForm, subject: e.target.value })}
                placeholder="What are you reporting?"
                className="w-full bg-wf-gray-light border border-wf-gray rounded-lg px-3 py-2 text-wf-ivory placeholder-gray-600 focus:border-wf-gold focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Description *</label>
              <textarea
                value={bugForm.description}
                onChange={e => setBugForm({ ...bugForm, description: e.target.value })}
                placeholder="Describe the issue or concern in detail..."
                className="w-full bg-wf-gray-light border border-wf-gray rounded-lg px-3 py-2 text-wf-ivory placeholder-gray-600 focus:border-wf-gold focus:outline-none resize-none"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Email (optional)</label>
              <input
                type="email"
                value={bugForm.email}
                onChange={e => setBugForm({ ...bugForm, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full bg-wf-gray-light border border-wf-gray rounded-lg px-3 py-2 text-wf-ivory placeholder-gray-600 focus:border-wf-gold focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={bugSubmitting}
              className="w-full bg-wf-gold text-wf-black font-semibold py-2.5 rounded-lg hover:bg-wf-gold/90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send size={16} />
              {bugSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        )}
      </div>
    </div>
  </div>
)}
