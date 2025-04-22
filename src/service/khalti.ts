interface KhaltiPaymentDetails {
  amount: number;
  return_url: string;
  website_url: string;
}

// Khalti Payment Initialization
export async function initializeKhaltiPayment(details: KhaltiPaymentDetails) {
    const headersList = {
      Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    };
  
    const url = `${process.env.KHALTI_GATEWAY_URL}/epayment/initiate/`;
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headersList,
        body: JSON.stringify({
          return_url: "http://example.com/",
          website_url: "https://example.com/",
          amount: 1000, // Amount should be a number, not a string
          purchase_order_id: "Order01",
          purchase_order_name: "test",
          customer_info: {
            name: "Ram Bahadur",
            email: "test@khalti.com",
            phone: "9800000001",
          },
        }),
      });
  
      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("Khalti API Error Response:", errorResponse);
        throw new Error(`Failed to initialize Khalti payment: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error initializing Khalti payment:", error);
      throw error;
    }
  }
