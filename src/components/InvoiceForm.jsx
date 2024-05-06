import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import InvoiceItem from "./InvoiceItem";
import InvoiceModal from "./InvoiceModal";
import { BiArrowBack } from "react-icons/bi";
import InputGroup from "react-bootstrap/InputGroup";
import { useDispatch } from "react-redux";
import { addInvoice, updateInvoice } from "../redux/invoicesSlice";
import { addProduct, updateProduct, deleteProduct } from "../redux/productSlice";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import generateRandomId from "../utils/generateRandomId";
import { useInvoiceListData } from "../redux/hooks";
import Freecurrencyapi from '@everapi/freecurrencyapi-js';
import { useSelector } from "react-redux";

const InvoiceForm = () => {
  const productsState = useSelector((state) => state.products);
  const products = productsState[productsState?.length - 1]
  const freecurrencyapi = new Freecurrencyapi('fca_live_gzKCSxs7gZo8sWjADav1QZ6KHxTl6Xur9sZcDyrO');
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isCopy = location.pathname.includes("create");
  const isEdit = location.pathname.includes("edit");
  const [isOpen, setIsOpen] = useState(false);
  const [copyId, setCopyId] = useState("");
  const { getOneInvoice, listSize } = useInvoiceListData();
  const [formData, setFormData] = useState(
    isEdit
      ? getOneInvoice(params.id)
      : isCopy && params.id
        ? {
          ...getOneInvoice(params.id),
          id: generateRandomId(),
          invoiceNumber: listSize + 1,
        }
        : {
          id: generateRandomId(),
          currentDate: new Date().toLocaleDateString(),
          invoiceNumber: listSize + 1,
          dateOfIssue: "",
          billTo: "",
          billToEmail: "",
          billToAddress: "",
          billFrom: "",
          billFromEmail: "",
          billFromAddress: "",
          notes: "",
          total: "0.00",
          subTotal: "0.00",
          taxRate: "",
          taxAmount: "0.00",
          discountRate: "",
          discountAmount: "0.00",
          currency: "$",
          items: [
            {
              itemId: 0,
              itemName: "",
              itemDescription: "",
              itemPrice: "0.00",
              itemQuantity: 0,
              itemPriceInDollar: "0.00"
            },
          ],
        }
  );
  const [conversionRate, setConversionRate] = useState(1);
  const [targetCurrency, setTargetCurrency] = useState("USD");

  //Enum to convert currency symbol to text for conversion API
  const currencySymbolToText = {
    "$": "USD",
    "£": "GBP",
    "¥": "JPY",
    "CA$": "CAD",
    "AU$": "AUD",
    "SG$": "SGD",
    "CNY": "CNY",
  };

  const fetchExchangeRates = async () => {
    try {
      const response = await freecurrencyapi.latest({
        base_currency: "USD", // Assuming USD as base currency
        currencies: targetCurrency,
      });
      const conversionRate = response.data[targetCurrency];
      setConversionRate(() => conversionRate);
    } catch (error) {
      console.error("Error fetching exchange rates: ", error);
    }
  };

  const updateItemPrices = () => {

    return products?.map((item) => {
      const newItemPrice = parseFloat(item.itemPriceInDollar) * parseFloat(conversionRate);
      const updatedItem = {
        name: item.itemName,
        price: newItemPrice.toFixed(2),
        description: item?.itemDescription,
        quantity: item?.itemQuantity,
        priceInDollar: item.itemPriceInDollar
      };
      dispatch(updateProduct({ itemId: item.itemId, updatedProduct: updatedItem }));
    });
  }

  useEffect(() => {
    fetchExchangeRates();
    updateItemPrices();
  }, [targetCurrency, conversionRate]);

  useEffect(() => {
    handleCalculateTotal();
  }, [targetCurrency, conversionRate, products]);

  const handleRowDel = (itemToDelete) => {
    const updatedItems = formData?.items.filter(
      (item) => item.itemId !== itemToDelete.itemId
    );
    dispatch(deleteProduct(itemToDelete));
    setFormData({ ...formData, items: updatedItems });
    handleCalculateTotal();
  };

  const handleAddEvent = () => {
    const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newItem = {
      itemId: id,
      itemName: "",
      itemDescription: "",
      itemPrice: "0.00",
      itemQuantity: 0,
      itemPriceInDollar: "0.00"
    };
    setFormData({
      ...formData,
      items: [...formData?.items, newItem],
    });

    const modifiedItems = formData?.items.map((item) => ({
      ...item,
      itemPriceInDollar: item.itemPrice
    }));

    dispatch(addProduct(modifiedItems))
    handleCalculateTotal();
  };

  const handleCalculateTotal = () => {
    setFormData((prevFormData) => {
      let subTotal = 0;

      products?.forEach((item) => {
        subTotal +=
          parseFloat(item.itemPrice).toFixed(2) * parseInt(item.itemQuantity);
      });

      const taxAmount = parseFloat(
        subTotal * (prevFormData?.taxRate / 100)
      ).toFixed(2);
      const discountAmount = parseFloat(
        subTotal * (prevFormData?.discountRate / 100)
      ).toFixed(2);
      const total = (
        subTotal -
        parseFloat(discountAmount) +
        parseFloat(taxAmount)
      ).toFixed(2);

      return {
        ...prevFormData,
        subTotal: parseFloat(subTotal).toFixed(2),
        taxAmount,
        discountAmount,
        total,
      };
    });
  };

  const onItemizedItemEdit = (evt, id) => {
    const updatedItems = formData?.items.map((oldItem) => {
      if (oldItem.itemId === id) {
        return { ...oldItem, [evt.target.name]: evt.target.value };
      }
      return oldItem;
    });

    setFormData({ ...formData, items: updatedItems });
    handleCalculateTotal();
  };

  const editField = (name, value) => {
    setFormData({ ...formData, [name]: value });
    handleCalculateTotal();
  };

  const onCurrencyChange = (selectedOption) => {
    setFormData({ ...formData, currency: selectedOption.currency });
  };

  const openModal = (event) => {
    event.preventDefault();
    handleCalculateTotal();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleAddInvoice = () => {
    if (!formData.dateOfIssue || !formData.billTo || !formData.billToEmail || !formData.billToAddress || !formData.billFrom || !formData.billFromEmail || !formData.billFromAddress) {
      alert("Please fill all the required fields");
      return;
    }
    if (isEdit) {
      dispatch(updateInvoice({ id: params.id, updatedInvoice: formData }));
      alert("Invoice updated successfuly 🥳");
    } else if (isCopy) {
      dispatch(addInvoice({ id: generateRandomId(), ...formData }));
      alert("Invoice added successfuly 🥳");
    } else {
      dispatch(addInvoice(formData));
      alert("Invoice added successfuly 🥳");
    }
    navigate("/");
  };

  const handleCopyInvoice = () => {
    const recievedInvoice = getOneInvoice(copyId);
    if (recievedInvoice) {
      setFormData({
        ...recievedInvoice,
        id: formData?.id,
        invoiceNumber: formData?.invoiceNumber,
      });
    } else {
      alert("Invoice does not exists!!!!!");
    }
  };

  useEffect(() => {
    const updatedItems = formData?.items.map((item) => {
      const product = products?.find((product) => product.itemId === item.itemId);
      if (product && isEdit) {
        const newItem = {
          itemId: product?.itemId,
          itemName: product?.itemName,
          itemDescription: product?.itemDescription,
          itemPrice: product?.itemPrice,
          itemQuantity: product?.itemQuantity,
          itemPriceInDollar: product?.itemPrice,
        }
        
        return {
          ...item,
          newItem
        };
      }

      return {
        ...item,
        itemPrice: (product?.itemPriceInDollar * conversionRate).toFixed(2)
      };
    });
    setFormData((prevFormData) => ({ ...prevFormData, items: updatedItems }));
  }, [products, conversionRate, targetCurrency]);

  return (

    <Form onSubmit={openModal}>
      <div className="d-flex align-items-center">
        <BiArrowBack size={18} />
        <div className="fw-bold mt-1 mx-2 cursor-pointer">
          <Link to="/">
            <h5>Go Back</h5>
          </Link>
        </div>
      </div>

      <Row>
        <Col md={8} lg={9}>
          <Card className="p-4 p-xl-5 my-3 my-xl-4">
            <div className="d-flex flex-row align-items-start justify-content-between mb-3">
              <div className="d-flex flex-column">
                <div className="d-flex flex-column">
                  <div className="mb-2">
                    <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                    <span className="current-date">{formData?.currentDate}</span>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center">
                  <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
                  <Form.Control
                    type="date"
                    value={formData?.dateOfIssue}
                    name="dateOfIssue"
                    onChange={(e) => editField(e.target.name, e.target.value)}
                    style={{ maxWidth: "150px" }}
                    required
                  />
                </div>
              </div>
              <div className="d-flex flex-row align-items-center">
                <span className="fw-bold me-2">Invoice&nbsp;Number:&nbsp;</span>
                <Form.Control
                  type="number"
                  value={formData?.invoiceNumber}
                  name="invoiceNumber"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  min="1"
                  style={{ maxWidth: "70px" }}
                  required
                />
              </div>
            </div>
            <hr className="my-4" />
            <Row className="mb-5">
              <Col>
                <Form.Label className="fw-bold">Bill to:</Form.Label>
                <Form.Control
                  placeholder="Who is this invoice to?"
                  rows={3}
                  value={formData?.billTo}
                  type="text"
                  name="billTo"
                  className="my-2"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  autoComplete="name"
                  required
                />
                <Form.Control
                  placeholder="Email address"
                  value={formData?.billToEmail}
                  type="email"
                  name="billToEmail"
                  className="my-2"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  autoComplete="email"
                  required
                />
                <Form.Control
                  placeholder="Billing address"
                  value={formData?.billToAddress}
                  type="text"
                  name="billToAddress"
                  className="my-2"
                  autoComplete="address"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  required
                />
              </Col>
              <Col>
                <Form.Label className="fw-bold">Bill from:</Form.Label>
                <Form.Control
                  placeholder="Who is this invoice from?"
                  rows={3}
                  value={formData?.billFrom}
                  type="text"
                  name="billFrom"
                  className="my-2"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  autoComplete="name"
                  required
                />
                <Form.Control
                  placeholder="Email address"
                  value={formData?.billFromEmail}
                  type="email"
                  name="billFromEmail"
                  className="my-2"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  autoComplete="email"
                  required
                />
                <Form.Control
                  placeholder="Billing address"
                  value={formData?.billFromAddress}
                  type="text"
                  name="billFromAddress"
                  className="my-2"
                  autoComplete="address"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  required
                />
              </Col>
            </Row>
            <InvoiceItem
              onItemizedItemEdit={onItemizedItemEdit}
              onRowAdd={handleAddEvent}
              onRowDel={handleRowDel}
              currency={formData?.currency}
              items={formData?.items}
            />
            <Row className="mt-4 justify-content-end">
              <Col lg={6}>
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <span className="fw-bold">Subtotal:</span>
                  <span>
                    {formData?.currency}
                    {formData?.subTotal}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Discount:</span>
                  <span>
                    <span className="small">
                      ({formData?.discountRate || 0}%)
                    </span>
                    {formData?.currency}
                    {formData?.discountAmount || 0}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Tax:</span>
                  <span>
                    <span className="small">({formData?.taxRate || 0}%)</span>
                    {formData?.currency}
                    {formData?.taxAmount || 0}
                  </span>
                </div>
                <hr />
                <div
                  className="d-flex flex-row align-items-start justify-content-between"
                  style={{ fontSize: "1.125rem" }}
                >
                  <span className="fw-bold">Total:</span>
                  <span className="fw-bold">
                    {formData?.currency}
                    {formData?.total || 0}
                  </span>
                </div>
              </Col>
            </Row>
            <hr className="my-4" />
            <Form.Label className="fw-bold">Notes:</Form.Label>
            <Form.Control
              placeholder="Thanks for your business!"
              name="notes"
              value={formData?.notes}
              onChange={(e) => editField(e.target.name, e.target.value)}
              as="textarea"
              className="my-2"
              rows={1}
            />
          </Card>
        </Col>
        <Col md={4} lg={3}>
          <div className="sticky-top pt-md-3 pt-xl-4">
            <Button
              variant="dark"
              onClick={handleAddInvoice}
              className="d-block w-100 mb-2"
            >
              {isEdit ? "Update Invoice" : "Add Invoice"}
            </Button>
            <Button variant="primary" type="submit" className="d-block w-100">
              Review Invoice
            </Button>
            <InvoiceModal
              showModal={isOpen}
              closeModal={closeModal}
              info={{
                isOpen,
                id: formData?.id,
                currency: formData?.currency,
                currentDate: formData?.currentDate,
                invoiceNumber: formData?.invoiceNumber,
                dateOfIssue: formData?.dateOfIssue,
                billTo: formData?.billTo,
                billToEmail: formData?.billToEmail,
                billToAddress: formData?.billToAddress,
                billFrom: formData?.billFrom,
                billFromEmail: formData?.billFromEmail,
                billFromAddress: formData?.billFromAddress,
                notes: formData?.notes,
                total: formData?.total,
                subTotal: formData?.subTotal,
                taxRate: formData?.taxRate,
                taxAmount: formData?.taxAmount,
                discountRate: formData?.discountRate,
                discountAmount: formData?.discountAmount,
              }}
              items={formData?.items}
              currency={formData?.currency}
              subTotal={formData?.subTotal}
              taxAmount={formData?.taxAmount}
              discountAmount={formData?.discountAmount}
              total={formData?.total}
            />
            <p className="mt-4">Please enter values in US$ then change to other currencies*</p>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Currency:</Form.Label>
              <Form.Select
                onChange={(event) => {
                  onCurrencyChange({ currency: event.target.value })
                  setTargetCurrency(() => currencySymbolToText[event.target.value])
                }}
                className="btn btn-light my-1"
                aria-label="Change Currency"
              >
                <option value="$">USD (United States Dollar)</option>
                <option value="£">GBP (British Pound Sterling)</option>
                <option value="¥">JPY (Japanese Yen)</option>
                <option value="CA$">CAD (Canadian Dollar)</option>
                <option value="AU$">AUD (Australian Dollar)</option>
                <option value="SG$">SGD (Singapore Dollar)</option>
                <option value="CNY">CNY (Chinese Renminbi)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Tax rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control
                  name="taxRate"
                  type="number"
                  value={formData?.taxRate}
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  className="bg-white border"
                  placeholder="0.0"
                  min="0.00"
                  step="0.01"
                  max="100.00"
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Discount rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control
                  name="discountRate"
                  type="number"
                  value={formData?.discountRate}
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  className="bg-white border"
                  placeholder="0.0"
                  min="0.00"
                  step="0.01"
                  max="100.00"
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Control
              placeholder="Enter Invoice ID"
              name="copyId"
              value={copyId}
              onChange={(e) => setCopyId(e.target.value)}
              type="text"
              className="my-2 bg-white border"
            />
            <Button
              variant="primary"
              onClick={handleCopyInvoice}
              className="d-block"
            >
              Copy Old Invoice
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );

};

export default InvoiceForm;
