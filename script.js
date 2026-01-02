let orders = JSON.parse(localStorage.getItem("orders")) || [];

/* LOGIN */
function login() {
    const role = document.getElementById("role").value;

    document.getElementById("loginBox").classList.add("hidden");

    if (role === "user") {
        document.getElementById("userBox").classList.remove("hidden");
        loadUserOrders();
    } else {
        document.getElementById("adminBox").classList.remove("hidden");
        loadAdminOrders();
    }
}

/* LOGOUT */
function logout() {
    location.reload();
}

/* PLACE ORDER */
function placeOrder() {
    const productSelect = document.getElementById("product");
    const price = productSelect.options[productSelect.selectedIndex].dataset.price;
    const quantity = document.getElementById("quantity").value;
    const total = price * quantity;

    const order = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        product: productSelect.value,
        quantity,
        total,
        status: "Pending"
    };

    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    alert("✅ Order placed successfully!");
    loadUserOrders();
}

/* USER ORDERS */
function loadUserOrders() {
    let output = "";
    orders.forEach(o => {
        output += `
        <p>
            ${o.product} × ${o.quantity}<br>
            Total: ₹${o.total}<br>
            Status: <b>${o.status}</b>
        </p>
        <hr>`;
    });
    document.getElementById("userOrders").innerHTML = output;
}

/* ADMIN ORDERS */
function loadAdminOrders() {
    let output = "";
    orders.forEach((o, i) => {
        output += `
        <p>
            <b>${o.name}</b><br>
            ${o.product} × ${o.quantity}<br>
            Total: ₹${o.total}<br>
            Status: ${o.status}<br>
            <button onclick="approve(${i})">Approve</button>
            <button onclick="reject(${i})">Reject</button>
        </p>
        <hr>`;
    });

    document.getElementById("adminOrders").innerHTML = output;
    drawChart();
}

/* APPROVE */
function approve(i) {
    orders[i].status = "Approved";
    localStorage.setItem("orders", JSON.stringify(orders));
    loadAdminOrders();
}

/* REJECT */
function reject(i) {
    orders[i].status = "Rejected";
    localStorage.setItem("orders", JSON.stringify(orders));
    loadAdminOrders();
}

/* ADMIN CHART */
function drawChart() {
    let pending = 0, approved = 0, rejected = 0;

    orders.forEach(o => {
        if (o.status === "Pending") pending++;
        else if (o.status === "Approved") approved++;
        else rejected++;
    });

    const canvas = document.getElementById("statusChart");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const total = pending + approved + rejected;
    const barWidth = 50;
    const maxHeight = 150;

    const values = [pending, approved, rejected];
    const colors = ["orange", "green", "red"];
    const labels = ["Pending", "Approved", "Rejected"];

    values.forEach((val, i) => {
        const height = total ? (val / total) * maxHeight : 0;

        ctx.fillStyle = colors[i];
        ctx.fillRect(60 + i * 80, 180 - height, barWidth, height);

        ctx.fillStyle = "black";
        ctx.fillText(labels[i], 55 + i * 80, 195);
        ctx.fillText(val, 75 + i * 80, 170 - height);
    });
}

