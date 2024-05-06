import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useSelector } from 'react-redux';
import { updateProduct } from '../redux/productSlice';
import { useDispatch } from 'react-redux';

const ProductModal = (props) => {
    const dispatch = useDispatch();
    const productsState = useSelector((state) => state.products);
    const productToBeEdited = productsState[productsState?.length - 1]?.find(product => product.itemId === props.productId)

    const [formData, setFormData] = useState({
        name: productToBeEdited?.itemName,
        price: productToBeEdited?.itemPrice || '',
        description: productToBeEdited?.itemDescription || '',
        quantity: productToBeEdited?.itemQuantity || '',
        priceInDollar: productToBeEdited?.itemPriceInDollar || ''
    });

    useEffect(() => {
        setFormData(prevState => ({
            ...prevState,
            name: productToBeEdited?.itemName,
            price: productToBeEdited?.itemPrice || '',
            description: productToBeEdited?.itemDescription || '',
            quantity: productToBeEdited?.itemQuantity || '',
            priceInDollar: productToBeEdited?.itemPrice || '' 
        }));
    }, [productToBeEdited]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        formData.priceInDollar = formData.price;
        dispatch(updateProduct({
            itemId: props.productId,
            updatedProduct: formData
        }));
        props.onHide();
    };

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Edit Item Details
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formPrice">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formQuantity">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                            type="text"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Save Changes
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default ProductModal;
