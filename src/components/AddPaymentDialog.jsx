import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  IconButton,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { addPayment } from "../actions/billing";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AddPaymentDialog = ({ open, onClose, billingData }) => {

  const dispatch = useDispatch();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [payment, setPayment] = useState({
    amount: "",
    or_number: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    console.log(billingData?.payments)
    if (billingData?.payments) {
      setPaymentRecords(billingData.payments);
    }
  }, [billingData]);

  const handleChange = (field, value) => {
    setPayment((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddPayment = async () => {
    if (!billingData.billing_id) {
      setSnackbar({ open: true, message: "Select a billing!", severity: "warning" });
      return;
    }
    if (!payment.amount || Number(payment.amount <= 0)) {
      setSnackbar({ open: true, message: "Fill all the payment information!", severity: "warning" });
      return;
    }
    setFormLoading(true);
    try {
      const result = await dispatch(addPayment(billingData.billing_id,payment.date,payment.amount,payment.or_number))
      console.log(result)
      if(result.status === true){
        setSnackbar({ open: true, message: result.message ,severity: "success" });
        onClose();
      }else{
        setSnackbar({ open: true, message: result.message ,severity: "error" });
      }
    } catch (err) {
      console.error("Saving payment error", err);
      setSnackbar({ open: true, message: "Failed to save payment", severity: "error" });

    } finally {
      setFormLoading(false);
    }
  };

  const handleSaveAll = () => {
    onClose();
  };

  const handleDownloadPDF = () => {
  if (!billingData) return;

  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.text("Payment Receipt", 105, 15, { align: "center" });

  doc.setFontSize(12);
  doc.text("Student Billing Information", 14, 30);

  // Billing Details
  const billingInfo = [
    ["Student No.", billingData.student_no || "N/A"],
    ["Full Name", billingData.fullName || "N/A"],
    ["Semester", billingData.semester || "N/A"],
    ["School Year", billingData.schoolYear || "N/A"],
    ["Total Bill", `₱ ${Number(billingData.fullPayment || 0).toLocaleString()}`],
    ["Current Bill", `₱ ${Number(billingData.current_bill || 0).toLocaleString()}`],
  ];
  doc.autoTable({
    startY: 35,
    theme: "plain",
    body: billingInfo,
    styles: { fontSize: 11, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 50 } },
  });

  // Payments Section
  const paymentData =
    billingData.payments && billingData.payments.length > 0
      ? billingData.payments.map((p) => [
          p.reference_no || "-",
          p.payment_date || "-",
          `₱ ${Number(p.amount_paid || 0).toLocaleString()}`,
        ])
      : [["No payments yet", "", ""]];

  doc.text("Payment Records", 14, doc.lastAutoTable.finalY + 10);
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 15,
    head: [["OR Number", "Date", "Amount (₱)"]],
    body: paymentData,
    styles: { fontSize: 11 },
    headStyles: { fillColor: [22, 160, 133] },
  });

  // Footer
  const currentDate = new Date().toLocaleString();
  doc.setFontSize(10);
  doc.text(`Generated on: ${currentDate}`, 14, doc.lastAutoTable.finalY + 15);
  doc.text("Thank you for your payment!", 105, doc.lastAutoTable.finalY + 25, { align: "center" });

  // Save the PDF
  doc.save(
    `${billingData.student_no || "Payment"}_${billingData.schoolYear || ""}_receipt.pdf`
  );
};


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <Snackbar
              open={snackbar.open}
              autoHideDuration={4000}
              onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                severity={snackbar.severity}
                variant="filled"
                sx={{ width: "100%" }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" fontWeight="bold">
          Add Payment Record
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Billing Information */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Student No:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {billingData?.student_no || "N/A"}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
            Student:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {billingData?.fullName || "N/A"}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
            Total Bill:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            ₱ {Number(billingData?.fullPayment || 0).toLocaleString()}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
            Current Bill:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            ₱ {Number(billingData?.current_bill || 0).toLocaleString()}
          </Typography>
        </Box>

        {/* Add Payment Form */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Payment Amount"
            type="number"
            size="small"
            fullWidth
            value={payment.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
          />
          <TextField
            label="OR Number"
            type="string"
            size="small"
            fullWidth
            value={payment.or_number}
            onChange={(e) => handleChange("or_number", e.target.value)}
          />
          <TextField
            label="Date"
            type="date"
            size="small"
            fullWidth
            value={payment.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleAddPayment}>
            Add
          </Button>
        </Box>
        {/* Payment Record Table */}
        <Paper variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>OR Number</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Amount (₱)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentRecords.length > 0 ? (
                paymentRecords.map((p) => (
                  <TableRow key={p.payment_id}>
                    <TableCell>{p.reference_no}</TableCell>
                    <TableCell>{p.payment_date}</TableCell>
                    <TableCell align="right">
                      ₱ {Number(p.amount_paid).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No payments yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleDownloadPDF}
          color="secondary"
          variant="outlined"
        >
          Download PDF
        </Button>
        <Button onClick={onClose} color="error" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleAddPayment} color="primary" variant="contained">
          {formLoading ? <CircularProgress size={20} /> : "Save Payment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPaymentDialog;
