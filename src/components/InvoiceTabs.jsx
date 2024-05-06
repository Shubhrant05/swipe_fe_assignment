import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useLocation } from "react-router-dom";
import "./components.css"

const InvoiceTabs = (props) => {
  const location = useLocation();
  return (
    <Tabs
      defaultActiveKey="invoice"
      id="fill-tab-example"
      className="mb-3 "
      fill
    >
      <Tab eventKey="invoice" title={<span className="custom-tab-title">Invoice</span>}>
        {props.invoice}
      </Tab>
     { location.pathname.includes("create") ? <Tab eventKey="products" title={<span className="custom-tab-title">Products</span>}>
        {props.products}
      </Tab> : null}
    </Tabs>
  );
}

export default InvoiceTabs;
