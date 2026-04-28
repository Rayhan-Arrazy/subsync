import React, { useState, useEffect } from 'react';

const App = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/subscriptions');
      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }
      const data = await response.json();
      setSubscriptions(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-xl font-bold">S</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              SubSync
            </h1>
          </div>
          <nav>
            <button 
              onClick={fetchSubscriptions}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium border border-slate-700"
            >
              Refresh Data
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">My Subscriptions</h2>
            <p className="text-slate-400">Manage and track your active subscriptions.</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-red-400">
              <p className="font-semibold">Error loading subscriptions</p>
              <p className="text-sm opacity-80">{error}</p>
              <button 
                onClick={fetchSubscriptions}
                className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 p-12 rounded-3xl text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                💸
              </div>
              <h3 className="text-xl font-semibold mb-2">No subscriptions found</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                Your subscription list is empty. Start adding subscriptions to keep track of your spending.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions.map((sub) => (
                <div 
                  key={sub.id} 
                  className="group bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:shadow-indigo-500/5"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-xl group-hover:bg-indigo-600/20 transition-colors">
                      {sub.serviceName?.charAt(0) || 'S'}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sub.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                      {sub.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{sub.serviceName}</h3>
                  <p className="text-slate-400 text-sm mb-4">{sub.planName || 'Standard Plan'}</p>
                  
                  <div className="flex justify-between items-end mt-auto">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Next Renewal</p>
                      <p className="font-medium text-slate-300">{new Date(sub.nextRenewalDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Price</p>
                      <p className="text-2xl font-bold text-indigo-400">${sub.monthlyCost?.toFixed(2) || '0.00'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-slate-900 mt-20">
        <p className="text-slate-500 text-sm text-center">
          &copy; {new Date().getFullYear()} SubSync. Built with React and Tailwind CSS.
        </p>
      </footer>
    </div>
  );
};

export default App;
