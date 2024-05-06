import { Card } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { useSelector } from 'react-redux';
import { BiEdit } from 'react-icons/bi';
import { useState } from 'react';
import ProductModal from './ProductModal';

const ProductsTable = () => {
    const [modalShow, setModalShow] = useState(false);
    const productsState = useSelector((state) => state.products);
    const [productIDToBeEdited, setProductIDToBeEdited] = useState();
    
    const handleEditProduct = (id) => {
        setModalShow(true)
        setProductIDToBeEdited(id)
    }

    return (
        <Card >
            <Card.Body className="d-flex flex-column">
                <ProductModal
                    productId={productIDToBeEdited}
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                />
                {productsState === undefined || productsState[productsState?.length - 1]?.length === 0 || productsState.length === 0 ? (
                    <div>
                        <h2>No products added yet</h2>
                    </div>
                ) : (
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody >
                            {productsState[productsState?.length - 1]?.map((product) => (
                                <tr key={product.itemId}>
                                    <td>{product.itemName}</td>
                                    <td>{product.itemDescription}</td>
                                    <td>{product.itemPrice}</td>
                                    <td> <BiEdit style={{ color: 'blue', fontSize: '24px' }}
                                        onClick={() => handleEditProduct(product.itemId)} /> </td>

                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card.Body>
        </Card>
    );
}

export default ProductsTable;