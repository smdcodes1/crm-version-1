import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { INITIAL_CUSTOMERS, INITIAL_SALES, INITIAL_FOLLOWUPS, INITIAL_INVOICES, INITIAL_QUOTATIONS, INITIAL_PROJECTS } from "../data/InitialData";
import { triggerNotification, subscribeToNotifications } from "../utils/Notification";
import { useAuth } from "./AuthContext";
const CRMContext = createContext();
export const useCRM = () => {
    const context = useContext(CRMContext);
    if (!context) {
        throw new Error('useCRM must be used within a CRMProvider');
    }
    return context;
};

export const CRMProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
    const [sales, setSales] = useState(INITIAL_SALES);
    const [followUps, setFollowUps] = useState(INITIAL_FOLLOWUPS);
    const [invoices, setInvoices] = useState(INITIAL_INVOICES);
    const [quotations, setQuotations] = useState(INITIAL_QUOTATIONS);
    const [projects, setProjects] = useState(INITIAL_PROJECTS);
    // modal handlers
    const [isAddSaleOpen, setIsAddSaleOpen] = useState(false);
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
    const [isCreateQuotationOpen, setIsCreateQuotationOpen] = useState(false);
    const [isGenerateInvoiceOpen, setIsGenerateInvoiceOpen] = useState(false);
    const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
    // AuthContext 
    const { user, setUser } = useAuth();
    // Notifications 
    const [notifications, setNotifications] = useState(() => [
        {
            id: 'notif_init_1',
            title: 'Follow-up Due Tomorrow',
            body: 'Call ABC Technologies regarding proposal details and kickoff timeline.',
            type: 'followup',
            timestamp: new Date().toISOString(),
            read: false,
        },
        {
            id: 'notif_init_2',
            title: 'Quotation Accepted',
            body: 'ABC Technologies accepted Quotation QT-0001 for ₹94,400.',
            type: 'quotation',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: true,
        },
    ]);
    // Initial Notification status 
    const getInitialNotificationStatus = (userId) => {
        if (!('Notification' in window)) return 'unsupported';

        // If browser permission is blocked at OS/Browser level
        if (Notification.permission === 'denied') {
            return 'denied';
        }

        // If browser permission is allowed, check if THIS specific user opted in
        if (Notification.permission === 'granted' && userId) {
            const storedStatus = localStorage.getItem(`notifications_enabled_${userId}`);
            // ONLY set as granted if explicitly saved for this user, otherwise default to pending/disabled
            return storedStatus === 'granted' ? 'granted' : 'default';
        }

        return 'default'; // Default for new users or ungranted status
    };
    const [notificationStatus, setNotificationStatus] = useState(() =>
        getInitialNotificationStatus(user?.id)
    );

    useEffect(() => {
        const unsubscribe = subscribeToNotifications((notif) => {
            setNotifications((prev) => [notif, ...prev]);
        });

        const fetchCustomers = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase.from('customers').select('*').eq('user_id', user.id);
                if (data) {
                    const mapped = data.map(c => ({
                        id: c.id,
                        companyName: c.company_name,
                        contactPerson: c.contact_person,
                        email: c.email,
                        phone: c.phone,
                        whatsapp: c.whatsapp,
                        industry: c.industry,
                        website: c.website,
                        address: c.address,
                        city: c.city,
                        state: c.state,
                        notes: c.notes,
                        status: c.status,
                        createdAt: c.created_at,
                        updatedAt: c.updated_at,
                    }));
                    setCustomers(mapped);
                }
            }
        };
        const fetchQuotations = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase.from('quotations').select('*').eq('user_id', user.id);
                if (data) {
                    const mapped = data.map(c => ({
                        id: c.id,
                        quotationNumber: c.quotation_number,
                        customerId: c.customer_id,
                        customerName: c.customer_name,
                        quotationDate: c.quotation_date,
                        validUntil: c.valid_until,
                        items: c.items,
                        subtotal: c.subtotal,
                        discount: c.discount,
                        taxPercentage: c.tax_percentage,
                        tax: c.tax,
                        total: c.total,
                        status: c.status,
                        notes: c.notes,
                        createdAt: c.created_at,
                    }));
                    setQuotations(mapped);
                }
            }
        };
        const fetchInvoices = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase.from('invoices').select('*').eq('user_id', user.id);
                if (data) {
                    const mapped = data.map(c => ({
                        id: c.id,
                        invoiceNumber: c.invoice_number,
                        quotationId: c.quotation_id,
                        quotationNumber: c.quotation_number,
                        customerId: c.customer_id,
                        customerName: c.customer_name,
                        invoiceDate: c.invoice_date,
                        dueDate: c.due_date,
                        items: c.items,
                        subtotal: c.subtotal,
                        taxPercentage: c.taxt_percentage,
                        tax: c.tax,
                        total: c.total,
                        paymentStatus: c.payment_status,
                        paidAmount: c.paid_amount,
                        notes: c.notes,
                        createdAt: c.created_at,
                    }));
                    setInvoices(mapped);
                }
            }
        };
        const fetchCurrentProjects = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase.from('projects').select('*').eq('user_id', user.id);
                if (data) {
                    const mapped = data.map(c => ({
                        id: c.id,
                        customerId: c.customer_id,
                        customerName: c.customer_name,
                        projectName: c.project_name,
                        description: c.description,
                        startDate: c.start_date,
                        deadline: c.deadline,
                        status: c.status,
                        progress: c.progress,
                        projectValue: c.project_value,
                        assignedTo: c.assigned_to,
                        notes: c.notes,
                        createdAt: c.created_at,
                        updatedAt: c.updated_at,
                    }));
                    setProjects(mapped);
                }
            }
        };
        const fetchSales = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase.from('sales').select('*').eq('user_id', user.id);
                if (data) {
                    const mapped = data.map(c => ({
                        id: c.id,
                        customerId: c.customer_id,
                        customerName: c.customer_name,
                        contactNumber: c.contact_number,
                        service: c.service,
                        industry: c.industry,
                        proposalShared: c.proposal_shared,
                        proposalValue: c.proposal_value,
                        status: c.status,
                        remarks: c.remarks,
                        saleDate: c.sale_date,
                        reminder: c.reminder,
                        createdAt: c.created_at,
                        updatedAt: c.updated_at,
                    }));
                    setSales(mapped);
                }
            }
        };
        const fetchFollowUps = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase.from('follow_ups').select('*').eq('user_id', user.id);
                if (data) {
                    const mapped = data.map(c => ({
                        id: c.id,
                        userId: c.user_id,
                        saleId: c.sale_id,
                        customerId: c.customer_id,
                        customerName: c.customer_name,
                        reminderDate: c.reminder_date,
                        reminderTime: c.reminder_time,
                        note: c.note,
                        completed: c.completed,
                        createdAt: c.created_at,
                        // saleDate: c.sale_date,
                        // reminder: c.reminder,
                        // createdAt: c.created_at,
                        // updatedAt: c.updated_at,
                    }));
                    setFollowUps(mapped);
                }
            }
        };
        fetchCustomers();
        fetchQuotations();
        fetchInvoices();
        fetchCurrentProjects();
        fetchSales();
        fetchFollowUps();

        return unsubscribe;
    }, []);
    // customer handlers
    const addCustomer = async (data) => {
        const now = new Date().toISOString();
        const newCustId = `cust-${Date.now()}`;
        const newCust = {
            ...data,
            id: newCustId,
            createdAt: now,
            updatedAt: now,
        };
        setCustomers((prev) => [newCust, ...prev]);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const dbPayload = {
                id: newCustId,
                user_id: user.id,
                company_name: data.companyName,
                contact_person: data.contactPerson,
                email: data.email,
                phone: data.phone,
                whatsapp: data.whatsapp,
                industry: data.industry,
                website: data.website,
                address: data.address,
                city: data.city,
                state: data.state,
                notes: data.notes,
                status: data.status,
            };
            const { error } = await supabase.from('customers').insert([dbPayload]);
            if (error) console.error('Error inserting customer:', error);
        }

        triggerNotification('New Customer Added', `${newCust.companyName} was added to customers.`, 'sale');
        return newCust;
    };
    const updateCustomer = async (id, data) => {
        setCustomers((prev) =>
            prev.map((c) => (c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c))
        );

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const dbPayload = {
                company_name: data.companyName,
                contact_person: data.contactPerson,
                email: data.email,
                phone: data.phone,
                whatsapp: data.whatsapp,
                industry: data.industry,
                website: data.website,
                address: data.address,
                city: data.city,
                state: data.state,
                notes: data.notes,
                status: data.status,
            };
            Object.keys(dbPayload).forEach(key => dbPayload[key] === undefined && delete dbPayload[key]);
            const { error } = await supabase.from('customers').update(dbPayload).eq('id', id).eq('user_id', user.id);
            if (error) console.error('Error updating customer:', error);
        }
    };

    const deleteCustomer = async (id) => {
        setCustomers((prev) => prev.filter((c) => c.id !== id));

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { error } = await supabase.from('customers').delete().eq('id', id).eq('user_id', user.id);
            if (error) console.error('Error deleting customer:', error);
        }
    };
    // Sales handlers 
    const addSale = async (data) => {
        const now = new Date().toISOString();
        const newSaleId = `sale-${Date.now()}`;
        const newSale = {
            ...data,
            id: newSaleId,
            createdAt: now,
            updatedAt: now,
        };
        setSales((prev) => [newSale, ...prev]);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const dbPayload = {
                id: newSaleId,
                user_id: user.id,
                customer_id: data.customerId,
                customer_name: data.customerName,
                contact_number: data.contactNumber,
                service: data.service,
                industry: data.industry,
                proposal_shared: data.proposalShared,
                proposal_value: data.proposalValue,
                status: data.status,
                remarks: data.remarks,
                sale_date: data.saleDate,
                reminder: data.reminder,
                // created_at: data.createdAt,
                // updated_at: data.updatedAt
            };
            const { error } = await supabase.from('sales').insert([dbPayload]);
            if (error) console.error('Error inserting sale:', error);
        }
        // If reminder is set, create a follow-up record and notify
        if (data.reminder?.enabled && data.reminder.date) {
            const newFollowUpId = `fu-${Date.now()}`;
            const newFollowUp = {
                id: newFollowUpId,
                saleId: newSale.id,
                customerId: data.customerId,
                customerName: data.customerName,
                reminderDate: data.reminder.date,
                reminderTime: data.reminder.time || '10:00',
                note: data.reminder.note || `Follow up with ${data.customerName}`,
                completed: false,
                createdAt: now,
            };
            setFollowUps((prev) => [newFollowUp, ...prev]);
            if (user) {
                const followUpload = {
                    id: newFollowUpId,
                    user_id: user.id,
                    sale_id: newFollowUp.saleId,
                    customer_id: newFollowUp.customerId,
                    customer_name: newFollowUp.customerName,
                    reminder_date: newFollowUp.reminderDate,
                    reminder_time: newFollowUp.reminderTime,
                    note: newFollowUp.note,
                    completed: newFollowUp.completed,
                    created_at: newFollowUp.createdAt,
                };
                const { error } = await supabase.from('follow_ups').insert([followUpload]);
                if (error) console.error('Error inserting follow ups:', error);
            }
            triggerNotification(
                'Follow-up Reminder Created',
                `Follow up with ${data.customerName} on ${data.reminder.date}`,
                'followup'
            );
        } else {
            triggerNotification('Sale Added', `${data.service} for ${data.customerName} recorded.`, 'sale');
        }

        return newSale;
    };
    const updateSale = async (id, data) => {
        setSales((prev) =>
            prev.map((s) => (s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s))
        );
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const dbPayload = {
                customer_id: data.customerId,
                customer_name: data.customerName,
                contact_number: data.contactNumber,
                service: data.service,
                industry: data.industry,
                proposal_shared: data.proposalShared,
                proposal_value: data.proposalValue,
                status: data.status,
                remarks: data.remarks,
                sale_date: data.saleDate,
                reminder: data.reminder,
                // created_at: data.createdAt,
                // updated_at: data.updatedAt
            };
            Object.keys(dbPayload).forEach(key => dbPayload[key] === undefined && delete dbPayload[key]);
            const { error } = await supabase.from('sales').update(dbPayload).eq('id', id).eq('user_id', user.id);
            if (error) console.error('Error updating sale:', error);
        }
    };
    const deleteSale = async (id) => {
        setSales((prev) => prev.filter((s) => s.id !== id));
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { error } = await supabase.from('sales').delete().eq('id', id).eq('user_id', user.id);
            if (error) console.error('Error deleting sale:', error);
        }
    };

    // Quotation handlers 
    const getNextQuotationNumber = () => {
        const nums = quotations
            .map((q) => {
                const match = q.quotationNumber.match(/QT-(\d+)/);
                return match ? parseInt(match[1], 10) : 0;
            })
            .filter((n) => !isNaN(n));
        const maxNum = nums.length > 0 ? Math.max(...nums) : 0;
        const nextNum = maxNum + 1;
        return `QT-${String(nextNum).padStart(4, '0')}`;
    };
    const addQuotation = async (data) => {
        const qNum = getNextQuotationNumber();
        const newQuotId = `quote-${Date.now()}`;
        const newQuote = {
            ...data,
            id: newQuotId,
            quotationNumber: qNum,
            createdAt: new Date().toISOString(),
        };
        setQuotations((prev) => [newQuote, ...prev]);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const dbPayload = {
                id: newQuotId,
                user_id: user.id,
                quotation_number: data.quotationNumber,
                customer_id: data.customerId,
                customer_name: data.customerName,
                quotation_date: data.quotationDate,
                valid_until: data.validUntil,

                items: data.items,
                subtotal: data.subtotal,
                discount: data.discount,
                tax_percentage: data.taxPercentage,
                tax: data.tax,
                total: data.total,
                status: data.status,
                notes: data.notes,
                // created_at: data.createdAt,
            };
            const { error } = await supabase.from('quotations').insert([dbPayload]);
            if (error) console.error('Error inserting quotation:', error);
        }
        // triggerNotification(
        //     'Quotation Generated',
        //     `Quotation ${newQuote.quotationNumber} created for ${newQuote.customerName}`,
        //     'quotation'
        // );
        return newQuote;
    };
    const updateQuotation = async (id, data) => {
        setQuotations((prev) => prev.map((q) => (q.id === id ? { ...q, ...data } : q)));
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const dbPayload = {
                quotation_number: data.quotationNumber,
                customer_id: data.customerId,
                customer_name: data.customerName,
                quotation_date: data.quotationDate,
                valid_until: data.validUntil,

                items: data.items,
                subtotal: data.subtotal,
                discount: data.discount,
                tax_percentage: data.taxPercentage,
                tax: data.tax,
                total: data.total,
                status: data.status,
                notes: data.notes,
                // created_at: data.createdAt,
            };
            Object.keys(dbPayload).forEach(key => dbPayload[key] === undefined && delete dbPayload[key]);
            const { error } = await supabase.from('quotations').update(dbPayload).eq('id', id).eq('user_id', user.id);
            if (error) console.error('Error updating quotation:', error);
        }
    };
    const deleteQuotation = async (id) => {
        setQuotations((prev) => prev.filter((q) => q.id !== id));
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { error } = await supabase.from('quotations').delete().eq('id', id).eq('user_id', user.id);
            if (error) console.error('Error deleting quotation:', error);
        }
    };

    // Invoice handlers (Strict rule: Must derive from an existing quotation! )
    const getNextInvoiceNumber = () => {
        const nums = invoices
            .map((i) => {
                const match = i.invoiceNumber.match(/INV-(\d+)/);
                return match ? parseInt(match[1], 10) : 0;
            })
            .filter((n) => !isNaN(n));
        const maxNum = nums.length > 0 ? Math.max(...nums) : 0;
        const nextNum = maxNum + 1;
        return `INV-${String(nextNum).padStart(4, '0')}`;
    };
    const generateInvoiceFromQuotation = async (
        quotationId,
        invoiceDate,
        dueDate,
        notes
    ) => {
        const quotation = quotations.find((q) => q.id === quotationId);
        if (!quotation) {
            throw new Error(`Quotation with ID ${quotationId} not found.`);
        }

        const invNum = getNextInvoiceNumber();
        const newInvId = `inv-${Date.now()}`;
        const newInvoice = {
            id: newInvId,
            invoiceNumber: invNum,
            quotationId: quotation.id,
            quotationNumber: quotation.quotationNumber,
            customerId: quotation.customerId,
            customerName: quotation.customerName,
            invoiceDate: invoiceDate || new Date().toISOString().split('T')[0],
            dueDate: dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
            items: quotation.items.map((item) => ({
                id: `ii-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                service: item.service,
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                total: item.total,
            })),
            subtotal: quotation.subtotal,
            taxPercentage: quotation.taxPercentage || 18,
            tax: quotation.tax,
            total: quotation.total,
            paymentStatus: 'Unpaid',
            notes: notes || quotation.notes || '',
            createdAt: new Date().toISOString(),
        };

        setInvoices((prev) => [newInvoice, ...prev]);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const dbPayload = {
                id: newInvId,
                user_id: user.id,
                invoice_number: invNum,
                quotation_id: newInvoice.quotationId,
                quotation_number: newInvoice.quotationNumber,
                customer_id: newInvoice.customerId,
                customer_name: newInvoice.customerName,
                invoice_date: newInvoice.invoiceDate,
                due_date: newInvoice.dueDate,
                items: newInvoice.items,
                subtotal: newInvoice.subtotal,
                tax_percentage: newInvoice.taxPercentage,
                tax: newInvoice.tax,
                total: newInvoice.total,
                payment_status: newInvoice.paymentStatus,
                paid_amount: newInvoice.paidAmount,
                notes: newInvoice.notes,
                created_at: newInvoice.createdAt,
            };
            const { error } = await supabase.from('invoices').insert([dbPayload]);
            if (error) console.error('Error inserting quotation:', error);
        }
        // triggerNotification(
        //     'Invoice Generated',
        //     `Invoice ${newInvoice.invoiceNumber} created from ${quotation.quotationNumber} for ${newInvoice.customerName}`,
        //     'invoice'
        // );
        return newInvoice;
    };
    const updateInvoice = async (id, data) => {
        setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, ...data } : inv)));
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const dbPayload = {
                invoice_number: data.invoiceNumber,
                quotation_id: data.quotationId,
                quotation_number: data.quotationNumber,
                customer_id: data.customerId,
                customer_name: data.customerName,
                invoice_date: data.invoiceDate,
                due_date: data.dueDate,
                items: data.items,
                subtotal: data.subtotal,
                tax_percentage: data.taxPercentage,
                tax: data.tax,
                total: data.total,
                payment_status: data.paymentStatus,
                paid_amount: data.paidAmount,
                notes: data.notes,
                created_at: data.createdAt,
            };
            Object.keys(dbPayload).forEach(key => dbPayload[key] === undefined && delete dbPayload[key]);
            const { error } = await supabase.from('invoices').update(dbPayload).eq('id', id).eq('user_id', user.id);
            if (error) console.error('Error updating quotation:', error);
        }
    };
    const deleteInvoice = async (id) => {
        setInvoices((prev) => prev.filter((inv) => inv.id !== id));
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { error } = await supabase.from('invoices').delete().eq('id', id).eq('user_id', user.id);
            if (error) console.error('Error deleting quotation:', error);
        }
    };
    // Project handlers
    const addProject = async (data) => {
        const now = new Date().toISOString();
        const newProjId = `proj-${Date.now()}`;
        const newProj = {
            ...data,
            id: newProjId,
            createdAt: now,
            updatedAt: now,
        };
        setProjects((prev) => [newProj, ...prev]);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const dbPayload = {
                id: newProjId,
                user_id: user.id,
                customer_id: data.customerId,
                customer_name: data.customerName,
                project_name: data.projectName,
                description: data.description,
                start_date: data.startDate,
                deadline: data.deadline,
                status: data.status,
                progress: data.progress,
                project_value: data.projectValue,
                assigned_to: data.assignedTo,
                notes: data.notes,
                // created_at: data.createdAt,
                // updated_at: data.updatedAt,
            };
            const { error } = await supabase.from('projects').insert([dbPayload]);
            if (error) console.error('Error inserting projects:', error);
        }
        // triggerNotification('New Project Created', `${newProj.projectName} started for ${newProj.customerName}`);
        return newProj;
    };
    const updateProject = async (id, data) => {
        setProjects((prev) =>
            prev.map((p) => (p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p))
        );
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const dbPayload = {
                customer_id: data.customerId,
                customer_name: data.customerName,
                project_name: data.projectName,
                description: data.description,
                start_date: data.startDate,
                deadline: data.deadline,
                status: data.status,
                progress: data.progress,
                project_value: data.projectValue,
                assigned_to: data.assignedTo,
                notes: data.notes,
                // created_at: data.createdAt,
                // updated_at: data.updatedAt,
            };
            Object.keys(dbPayload).forEach(key => dbPayload[key] === undefined && delete dbPayload[key]);
            const { error } = await supabase.from('projects').update(dbPayload).eq('id', id).eq('user_id', user.id);
            if (error) console.error('Error updating projects:', error);
        }

    };
    const deleteProject = async (id) => {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { error } = await supabase.from('projects').delete().eq('id', id).eq('user_id', user.id);
            if (error) console.error('Error deleting projects:', error);
        }
    };

    // Follow-ups handlers
    const toggleFollowUpComplete = async (id) => {
        const followUp = followUps.find((f) => f.id === id);
        const newCompletedStatus = followUp ? !followUp.completed : true;

        setFollowUps((prev) =>
            prev.map((f) => (f.id === id ? { ...f, completed: newCompletedStatus } : f))
        );

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { error } = await supabase
                .from('follow_ups')
                .update({ completed: newCompletedStatus })
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) console.error('Error updating follow_up:', error);
        }
    };
    const deleteFollowUp = async (id) => {
        // Clear from follow-ups state (handles both follow-up ID and sale ID)
        setFollowUps((prev) => prev.filter((f) => f.id !== id && f.saleId !== id));

        // Update the sales state so the UI updates immediately
        setSales((prev) => prev.map((s) => s.id === id ? { ...s, reminder: null } : s));

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { error } = await supabase
                .from('sales')
                .update({ reminder: null })
                .eq('id', id)
                .eq('user_id', user.id);
            if (error) console.error('Error updating follow_up:', error);
        }
    };
    // Notification handlers
    const markNotificationRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };
    const clearNotifications = () => {
        setNotifications([]);
    };

    // System data handlers
    const resetToSampleData = () => {
        setCustomers(INITIAL_CUSTOMERS);
        setSales(INITIAL_SALES);
        setQuotations(INITIAL_QUOTATIONS);
        setInvoices(INITIAL_INVOICES);
        setProjects(INITIAL_PROJECTS);
        setFollowUps(INITIAL_FOLLOWUPS);
        // localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
        // localStorage.removeItem(STORAGE_KEYS.SALES);
        // localStorage.removeItem(STORAGE_KEYS.QUOTATIONS);
        // localStorage.removeItem(STORAGE_KEYS.INVOICES);
        // localStorage.removeItem(STORAGE_KEYS.PROJECTS);
        // localStorage.removeItem(STORAGE_KEYS.FOLLOWUPS);

        // triggerNotification('Data Reset', 'Sample CRM data restored successfully.');
    };

    const exportData = () => {
        const payload = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            customers,
            sales,
            quotations,
            invoices,
            projects,
            followUps,
        };
        return JSON.stringify(payload, null, 2);
    };

    const importData = (jsonData) => {
        try {
            const data = JSON.parse(jsonData);
            if (data.customers && Array.isArray(data.customers)) setCustomers(data.customers);
            if (data.sales && Array.isArray(data.sales)) setSales(data.sales);
            if (data.quotations && Array.isArray(data.quotations)) setQuotations(data.quotations);
            if (data.invoices && Array.isArray(data.invoices)) setInvoices(data.invoices);
            if (data.projects && Array.isArray(data.projects)) setProjects(data.projects);
            if (data.followUps && Array.isArray(data.followUps)) setFollowUps(data.followUps);
            // triggerNotification('Data Imported', 'CRM database loaded successfully.');
            return true;
        } catch (err) {
            console.error('Import failed', err);
            return false;
        }
    };
    return (
        <CRMContext.Provider value={{
            activeTab,
            setActiveTab,
            customers,
            addCustomer,
            updateCustomer,
            deleteCustomer,
            sales,
            addSale,
            updateSale,
            deleteSale,
            followUps,
            toggleFollowUpComplete,
            deleteFollowUp,
            quotations,
            getNextQuotationNumber,
            addQuotation,
            updateQuotation,
            deleteQuotation,
            invoices,
            generateInvoiceFromQuotation,
            updateInvoice,
            deleteInvoice,
            projects,
            addProject,
            updateProject,
            deleteProject,
            notifications,
            markNotificationRead,
            clearNotifications,
            isAddSaleOpen,
            setIsAddSaleOpen,
            isAddCustomerOpen,
            setIsAddCustomerOpen,
            isCreateQuotationOpen,
            setIsCreateQuotationOpen,
            isGenerateInvoiceOpen,
            setIsGenerateInvoiceOpen,
            isAddProjectOpen,
            setIsAddProjectOpen,
            openAddSaleModal: () => setIsAddSaleOpen(true),
            openAddCustomerModal: () => setIsAddCustomerOpen(true),
            openCreateQuotationModal: () => setIsCreateQuotationOpen(true),
            openGenerateInvoiceModal: () => setIsGenerateInvoiceOpen(true),
            openAddProjectModal: () => setIsAddProjectOpen(true),
            notificationStatus,
            setNotificationStatus,
            getInitialNotificationStatus,
            resetToSampleData,
            exportData,
            importData,
        }}>
            {children}
        </CRMContext.Provider>
    );
};