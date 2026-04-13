const axios = require("axios");
const Invoice = require("../models/invoice.js");
const invoice = require("../models/invoice.js");

const parseInvoiceFromText = async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: "Text is required" });
    }

    try {
        const prompt = `
                     Extract invoice data and return ONLY valid JSON.

                 {
                    "clientName": "",
                    "email": "",
                    "address": "",
                    "items": [
                 {
                    "name": "",
                    "quantity": 0,
                    "unitPrice": 0
                 }
                   ]
                 }

                  Rules:
                   - No explanation
                   - No markdown
                   - Only JSON

                     Text:
                         ${text}
                  `;

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "arcee-ai/trinity-large-preview:free",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                response_format: {
                    type: "json_object"
                }
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        let aiText = response.data.choices[0].message.content;

        const parsedData = JSON.parse(aiText);

        res.status(200).json(parsedData);

    } catch (err) {
        console.error("AI ERROR:", err.response?.data || err.message);

        res.status(500).json({
            message: "Failed to parse invoice data",
            error: err.message
        });
    }
};

const generateReminderEmail = async (req, res) => {
    const { invoiceId } = req.body;

    if (!invoiceId) {
        return res.status(400).json({ message: "Invoice ID is required" });
    }

    try {
        const invoice = await Invoice.findById(invoiceId);

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        const clientName = invoice.billTo?.clientName || "Client";
        const amount = invoice.total?.toFixed(2) || "0.00";
        const dueDate = invoice.dueDate
            ? new Date(invoice.dueDate).toLocaleDateString()
            : "N/A";

        const prompt = `
               You are a professional and polite accounting assistant. Write a friendly reminder email to a client about an overdue or upcoming invoice payment.

              Details:
               - Client Name: ${clientName}
               - Invoice Number: ${invoice.invoiceNumber}
               - Amount Due: ${amount}
               - Due Date: ${dueDate}

             Rules:
              - Start with "Subject:"
              - Keep it concise
              - Professional but friendly tone
              `;

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "arcee-ai/trinity-large-preview:free",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "Invoice AI App"
                }
            }
        );

        const reminderText =
            response.data.choices?.[0]?.message?.content ||
            "No response generated";

        res.status(200).json({ reminderText });

    } catch (err) {
        console.error("AI ERROR:", err.response?.data || err.message);

        res.status(500).json({
            message: "Failed to generate reminder email.",
            details: err.message
        });
    }
};

const getDashboardSummary = async (req, res) => {
    try {
        const invoices = await Invoice.find({ user: req.user.id });

        if (invoices.length === 0) {
            return res.status(200).json({
                insights: ["No invoice data available to generate insights."]
            });
        }

        const totalInvoices = invoices.length;

        const paidInvoices = invoices.filter(inv => inv.status === "paid");
        const unpaidInvoices = invoices.filter(inv => inv.status !== "paid");

        const totalRevenue = paidInvoices.reduce(
            (acc, inv) => acc + (inv.total || 0),
            0
        );

        const totalOutstanding = unpaidInvoices.reduce(
            (acc, inv) => acc + (inv.total || 0),
            0
        );

        const dataSummary = `
- Total number of invoices: ${totalInvoices}
- Total paid invoices: ${paidInvoices.length}
- Total unpaid/pending invoices: ${unpaidInvoices.length}
- Total revenue from paid invoices: ${totalRevenue.toFixed(2)}
- Total outstanding amount: ${totalOutstanding.toFixed(2)}
- Recent invoices: ${invoices
            .slice(0, 5)
            .map(
                inv =>
                    `Invoice#${inv.invoiceNumber} for ${inv.total?.toFixed(2) || 0} with status ${inv.status}`
            )
            .join(", ")}
`;

        const prompt = `
You are a friendly and insightful financial analyst for a small business owner.

Based on the following summary, generate 2-3 concise and actionable insights.

Rules:
- Return ONLY valid JSON
- No explanation
- No markdown

Format:
{
  "insights": ["...", "..."]
}

Data Summary:
${dataSummary}
`;

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "arcee-ai/trinity-large-preview:free",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                response_format: {
                    type: "json_object"
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "Invoice AI App"
                }
            }
        );

        let aiText =
            response.data.choices?.[0]?.message?.content || "{}";

        let parsedData;
        try {
            parsedData = JSON.parse(aiText);
        } catch {
            parsedData = {
                insights: ["Could not generate insights. Please try again."]
            };
        }

        res.status(200).json(parsedData);

    } catch (err) {
        console.error("AI ERROR:", err.response?.data || err.message);

        res.status(500).json({
            message: "Failed to generate dashboard insights.",
            details: err.message
        });
    }
};


module.exports = { parseInvoiceFromText, generateReminderEmail, getDashboardSummary };