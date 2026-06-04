export default {
  async refreshQueue() {
    await purchase_ocr_list_uploaded_doc.run();
    await purchase_ocr_list_review_queue.run();
    await purchase_get_pending_approval_.run();
    showAlert("OCR queue refreshed", "success");
  },

  async resetPage() {
    await resetWidget("InputDocumentSearch", true);
    await resetWidget("InputReviewSearch", true);
    await resetWidget("SelectDocumentStatus", true);
    await resetWidget("SelectReviewStatus", true);
    await resetWidget("SelectSupplier", true);
    await resetWidget("SelectWarehouse", true);
    await resetWidget("SelectAssignedUser", true);
    await resetWidget("InputProductSearch", true);
    await resetWidget("SelectMatchedProduct", true);
    await resetWidget("InputMatchConfidence", true);
    await resetWidget("TextAreaMatchNote", true);
    await resetWidget("TextAreaReviewNotes", true);
    await resetWidget("TableDocuments", true);
    await resetWidget("TableReviewQueue", true);
    await resetWidget("TableItemMatches", true);

    await this.refreshQueue();
  },

  showUploadPlaceholder() {
    showAlert("Upload/OCR wiring is not connected yet. Upload will not approve invoices or affect stock.", "warning");
  },

  showAddProductPlaceholder() {
    showAlert("Add Product is not connected here yet. Add the product from Products, then refresh matching.", "info");
  }
}
