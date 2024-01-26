import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const POST = async (req, res) => {
    if (req.method === "POST") {
        const {cart, userId} = await req.json();
        try {
            // Create Checkout Sessions from body params.
            const params = {
                submit_type: "pay",
                mode: "payment",
                payment_method_types: ["card"],
                billing_address_collection: "auto",
                shipping_options: [
                    {shipping_rate: "shr_1OcwCcAjBe48DkWLgCrb7wlQ"},
                    {shipping_rate: "shr_1OcwBlAjBe48DkWLpMOcVOPh"},
                ],
                line_items: cart?.map((item) => {
                    return {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: item.title,
                                images: [
                                    `${req.headers.get("origin")}/${
                                        item.image
                                    }`,
                                ],
                                metadata: {
                                    productId: item.workId,
                                },
                            },
                            unit_amount: item.price * 100,
                        },
                        quantity: item.quantity,
                    };
                }),
                client_reference_id: userId,
                mode: "payment",
                success_url: `${req.headers.get("origin")}/success`,
                cancel_url: `${req.headers.get("origin")}/canceled`,
            };
            const session = await stripe.checkout.sessions.create(params);
            return new Response(JSON.stringify(session), {status: 200});
        } catch (err) {
            console.log(err);
            return new Response("Failed to chaeckout", {status: 500});
        }
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
};
