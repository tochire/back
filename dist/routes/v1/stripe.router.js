"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stripe_1 = require("stripe");
const User_1 = require("../../models/User/User");
const constants_1 = require("../../constants");
const stripe = new stripe_1.Stripe(constants_1.__stripe_secret_key__, {
    apiVersion: "2020-08-27",
});
const router = (0, express_1.Router)();
router.post("/subscribe", async (req, res) => {
    let user = await User_1.User.findOne({ _id: req.user.id });
    let customer = (await stripe.customers.list({
        email: user.email,
    })).data[0];
    let pm = "";
    if (req.body.pm === "default") {
        if (!customer || !customer.id) {
            return res.status(400).json({
                msg: "Client does not exist",
            });
        }
        pm = customer.invoice_settings.default_payment_method;
    }
    else {
        pm = req.body.pm;
    }
    if (!customer || !customer.id) {
        customer = await stripe.customers.create({
            email: user.email,
            payment_method: pm,
            invoice_settings: {
                default_payment_method: pm,
            },
        });
    }
    if (customer.invoice_settings.default_payment_method !== pm) {
        await stripe.paymentMethods.attach(pm, {
            customer: customer.id,
        });
        await stripe.customers.update(customer.id, {
            invoice_settings: {
                default_payment_method: pm,
            },
        });
    }
    const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
            {
                plan: req.body.plan,
            },
        ],
        expand: ["latest_invoice.payment_intent"],
    });
    if (subscription.status === "active") {
        req.user.plan = req.body.plan;
        await user.save();
        return res.status(200).json({
            msg: "perfect!",
        });
    }
    else {
        return res.status(400).json({
            msg: "Payment not processed!",
        });
    }
});
exports.default = router;
