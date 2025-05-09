import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'react-toastify';

interface CheckoutFormProps {
    amount: number;
    onSuccess: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [pagando, setPagando] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setPagando(true);

        try {
            // Chame seu backend para criar a intenção de pagamento
            const { data } = await axios.post('http://localhost:8080/pagamentos/intencao', {
                amount: Math.round(amount * 100), // Stripe espera centavos
            });

            const clientSecret = data.clientSecret;

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                },
            });

            if (result.error) {
                toast.error(`Erro no pagamento: ${result.error.message}`);
            } else if (result.paymentIntent?.status === 'succeeded') {
                toast.success('Pagamento aprovado com sucesso!');
                onSuccess();
            }
        } catch (error) {
            toast.error('Erro ao processar pagamento. Tente novamente.');
            console.error('Erro no pagamento:', error);
        } finally {
            setPagando(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-white rounded-lg border border-gray-200">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                        hidePostalCode: true
                    }}
                />
            </div>
            <button
                type="submit"
                disabled={!stripe || pagando}
                className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {pagando ? 'Processando...' : 'Pagar'}
            </button>
        </form>
    );
};

export default CheckoutForm; 