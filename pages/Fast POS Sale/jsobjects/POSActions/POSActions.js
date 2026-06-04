export default {
  async resetPOS() {
    await storeValue("currentSalesInvoiceId", "", false);
    await storeValue("deleteCartItemId", "", false);

    await resetWidget("InputProductSearch", true);
    await resetWidget("InputCartQuantity", true);
    await resetWidget("InputUnitPrice", true);
    await resetWidget("InputPaymentAmount", true);
    await resetWidget("SelectPaymentMethod", true);
    await resetWidget("TableProductResults", true);
    await resetWidget("TableCart", true);

    if (typeof TableInvoiceHeader !== "undefined") {
      await resetWidget("TableInvoiceHeader", true);
    }

    await pos_search_products_for_sale.run();
  },

  async payAndComplete() {
    if (!appsmith.store.currentSalesInvoiceId) {
      showAlert("Start a new sale first", "warning");
      return;
    }

    if (!TableCart.tableData?.length) {
      showAlert("Add at least one item", "warning");
      return;
    }

    try {
      await pos_get_sales_invoice_draft.run();

      const invoice =
        Array.isArray(pos_get_sales_invoice_draft.data)
          ? (pos_get_sales_invoice_draft.data[0] || {})
          : (pos_get_sales_invoice_draft.data || {});

      const remaining = Number(invoice.remaining_amount || 0);
      const status = invoice.status;

      if (status === "approved") {
        showAlert("Invoice already completed", "warning");
        return;
      }

      if (status === "cancelled") {
        showAlert("Invoice is cancelled", "error");
        return;
      }

      if (remaining > 0) {
        if (!SelectPaymentMethod.selectedOptionValue) {
          showAlert("Select payment method", "warning");
          return;
        }

        if (!SelectTreasury.selectedOptionValue) {
          showAlert("Select treasury", "warning");
          return;
        }

        if (Number(InputPaymentAmount.text || 0) <= 0) {
          showAlert("Enter payment amount", "warning");
          return;
        }

        await pos_validate_payment_total.run();

        const paymentCheck =
          Array.isArray(pos_validate_payment_total.data)
            ? (pos_validate_payment_total.data[0] || {})
            : (pos_validate_payment_total.data || {});

        if (paymentCheck.can_accept_payment === false) {
          showAlert("Payment amount is not valid", "error");
          return;
        }

        await pos_add_customer_payment.run();
      }

      await pos_approve_sales_invoice.run();

      showAlert("Sale completed successfully", "success");

      await this.resetPOS();

    } catch (e) {
      showAlert("Sale failed: " + (e.message || e), "error");
    }
  }
}