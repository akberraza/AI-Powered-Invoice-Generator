const Invoice = require('../models/invoice.js');

// @desc   Create new invoice
// @route  POST /api/invoices
// @access Private
exports.createInvoice = async (req, res) => {
    try {
        const user = req.user;
        const {
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms
        } = req.body;

        const updatedItems = items.map((item) => {
            const quantity = Number(item.quantity) || 0;
            const unitPrice = Number(item.unitPrice) || 0;
            const taxPercent = Number(item.taxPercent) || 0;

            const itemBase = quantity * unitPrice;
            const taxAmount = (itemBase * taxPercent) / 100;

            return {
                ...item,
                quantity,
                unitPrice,
                taxPercent,
                total: itemBase + taxAmount 
            };
        });

        let subtotal = 0;
        let taxtotal = 0;

        updatedItems.forEach((item) => {
            const itemBase = item.quantity * item.unitPrice;
            const taxAmount = (itemBase * item.taxPercent) / 100;

            subtotal += itemBase;
            taxtotal += taxAmount;
        });

        const total = subtotal + taxtotal;

        const invoice = new Invoice({
            user,
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items: updatedItems, 
            notes,
            paymentTerms,
            subtotal,
            taxtotal,
            total
        });

        await invoice.save();
        res.status(201).json(invoice);

    } catch (err) {
        res.status(500).json({
            message: 'Error creating invoice',
            error: err.message
        });
    }
};

// @desc   Get all invoices of logged-in user
// @route  Get /api/invoices
// @access Private
exports.getInvoices = async (req, res) => {
    try {

        const invoices = await Invoice.find({user: req.user.id}).populate("user", "name email");
        res.json(invoices)

    } catch (err) {
        res.status(500).json({
            message: 'Error fetching invoice',
            error: err.message
        })
    }
}

// @des     Get single Invoice by ID
// @route   Get /api/invoices/:id
// @access  Private
exports.getInvoicesById = async (req, res) => {
    try {

        const invoice = await Invoice.findById(req.params.id).populate("user", "name email");
        if(!invoice) return res.status(404).json({
            message: 'Invoice not found'
        })

        // Check if the invoice belongs to the user
        if(invoice.user.toString() !== req.user.id){
            return res.status(401).json({message: "Not authorized"});
        }

        res.json(invoice);

    } catch (err) {
        res.status(500).json({
            message: 'Error fetching invoice',
            error: err.message
        })
    }
}

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Private
exports.updateInvoice = async (req, res) => {
    try {

        const {
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms,
            status
        } = req.body;

        // recalculate totals if items changed
        let subtotal = 0;
        let taxtotal = 0;
        if(items && items.length > 0){
            items.forEach((item) => {
                subtotal += item.unitPrice * item.quantity;
                taxtotal += ((item.unitPrice * item.quantity) * (item.taxPercent || 0)) / 100;
            });
        } 

        const total = subtotal + taxtotal;
        const updatedInvoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            {
                invoiceNumber,
                invoiceDate,
                dueDate,
                billFrom,
                billTo,
                items,
                notes,
                paymentTerms,
                status,
                subtotal,
                taxtotal,
                total
            },{new: true}
        );

        if(!updatedInvoice) return res.status(404).json({message: "Invoice not found"});

        res.json(updatedInvoice);

    } catch (err) {
        res.status(500).json({
            message: 'Error updating invoice',
            error: err.message
        })
    }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private
exports.deleteInvoice = async (req, res) => {
    try {

        const invoice = await Invoice.findByIdAndDelete(req.params.id);
        if(!invoice) return res.status(404).json({message: "Invoice not found"});

        res.json({message: "Invoice deleted Successfully"});

    } catch (err) {
        res.status(500).json({
            message: 'Error deleting invoice',
            error: err.message
        })
    }
};