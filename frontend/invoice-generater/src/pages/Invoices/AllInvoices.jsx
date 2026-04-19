import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import {Loader2, Trash2, Edit, Search, FileText, Plus, AlertCircle, Sparkles, Mail } from 'lucide-react';
import moment from 'moment';
import {useNavigate} from 'react-router-dom';
import Button from '../../components/ui/Button';
import { useEffect, useMemo, useState } from 'react';

const AllInvoices = () => {

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusChangeLoading, setStatusChangeLoading] = useState(null);
  const [searchTerms, setSearchTerms] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedInvoiceId, setselectedInvoiceId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async() => {
      try {
          const response =  await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES);
          setInvoices(response.data.sort((a, b)=> new Date(b.invoiceDate) - new Date(a.invoiceDate)));
      } catch (err) {
        setError("Failed to fetch invoices.")
      }finally{
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const handleDelete = async () => {}

  const handleStatusChange = async (invoice) => {}

  const handleOpenReminderModal = (invoiceId) => {
    setselectedInvoiceId(invoiceId);
    setIsReminderModalOpen(true);
  }

  const filteredInvoices = useMemo(() => {
    return invoices
       .filter(invoice => statusFilter === 'All' || invoice.status === statusFilter)
       .filter(invoice => 
           invoice.invoiceNumber.toLowerCase().includes(searchTerms.toLowerCase()) ||
           invoice.billTo.clientName.toLowarCase().includes(searchTerms.toLowerCase())
       );
  }, [invoices, searchTerms, statusFilter]);

  if(loading){
    return <div className='flex justify-center  w-8 h-8 animate-spin text-blue-600  h-96 '><Loader2 className='' /> </div>
  }

  return (
     <div className=''>
      <CreaWithAIModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
        <ReminderModal isOpen={isReminderModalOpen} onClose={() =>setIsReminderModalOpen(false)} invoiceId={selectedInvoiceId} />
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
             <div>
              <h1 className='text-2xl font-semibold text-slate-900'>All Invoices</h1>
              <p className='text-sm text-slate-600 mt-1'>Manage all your invoices in one place.</p>
             </div>
             <div className='flex items-center gap-2'>
              <Button variant='secondary' onClick={() => setIsAiModalOpen(true)} icon={Sparkles}>Create with AI</Button>
              <Button onClick={() => navigate('/invoices/new')} icon={Plus}>Create Invoice </Button>
             </div>
          </div>
          {error && ()}
     </div>
  )
}

export default AllInvoices