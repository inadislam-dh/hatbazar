const Model = require('../model/user.model')
const query = require('../db/db')

exports.Home = async (req, res, next) => {
    let sd = await Model.find({}, 'site_setting')
    if (!sd.length) {
        sd = "Please set a Logo"
    }
    let menu = await Model.find({}, 'menu')
    if (!menu.length) {
        menu = "Please create a Menu"
    }
    let cat = await Model.find({status: 1}, 'category')
    if (!cat.length) {
        cat = "No category found"
    }
    let offer = await Model.find({}, 'offer')
    if (!offer.length) {
        offer = "No Offer found"
    }
    let products = await Model.find({}, 'products')
    if (!products.length) {
        products = "No Product found"
    }
    let sliders = await Model.find({}, 'sliders')
    if (!sliders.length) {
        sliders = "No sliders found"
    }
    
    const data = {
        site_settings: sd,
        menu,
        category: cat,
        offer,
        products,
        sliders
    }

    return res.status(200).json(data)
}

exports.Dashboard = async (req, res, next) => {
    const rev = await Model.find({}, 'user_order')
    let price = []
    let proce = []
    let pendi = []
    let hold = []
    let cance = []
    let compl = []
    let today = {
        to: 0,
        tp: 0,
        tpp: 0,
        th: 0,
        tc: 0,
        tco: 0,
        tcl: [],
    }
    let notime = Date.now()
    const h = Object.values(rev)
    for (let i = 0; i <= h.length-1; i++) {
        if ((Math.abs(notime - new Date(h[i].created_at).getTime()) / 36e5) <= 24) {
            today.to += 1
            today.tcl.push({
                date: h[i].created_at,
                customer_name: h[i].customer_name,
                customer_phone: h[i].customer_phone,
                customer_address: h[i].customer_address,
                total: h[i].total,
                status: h[i].status,
                
            })
        }
        if (h[i].status === "completed") {
            price.push(h[i].total)
            compl.push(h[i])
            if ((Math.abs(notime - new Date(h[i].created_at).getTime()) / 36e5) <= 24) {
                today.tco = compl.length
            }
        }
        if (h[i].status === "processing") {
            proce.push(h[i])
            if ((Math.abs(notime - new Date(h[i].created_at).getTime()) / 36e5) <= 24) {
                today.tp = proce.length
            }
        }
        if (h[i].status === "pending payment") {
            pendi.push(h[i])
            if ((Math.abs(notime - new Date(h[i].created_at).getTime()) / 36e5) <= 24) {
                today.tpp = pendi.length
            }
        }
        if (h[i].status === "hold") {
            hold.push(h[i])
            if ((Math.abs(notime - new Date(h[i].created_at).getTime()) / 36e5) <= 24) {
                today.th = hold.length
            }
        }
        if (h[i].status === "canceled") {
            cance.push(h[i])
            if ((Math.abs(notime - new Date(h[i].created_at).getTime()) / 36e5) <= 24) {
                today.tc = cance.length
            }
        }
    }
    let reven = !rev.length ? (reven = "No order Found") : price.reduce((p, a) => p + a,0)
    let staff = await Model.find({}, 'users');
    let product = await Model.find({}, 'products');

    const dashboard = {
        revenue: reven,
        processing: !proce ? "No Order found" : proce.length,
        pending: !pendi ? "No Order found" : pendi.length,
        hold: !hold ? "No Order found" : hold.length,
        canceled: !cance ? "No Order found" : cance.length,
        completed: !compl ? "No Order found" : compl.length,
        staff: !staff.length ? "No Staff found" : staff.length,
        order: !rev.length ? "No order found" : rev.length,
        product: !product.length ? "No User found" : product.length,
        customer: !rev.length ? "No customer found" : rev.length,
        today,
    }
    res.status(200).json(dashboard)
}

exports.Customer = async (req, res, next) => {
    const resp = await Model.find({}, 'user_order')

    var clients = []
    for (let i = 0; i <= resp.length-1; i++) {
        clients.push({customer_name: resp[i].customer_name, customer_phone: resp[i].customer_phone, customer_address: resp[i].customer_address})
    }

    res.status(200).json({
        clients,
    })
}