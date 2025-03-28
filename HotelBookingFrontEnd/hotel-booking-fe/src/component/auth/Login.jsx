import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { Modal, Spinner } from 'react-bootstrap';

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showModal, setShowModal] = useState(false); 
    const [modalMessage, setModalMessage] = useState(""); 
    const [modalType, setModalType] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { state } = useLocation();
    const redirectPath = state?.from?.pathname || "/home";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;

        // Validazione campi
        if (!email || !password) {
            setModalType("error");
            setModalMessage("Per favore completa tutti i campi");
            setShowModal(true);
            return;
        }

        setLoading(true);

        try {
            const { status, token, role } = await ApiService.loginUser(formData);
            if (status === 200) {
                ApiService.saveToken(token);
                ApiService.saveRole(role);
                
                // Controlla se c'era un pagamento in sospeso
                const paymentPending = localStorage.getItem('paymentPending');
                if (paymentPending === 'true') {
                    const bookingReference = localStorage.getItem('paymentBookingReference');
                    const amount = localStorage.getItem('paymentAmount');
                    
                    // Pulisci le informazioni di pagamento in sospeso
                    localStorage.removeItem('paymentPending');
                    localStorage.removeItem('paymentBookingReference');
                    localStorage.removeItem('paymentAmount');
                    
                    // Mostra messaggio di successo prima di reindirizzare
                    setModalType("success");
                    setModalMessage("Login effettuato con successo. Stai per essere reindirizzato alla pagina di pagamento.");
                    setShowModal(true);
                    
                    // Reindirizza alla pagina di pagamento dopo un breve ritardo
                    setTimeout(() => {
                        setShowModal(false);
                        navigate(`/payment/${bookingReference}/${amount}`, { replace: true });
                    }, 1500);
                } else {
                    // Reindirizza normalmente
                    navigate(redirectPath, { replace: true });
                }
            }
        } catch (error) {
            setModalType("error");
            setModalMessage(error.response?.data?.message || error.message);
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center mt-5">
            <div className="auth-container" style={{ width: "400px" }}>
                <h2 className="text-center mb-4">Login</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formGridEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            className="form-color"
                            type="email"
                            placeholder="Inserisci email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            className="form-color"
                            type="password"
                            placeholder="Inserisci password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <div className="d-grid">
                        <Button 
                            variant="primary" 
                            className="button-class" 
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner 
                                        as="span" 
                                        animation="border" 
                                        size="sm" 
                                        role="status" 
                                        aria-hidden="true" 
                                        className="me-2"
                                    />
                                    Accesso in corso...
                                </>
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </div>
                </Form>
                <p className="text-center mt-3">Non hai un account? <a href="/register" className="text-warning">Registrati</a></p>
            </div>

            {/* Modal per messaggi di errore o successo */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered className="modal-custom">
                <Modal.Header closeButton>
                    <Modal.Title>{modalType === "error" ? "Errore" : "Successo"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{modalMessage}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="button-class" onClick={() => setShowModal(false)}>
                        Chiudi
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Login;