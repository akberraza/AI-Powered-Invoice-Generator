import {useNavigate, useLocation} from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import {Plus, Trash2} from 'lucide-react';
import toast from 'react-hot-toast';
import moment from 'moment';
import {useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';

import InputField from '../../components/ui/InputField';
import TextareaField from '../../components/ui/TextareaField';
import SelectField from '../../components/ui/SelectField';
import Button from '../../components/ui/Button';

const CreateInvoice = ({existingInvoice, onSave}) => {

  const navigate = useNavigate();
  const location = useLocation();
  const {user} = useAuth();

  const [formData, setformData] = useState(
    existingInvoice || {
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: "",
      billForm: {
        businessName: user?.businessName || "",
        email: user?.email || "",
        address: user?.address || "",
        phone: user?.phone || ""
      },
      billTo: {clientName: "", email: "", address: "", phone: ""},
      items: [{name: "", quantity: 1, unitPrice: 0, taxPercent: 0 }],
      notes: "",
      paymentTerm: 'Net 15',
    }
  );

  const [loading, setLoading] = useState(false);
  const [isGeneratingNumber, setIsGeneratingNumber] = useState(!existingInvoice);

  useEffect(() => {
    const aiData = location.state?.aiData;

    if(aiData){
      setformData(prev => ({
        ...prev,
        billTo: {
          clientName: aiData.clientName || '',
          email: aiData.email || '',
          address: aiData.address || '',
          phone: ''
        },
        items: aiData.items || [{name: "", quantity: 1, unitPrice: 0, taxPercent: 0}],
      }))
    }

    if(existingInvoice){
      setformData({
        ...existingInvoice,
        invoiceDate: moment(existingInvoice.invoiceDate).format('YYYY-MM-DD'),
        dueDate: moment(existingInvoice.dueDate).format('YYYY-MM-DD')
      });
    }else{
      const generateNewInvoiceNumber = async() => {
        isGeneratingNumber(true);
        try {
          
            const response = await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES);
            const invoice = response.data;
            const maxNum = 0;
            invoice.forEach((inv) => {
              const num = parseInt(inv.invoiceNumber.split("-")[1]);
              if(!isNaN(num) && num > maxNum) maxNum = num;
            })
              const newInvoiceNumber = `INV-${String(maxNum + 1).padStart(3, '0')}`;
              setformData((prev) => ({...prev, invoiceNumber: newInvoiceNumber}));
        } catch (err) {
          console.error("Failed to generate invoice number", err);
          setformData((prev) => ({...prev , invoiceNumber: `INV-${Date.now().toString().slice(-5)}`}));
        }
        setIsGeneratingNumber(false);
      }
      generateNewInvoiceNumber();
    }
  }, [existingInvoice]);

  const handleInputChange = (e, section, index) => {}

  const handleAddItem = () => {
    setformData({...formData, items: [...formData.items, {name: "", quantity: 1, unitPrice: 0, taxPercent: 0}]});
  }

  const handleRemoveItem = (index) => {}

  const {subTotal, taxTotal, total} = (() => {
    let subTotal = 0, taxTotal = 0;
    formData.items.forEach((item) => {
      const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
      subTotal += itemTotal;
      taxTotal += itemTotal * ((item.taxPercent || 0) / 100);
    });
    return {subTotal, taxTotal, total: subTotal + taxTotal}
  })();

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
  }

  return (
   <form onSubmit={handleSubmit} className=''>
    <div className=''>
      <h2 className=''>{existingInvoice ? "Edit Invoice" : "Create Invoice"}</h2>
      <Button type="submit" isLoading={loading || isGeneratingNumber} >
         {existingInvoice ? "Save Changes" : "Save Invoice"}
      </Button>
    </div>

    <div className=''>
      <div className=''>
          <InputField 
             label='Invoice Number'
             name='invoiceNumber'
             readOnly
             value={formData.invoiceNumber}
             placeholder={isGeneratingNumber ? "Generating...": ""}
             disabled
          />
          <InputField label='Invoice Date' type='date' name='invoiceDate' value={formData.invoiceDate} onChange={handleInputChange} />
          <InputField label='Due Date' type='date' name='dueDate' value={formData.dueDate} onChange={handleInputChange}  />

      </div>
    </div>

    <div className=''>
      <div className=''>
        <h3 className=''>Bill From</h3>
        <InputField label='Business Name' name='businessName'  value={formData.billForm.businessName} onChange={(e) => handleInputChange(e, 'billFrom')} />
        <InputField label='Email' type='email' name='email' value={formData.billForm.email} onChange={(e) => handleInputChange(e, 'billFrom')} />
        <TextareaField label='Address' name='address' value={formData.billForm.address} onChange={(e) => handleInputChange(e, 'billFrom')} />
      </div>
    </div>

   </form>
  )
}

export default CreateInvoice