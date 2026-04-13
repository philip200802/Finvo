import StatusBadge from '../atoms/StatusBadge'

function TaxSummaryTable({ rows }) {
    return (
        <div className="table-responsive">
            <table className="table finvo-table mb-0">
                <thead>
                    <tr>
                        <th>Quarter</th>
                        <th>Taxable Income</th>
                        <th>VAT (7%)</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.quarter}>
                            <td>{row.quarter}</td>
                            <td className="text-light">{row.taxableIncome}</td>
                            <td>{row.vat}</td>
                            <td>
                                <StatusBadge status={row.status} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TaxSummaryTable
