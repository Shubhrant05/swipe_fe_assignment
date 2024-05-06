import React from "react";
import InvoiceForm from "../components/InvoiceForm";
import Products from "../components/Products";
import InvoiceTabs from "../components/InvoiceTabs";
const Invoice = () => {
  return (
    <div>
      <InvoiceTabs invoice={<InvoiceForm />} products={<Products />} className="position-fixed mt-0" />
    </div>
  );
};

export default Invoice;
