import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin.service';
import { 
  CreditCard, 
  Search, 
  RefreshCcw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  IndianRupee,
  Loader2,
  Filter,
  ArrowUpRight
} from 'lucide-react';

const PaymentManager = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllPayments();
      setPayments(res.data);
    } catch (err) {
      console.error("Failed to fetch payments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, []);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
  };

  const filteredPayments = payments.filter(p => 
    p.razorpayOrderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-background-accent pb-6">
        <div>
          <h2 className="text-3xl font-black text-surface-text tracking-tight flex items-center gap-3">
            <CreditCard className="text-primary" size={32} />
            Transaction Ledger
          </h2>
          <p className="text-surface-muted text-sm mt-1">Audit and track all incoming revenue streams</p>
        </div>
        <button 
          onClick={fetchPayments}
          className="p-3 bg-surface border border-background-accent rounded-xl hover:bg-background-accent/20 transition-all text-surface-text"
        >
          <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface border border-background-accent p-5 rounded-3xl shadow-sm">
          <p className="text-[10px] font-bold text-surface-muted uppercase">Total Transactions</p>
          <h4 className="text-2xl font-black text-surface-text">{payments.length}</h4>
        </div>
        <div className="bg-surface border border-background-accent p-5 rounded-3xl shadow-sm">
          <p className="text-[10px] font-bold text-surface-muted uppercase">Success Rate</p>
          <h4 className="text-2xl font-black text-emerald-500">
            {payments.length ? ((payments.filter(p => p.status === 'success').length / payments.length) * 100).toFixed(1) : 0}%
          </h4>
        </div>
        <div className="bg-surface border border-background-accent p-5 rounded-3xl shadow-sm">
          <p className="text-[10px] font-bold text-surface-muted uppercase">Revenue Today</p>
          <h4 className="text-2xl font-black text-primary flex items-center gap-1">
            <IndianRupee size={20} />
            {payments.filter(p => p.status === 'success').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
          </h4>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-surface border border-background-accent rounded-3xl shadow-xl overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-background-accent bg-background-accent/5 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-muted" size={16} />
            <input 
              type="text"
              placeholder="Search by Order ID or User..."
              className="w-full bg-background border border-background-accent py-2 pl-10 pr-4 rounded-xl text-sm outline-none focus:border-primary transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase text-surface-muted border border-background-accent rounded-xl hover:bg-background/50">
            <Filter size={14} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" size={32} /></div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-background-accent/20 text-[10px] font-black uppercase tracking-[0.2em] text-surface-muted border-b border-background-accent">
                  <th className="p-5">Subscriber</th>
                  <th className="p-5">Order ID</th>
                  <th className="p-5">Amount</th>
                  <th className="p-5">Status</th>
                  <th className="p-5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-background-accent/50 text-sm">
                {filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-background-accent/5 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-background-accent/30 flex items-center justify-center text-surface-muted">
                          <User size={14} />
                        </div>
                        <div>
                          <p className="font-bold text-surface-text">{payment.userId?.name || "Guest User"}</p>
                          <p className="text-[10px] text-surface-muted">{payment.userId?.email || payment.userId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 font-mono text-xs text-surface-muted select-all">
                      {payment.razorpayOrderId}
                    </td>
                    <td className="p-5 font-bold text-surface-text italic">
                      ₹{payment.amount}
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider flex items-center w-fit gap-1.5 ${getStatusStyle(payment.status)}`}>
                        {payment.status === 'success' ? <CheckCircle2 size={12}/> : payment.status === 'failed' ? <XCircle size={12}/> : <Clock size={12}/>}
                        {payment.status}
                      </span>
                    </td>
                    <td className="p-5 text-surface-muted text-xs">
                      {new Date(payment.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentManager;