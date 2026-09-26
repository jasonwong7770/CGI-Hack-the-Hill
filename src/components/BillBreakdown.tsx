export default function BillBreakdown() {
    return (
        <section className="card">
            <h2>Bill Breakdown</h2>
            <p className="last-updated">Last updated: September 26, 2026 at 12:15 PM</p>

            <div className="total">
                <p>Current Billing Period: September 1-30, 2026</p>
            </div>

            <div>
                <div className="bill-row">
                    <h3>Electricity Usage: $82.40</h3>
                </div>

                <div className="bill-row">
                    <h3>Water Usage: $34.70</h3>
                </div>

                <div className="bill-row">
                    <h3>Service/Delivery Charges: $21.30</h3>
                </div>

                <div className="bill-row">
                    <h3>Taxes: $13.85</h3>
                </div>

                <div className="bill-row bill-total">
                    <h3>Amount Due: $152.30</h3>
                </div>
            </div>
        </section>
    )
}